import os
os.environ["ONNXRUNTIME_EXECUTION_PROVIDERS"] = '[CPUExecutionProvider]'


import cv2
from ultralytics import YOLO
from inference import get_model
import json
from datetime import datetime
import numpy as np
from scipy.spatial.distance import euclidean
from collections import defaultdict
import supervision as sv
from tqdm import tqdm
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parents[1] / '.env'
load_dotenv(dotenv_path=env_path)

ROBOFLOW_API_KEY = os.environ["ROBOFLOW_API_KEY"]  # Raises KeyError if missing

PLAYER_DETECTION_MODEL_ID = os.getenv("PLAYER_DETECTION_MODEL_ID")
FIELD_DETECTION_MODEL_ID = os.getenv("FIELD_DETECTION_MODEL_ID")


FIELD_DETECTION_MODEL = get_model(
    model_id=FIELD_DETECTION_MODEL_ID,
    api_key=ROBOFLOW_API_KEY
)

PLAYER_DETECTION_MODEL = get_model(
    model_id=PLAYER_DETECTION_MODEL_ID,
    api_key=ROBOFLOW_API_KEY,
)


D_POSSESSION = 50    # Max pixel distance for possession
D_MIN_PASS = 100     # Min pixel distance for a pass
T_MAX_PASS = 10      # Max frames between possession changes
GK_CLASS_ID = 1      # Change to your goalkeeper class ID
REFEREE_CLASS_ID = 3 # Change to your referee class ID
BALL_ID = 0          # Ball class ID
SHOT_DETECTION_WINDOW = 15  # Frames to look for goal entry after possession
GOAL_CONFIRMATION_FRAMES = 5  # Number of frames ball must be in goal area to confirm goal

# Goal areas as [left_goal_keypoints, right_goal_keypoints]
LEFT_GOAL_KEYPOINTS = [3, 4]
RIGHT_GOAL_KEYPOINTS = [29, 30]

def initialize_tracker():
    """Initialize tracking components"""
    tracker = sv.ByteTrack()
    tracker.reset()
    
    box_annotator = sv.BoxAnnotator(
        color=sv.ColorPalette.from_hex(['#FF5733', '#33FF57', '#3357FF']),
        thickness=2
    )
    label_annotator = sv.LabelAnnotator(
        color=sv.ColorPalette.from_hex(['#FF5733', '#33FF57', '#3357FF']),
        text_color=sv.Color.from_hex("#000000"),
        text_position=sv.Position.BOTTOM_CENTER
    )
    
    return tracker, box_annotator, label_annotator

def track_objects(frame, model, tracker, box_annotator, label_annotator, 
                 gk_class_id=GK_CLASS_ID, ref_class_id=REFEREE_CLASS_ID, ball_class_id=BALL_ID):
    """
    Track all objects (players and ball) with proper identification
    """
    if not hasattr(track_objects, "id_manager"):
        class IDManager:
            def __init__(self):
                self.next_gk_id = 1
                self.next_player_id = 3
                self.assigned_ids = {}
        track_objects.id_manager = IDManager()
    
    result = model.infer(frame, confidence=0.3)[0]
    detections = sv.Detections.from_inference(result)
    
    # Separate ball detections
    ball_mask = detections.class_id == ball_class_id
    ball_detections = detections[ball_mask]
    
    # Filter out referees from player detections
    player_mask = (detections.class_id != ref_class_id) & (detections.class_id != ball_class_id)
    player_detections = detections[player_mask]
    
    # Track players (excluding ball and referees)
    player_detections = tracker.update_with_detections(player_detections)
    
    # Assign custom IDs with GK tagging
    new_tracker_ids = []
    for class_id, tracker_id in zip(player_detections.class_id, player_detections.tracker_id):
        if tracker_id in track_objects.id_manager.assigned_ids:
            new_id = track_objects.id_manager.assigned_ids[tracker_id]
        else:
            if class_id == gk_class_id:
                new_id = track_objects.id_manager.next_gk_id
                track_objects.id_manager.next_gk_id += 1
            else:
                new_id = track_objects.id_manager.next_player_id
                track_objects.id_manager.next_player_id += 1
            track_objects.id_manager.assigned_ids[tracker_id] = new_id
        new_tracker_ids.append(new_id)
    
    player_detections.tracker_id = np.array(new_tracker_ids)
    player_detections.is_goalkeeper = (player_detections.class_id == gk_class_id)
    
    # Annotate players
    labels = [
        f"GK-{tracker_id}" if is_gk else f"P-{tracker_id}"
        for tracker_id, is_gk in zip(player_detections.tracker_id, player_detections.is_goalkeeper)
    ]
    annotated_frame = box_annotator.annotate(frame.copy(), detections=player_detections)
    annotated_frame = label_annotator.annotate(annotated_frame, detections=player_detections, labels=labels)
    
    # Annotate ball (if detected) - only use the most confident detection
    if len(ball_detections) > 0:
        # Get the detection with highest confidence
        best_ball_idx = np.argmax(ball_detections.confidence)
        best_ball_detection = sv.Detections(
            xyxy=ball_detections.xyxy[best_ball_idx:best_ball_idx+1],
            confidence=ball_detections.confidence[best_ball_idx:best_ball_idx+1],
            class_id=ball_detections.class_id[best_ball_idx:best_ball_idx+1]
        )
        
        best_ball_detection.tracker_id = np.array([0])  # Fixed ID for ball
        ball_labels = ["BALL"]
        annotated_frame = box_annotator.annotate(annotated_frame, detections=best_ball_detection)
        annotated_frame = label_annotator.annotate(annotated_frame, detections=best_ball_detection, labels=ball_labels)
        
        return annotated_frame, player_detections, best_ball_detection
    
    return annotated_frame, player_detections, None

def get_field_keypoints(frame, field_keypoint_model):
    """
    Extract field keypoints from the frame using the keypoint detection model
    """
    result = field_keypoint_model.infer(frame)[0]
    keypoints = {}
    
    # Extract keypoints from model result
    # Format will depend on your specific model's output structure
    # This is a placeholder - adjust based on your model's output format
    if hasattr(result, 'keypoints'):
        for idx, kp in enumerate(result.keypoints):
            keypoints[idx] = (int(kp.x), int(kp.y))
    
    return keypoints

def is_in_goal_area(ball_center, keypoints, is_left_goal=True):
    """
    Check if the ball is in the goal area based on field keypoints
    """
    if not keypoints:
        return False
        
    goal_keypoints = LEFT_GOAL_KEYPOINTS if is_left_goal else RIGHT_GOAL_KEYPOINTS
    
    # Check if all required keypoints are detected
    if not all(kp_id in keypoints for kp_id in goal_keypoints):
        return False
    
    # Create a bounding box around the goal posts with some padding
    x_coords = [keypoints[kp_id][0] for kp_id in goal_keypoints]
    y_coords = [keypoints[kp_id][1] for kp_id in goal_keypoints]
    
    goal_x_min = min(x_coords) - 10
    goal_x_max = max(x_coords) + 10
    goal_y_min = min(y_coords) - 10
    goal_y_max = max(y_coords) + 30  # Higher padding at bottom to include goal area
    
    # Check if ball center is within goal area
    x, y = ball_center
    return (goal_x_min <= x <= goal_x_max) and (goal_y_min <= y <= goal_y_max)

def process_video(video_path, player_model, field_keypoint_model):
    """Process video and return tracking data for players and ball"""
    tracker, box_annotator, label_annotator = initialize_tracker()
    frame_generator = sv.get_video_frames_generator(video_path)
    video_info = sv.VideoInfo.from_video_path(video_path)
    
    player_data = defaultdict(list)
    ball_data = []
    field_keypoints_data = []
    
    for frame_num, frame in enumerate(tqdm(frame_generator, total=video_info.total_frames)):
        # Track all objects (players and ball)
        _, player_detections, ball_detection = track_objects(
            frame, player_model, tracker, box_annotator, label_annotator)
        
        # Get field keypoints
        keypoints = get_field_keypoints(frame, field_keypoint_model)
        field_keypoints_data.append({
            'frame_num': frame_num,
            'keypoints': keypoints
        })
        
        # Store player data
        for i, tracker_id in enumerate(player_detections.tracker_id):
            player_data[tracker_id].append({
                'frame_num': frame_num,
                'bbox': player_detections.xyxy[i],
                'class_id': player_detections.class_id[i],
                'confidence': player_detections.confidence[i]
            })
        
        # Store ball data if detected
        if ball_detection is not None:
            ball_data.append({
                'frame_num': frame_num,
                'bbox': ball_detection.xyxy[0]
            })
    
    return player_data, ball_data, field_keypoints_data

def detect_goals_and_scorers(player_data, ball_data, field_keypoints_data):
    """
    Detect goals, identify the scorers and goalkeepers involved
    Returns:
        - goals: List of (player_id, frame_num, is_left_goal)
        - scored_against: Dict mapping goalkeeper IDs to list of goal frames conceded
    """
    goals = []  # List of (scorer_id, frame_num, is_left_goal) tuples
    scored_against = defaultdict(list)  # Dict of goalkeeper_id -> list of frame numbers
    
    # Create ball position mapping
    ball_positions = {det['frame_num']: det['bbox'] for det in ball_data}
    
    # Create field keypoints mapping
    keypoints_by_frame = {data['frame_num']: data['keypoints'] for data in field_keypoints_data}
    
    # Identify goalkeepers first
    goalkeeper_ids = set()
    for player_id, detections in player_data.items():
        if any(det['class_id'] == GK_CLASS_ID for det in detections):
            goalkeeper_ids.add(player_id)
    
    # Identify ball possession sequences
    ball_possessions = []  # List of (player_id, start_frame, end_frame) tuples
    current_possession = None
    
    # First, identify all ball possessions
    for frame_num in sorted(ball_positions.keys()):
        ball_bbox = ball_positions[frame_num]
        ball_center = [(ball_bbox[0]+ball_bbox[2])/2, (ball_bbox[1]+ball_bbox[3])/2]
        
        closest_player = None
        min_distance = float('inf')
        
        # Find closest player to ball
        for player_id, detections in player_data.items():
            player_at_frame = next((d for d in detections if d['frame_num'] == frame_num), None)
            if player_at_frame:
                player_bbox = player_at_frame['bbox']
                player_center = [(player_bbox[0]+player_bbox[2])/2, (player_bbox[1]+player_bbox[3])/2]
                distance = euclidean(player_center, ball_center)
                
                if distance < min_distance:
                    min_distance = distance
                    closest_player = player_id
        
        # Check if ball is in possession (close enough to a player)
        if min_distance <= D_POSSESSION:
            if current_possession is None or current_possession[0] != closest_player:
                # New possession starts
                if current_possession:
                    # End previous possession
                    ball_possessions.append((current_possession[0], current_possession[1], frame_num-1))
                # Start new possession
                current_possession = (closest_player, frame_num)
        elif current_possession and frame_num - current_possession[1] > T_MAX_PASS:
            # End possession if ball has been away from any player for too long
            ball_possessions.append((current_possession[0], current_possession[1], frame_num-1))
            current_possession = None
    
    # Close the last possession if needed
    if current_possession:
        ball_possessions.append((current_possession[0], current_possession[1], max(ball_positions.keys())))
    
    # Track goal events
    goal_event_frames = []  # Keep track of goal frames to avoid double counting
    
    # Check for goals after each possession
    for player_id, start_frame, end_frame in ball_possessions:
        # Skip if player is a goalkeeper (usually not scoring)
        if player_id in goalkeeper_ids:
            continue
            
        # Check for ball movement toward goal areas after possession
        check_until_frame = min(end_frame + SHOT_DETECTION_WINDOW, max(ball_positions.keys()))
        
        # Skip if we've already counted a goal in this time period
        if any(frame >= start_frame and frame <= check_until_frame for frame in goal_event_frames):
            continue
        
        # Get ball positions during and after possession
        shot_frames = range(end_frame, check_until_frame + 1)
        relevant_ball_positions = {f: ball_positions[f] for f in shot_frames if f in ball_positions}
        
        if not relevant_ball_positions:
            continue
        
        # Check for consecutive frames with ball in goal to confirm goal
        consecutive_goal_frames = 0
        current_goal_type = None  # left or right
        goal_frame = None
        
        for frame_num in sorted(relevant_ball_positions.keys()):
            if frame_num not in keypoints_by_frame:
                consecutive_goal_frames = 0
                continue
                
            ball_bbox = relevant_ball_positions[frame_num]
            ball_center = [(ball_bbox[0]+ball_bbox[2])/2, (ball_bbox[1]+ball_bbox[3])/2]
            keypoints = keypoints_by_frame[frame_num]
            
            # Check left goal
            in_left_goal = is_in_goal_area(ball_center, keypoints, is_left_goal=True)
            in_right_goal = is_in_goal_area(ball_center, keypoints, is_left_goal=False)
            
            if in_left_goal and (current_goal_type is None or current_goal_type == "left"):
                consecutive_goal_frames += 1
                current_goal_type = "left"
                if consecutive_goal_frames == 1:
                    goal_frame = frame_num
            elif in_right_goal and (current_goal_type is None or current_goal_type == "right"):
                consecutive_goal_frames += 1
                current_goal_type = "right"
                if consecutive_goal_frames == 1:
                    goal_frame = frame_num
            else:
                # Reset if ball leaves goal area
                consecutive_goal_frames = 0
                current_goal_type = None
            
            # Confirm goal after enough consecutive frames
            if consecutive_goal_frames >= GOAL_CONFIRMATION_FRAMES:
                is_left_goal = (current_goal_type == "left")
                goals.append((player_id, goal_frame, is_left_goal))
                goal_event_frames.append(goal_frame)
                
                # Now determine which goalkeeper conceded
                for gk_id in goalkeeper_ids:
                    gk_at_frame = next((d for d in player_data[gk_id] if abs(d['frame_num'] - goal_frame) < 30), None)
                    if gk_at_frame:
                        # Simple approach: check if goalkeeper is on the same side as the goal
                        gk_bbox = gk_at_frame['bbox']
                        gk_center_x = (gk_bbox[0] + gk_bbox[2]) / 2
                        
                        # Left side of the field has a goalkeeper involved in right goal
                        frame_width = max([kp[0] for keypoints in keypoints_by_frame.values() 
                                         for kp in keypoints.values()], default=1920)
                        is_gk_left_side = gk_center_x < frame_width / 2
                        
                        # If GK is on opposite side of goal, they conceded
                        if is_gk_left_side != is_left_goal:
                            scored_against[gk_id].append(goal_frame)
                        
                break  # Stop analyzing this possession after confirming goal
    
    return goals, scored_against

def calculate_player_stats(player_data, ball_data, field_keypoints_data, fps, pixels_per_meter=140, max_realistic_speed=12):
    """
    Calculate comprehensive player statistics including:
    - Speed metrics (max, avg)
    - Passes
    - Shots on target
    - Goals scored
    - For goalkeepers: clean sheets and goals conceded
    """
    results = {}
    
    # Create ball position mapping
    ball_positions = {det['frame_num']: det['bbox'] for det in ball_data}
    
    # Create field keypoints mapping
    keypoints_by_frame = {data['frame_num']: data['keypoints'] for data in field_keypoints_data}
    
    # Detect goals and identify goalkeepers who conceded
    goals, scored_against = detect_goals_and_scorers(player_data, ball_data, field_keypoints_data)
    
    # Identify all goalkeepers
    goalkeeper_ids = set()
    for player_id, detections in player_data.items():
        if any(det['class_id'] == GK_CLASS_ID for det in detections):
            goalkeeper_ids.add(player_id)
    
    # Identify ball possession sequences
    ball_possessions = []  # List of (player_id, start_frame, end_frame) tuples
    current_possession = None
    
    # First, identify all ball possessions for pass and shot calculation
    for frame_num in sorted(ball_positions.keys()):
        ball_bbox = ball_positions[frame_num]
        ball_center = [(ball_bbox[0]+ball_bbox[2])/2, (ball_bbox[1]+ball_bbox[3])/2]
        
        closest_player = None
        min_distance = float('inf')
        
        # Find closest player to ball
        for player_id, detections in player_data.items():
            player_at_frame = next((d for d in detections if d['frame_num'] == frame_num), None)
            if player_at_frame:
                player_bbox = player_at_frame['bbox']
                player_center = [(player_bbox[0]+player_bbox[2])/2, (player_bbox[1]+player_bbox[3])/2]
                distance = euclidean(player_center, ball_center)
                
                if distance < min_distance:
                    min_distance = distance
                    closest_player = player_id
        
        # Check if ball is in possession
        if min_distance <= D_POSSESSION:
            if current_possession is None or current_possession[0] != closest_player:
                # New possession starts
                if current_possession:
                    # End previous possession
                    ball_possessions.append((current_possession[0], current_possession[1], frame_num-1))
                # Start new possession
                current_possession = (closest_player, frame_num)
        elif current_possession and frame_num - current_possession[1] > T_MAX_PASS:
            # End possession if ball has been away from any player for too long
            ball_possessions.append((current_possession[0], current_possession[1], frame_num-1))
            current_possession = None
    
    # Close the last possession if needed
    if current_possession:
        ball_possessions.append((current_possession[0], current_possession[1], max(ball_positions.keys())))
    
    # Now check for shots on target after each possession
    shots_on_target = defaultdict(int)
    
    for player_id, start_frame, end_frame in ball_possessions:
        # Check for ball movement toward goal areas after possession
        check_until_frame = min(end_frame + SHOT_DETECTION_WINDOW, max(ball_positions.keys()))
        
        # Get ball positions during and after possession
        shot_frames = range(end_frame, check_until_frame + 1)
        relevant_ball_positions = {f: ball_positions[f] for f in shot_frames if f in ball_positions}
        
        if not relevant_ball_positions:
            continue
        
        # Check if ball ended up in either goal
        for frame_num in sorted(relevant_ball_positions.keys()):
            if frame_num not in keypoints_by_frame:
                continue
                
            ball_bbox = relevant_ball_positions[frame_num]
            ball_center = [(ball_bbox[0]+ball_bbox[2])/2, (ball_bbox[1]+ball_bbox[3])/2]
            keypoints = keypoints_by_frame[frame_num]
            
            # Check left goal
            if is_in_goal_area(ball_center, keypoints, is_left_goal=True):
                shots_on_target[player_id] += 1
                break
                
            # Check right goal
            if is_in_goal_area(ball_center, keypoints, is_left_goal=False):
                shots_on_target[player_id] += 1
                break
    
    # Count goals for each player
    goals_by_player = defaultdict(int)
    for player_id, _, _ in goals:
        goals_by_player[player_id] += 1
    
    # Calculate other statistics
    for player_id, detections in player_data.items():
        if len(detections) < 2:
            continue
            
        is_goalkeeper = player_id in goalkeeper_ids
        detections.sort(key=lambda x: x['frame_num'])
        
        # Speed calculation
        speeds = []
        for i in range(1, len(detections)):
            prev = detections[i-1]
            curr = detections[i]
            
            prev_center = [(prev['bbox'][0]+prev['bbox'][2])/2, (prev['bbox'][1]+prev['bbox'][3])/2]
            curr_center = [(curr['bbox'][0]+curr['bbox'][2])/2, (curr['bbox'][1]+curr['bbox'][3])/2]
            
            distance = euclidean(prev_center, curr_center)
            time_passed = (curr['frame_num'] - prev['frame_num']) / fps
            
            if time_passed > 0:
                speed_kmh = (distance / pixels_per_meter) * 3.6 / time_passed
                if speed_kmh <= max_realistic_speed:
                    speeds.append(speed_kmh)
        
        # Pass calculation
        passes = []
        for player_id_, start_frame, end_frame in ball_possessions:
            if player_id_ == player_id:
                passes.append(start_frame)
        
        # Store results with different structure for goalkeepers
        if is_goalkeeper:
            # Goals conceded calculation
            goals_conceded = len(scored_against[player_id])
            clean_sheet = goals_conceded == 0
            
            results[player_id] = {
                'is_goalkeeper': True,
                'max_speed_kmh': max(speeds) if speeds else 0,
                'avg_speed_kmh': np.mean(speeds) if speeds else 0,
                'total_passes': len(passes),
                'clean_sheet': clean_sheet,
                'goals_conceded': goals_conceded,
                'shots_on_target': shots_on_target[player_id],
                'goals_scored': goals_by_player[player_id],
                'pass_frames': passes
            }
        else:
            results[player_id] = {
                'is_goalkeeper': False,
                'max_speed_kmh': max(speeds) if speeds else 0,
                'avg_speed_kmh': np.mean(speeds) if speeds else 0,
                'total_passes': len(passes),
                'shots_on_target': shots_on_target[player_id],
                'goals_scored': goals_by_player[player_id],
                'pass_frames': passes
            }
    
    return results

def analyze_video(video_path):
    """Main function to analyze video and return statistics in API-compatible format"""
    print(f"Analyzing video: {video_path}")
    
    # Process the video
    player_data, ball_data, field_keypoints_data = process_video(
        video_path, PLAYER_DETECTION_MODEL, FIELD_DETECTION_MODEL)
    
    # Calculate statistics
    video_info = sv.VideoInfo.from_video_path(video_path)
    player_stats = calculate_player_stats(player_data, ball_data, field_keypoints_data, video_info.fps)
    
    # Convert to API-compatible format
    total_passes = 0
    total_shots_on_goal = 0
    total_saves = 0
    total_goals = 0
    clean_sheets = True

    players_stats = []
    
    for player_id, stats in player_stats.items():
        # Skip goalkeepers that aren't ID 1 or 2
        if stats['is_goalkeeper'] and player_id not in [1, 2]:
            continue
            
        # Update aggregated stats
        total_passes += int(stats['total_passes'])
        total_shots_on_goal += int(stats['shots_on_target'])
        total_goals += int(stats['goals_scored'])
        
        if stats['is_goalkeeper']:
            total_saves += int(stats['shots_on_target'] - stats['goals_conceded'])
        
        # Create player stats record
        player_record = {
            "playerId": f"{'GK' if stats['is_goalkeeper'] else 'P'}-{player_id}",
            "playerType": "goalKeeper" if stats['is_goalkeeper'] else "player",
            "stats": {
                "passes": int(stats['total_passes']),
                "speed": f"{int(round(stats['max_speed_kmh']))} km/h",
                "shotsOnGoal": int(stats['shots_on_target'])
            }
        }
        
        # Add goalkeeper-specific stats
        if stats['is_goalkeeper']:
            player_record["stats"].update({
                "saves": int(stats['shots_on_target'] - stats['goals_conceded']),
                "cleanSheets": stats['clean_sheet']
            })
            # Remove shotsOnGoal for goalkeepers as per example
            player_record["stats"].pop("shotsOnGoal")
        
        players_stats.append(player_record)
    
    # Set cleanSheets to False if any goals were scored
    if total_goals > 0:
        clean_sheets = False
    
    # Create the output data structure
    analysis_results = {
        "originalVideo": video_path,
        "total_passes": total_passes,
        "total_shotsOnGoal": total_shots_on_goal,
        "total_saves": total_saves,
        "total_goals": total_goals,
        "cleanSheets": clean_sheets,
        "playersStats": players_stats
    }
    
    return analysis_results





def main():
    import argparse
    import json
    from pathlib import Path
    
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Analyze soccer video and extract player statistics.')
    parser.add_argument('video_path', type=str, help='Path to the video file to analyze')
    parser.add_argument('--output', type=str, default='analysis_results.json', 
                       help='Output JSON file path (default: analysis_results.json)')
    
    args = parser.parse_args()
    
    # Validate video path
    video_path = Path(args.video_path)
    if not video_path.exists():
        print(f"Error: Video file not found at {video_path}")
        return
    
    # Run the analysis
    try:
        print(f"Starting analysis of {video_path}...")
        results = analyze_video(str(video_path))
        
        # Save results to JSON file
        output_path = Path(args.output)
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"Analysis complete! Results saved to {output_path}")
        
        # Print summary to console
        print("\nSummary Statistics:")
        print(f"- Total passes: {results['total_passes']}")
        print(f"- Total shots on goal: {results['total_shotsOnGoal']}")
        print(f"- Total saves: {results['total_saves']}")
        print(f"- Total goals: {results['total_goals']}")
        print(f"- Clean sheets: {'Yes' if results['cleanSheets'] else 'No'}")
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        raise

if __name__ == "__main__":
    main()