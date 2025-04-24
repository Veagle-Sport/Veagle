import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).resolve().parents[1]  # Adjust if needed
sys.path.append(str(project_root))

import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from threading import Thread
from dotenv import load_dotenv
from pathlib import Path
from match_analysis.match_analysis import analyze_video
from datetime import datetime

# Load environment variables
env_path = Path(__file__).resolve().parents[1] / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# ===== Configuration =====
MONGODB_URI = "mongodb+srv://insharo:Ny4XfD7pJWEY5QBu@cluster0.tdyv5wj.mongodb.net/veagle"  # Default local
MONGO_DB_NAME = "veagle"

FLASK_HOST="0.0.0.0"
FLASK_PORT="5000"
FLASK_DEBUG=True

# ===== Database Setup =====


if not MONGODB_URI or not MONGO_DB_NAME:
    raise ValueError("MongoDB connection details missing in .env file")

try:
    client = MongoClient(MONGODB_URI)
    # Test the connection
    client.admin.command('ping')
    db = client[MONGO_DB_NAME]
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    raise

def validate_analysis_results(results):
    """Validate the structure and data types of analysis results"""
    required_fields = [
        "originalVideo", "analyzedVideo", "playersImage", 
        "passes", "shotsOnGoal", "corners", "saves", 
        "goals", "fouls", "cleanSheets", "playersStats"
    ]
    
    # Check if all required fields exist
    for field in required_fields:
        if field not in results:
            raise ValueError(f"Missing required field: {field}")
    
    # Validate numeric fields
    numeric_fields = ["passes", "shotsOnGoal", "corners", "saves", "goals", "fouls"]
    for field in numeric_fields:
        if not isinstance(results[field], (int, float)):
            raise ValueError(f"Field {field} must be numeric")
    
    # Validate boolean field
    if not isinstance(results["cleanSheets"], bool):
        raise ValueError("cleanSheets must be boolean")
    
    # Validate playersStats array
    if not isinstance(results["playersStats"], list):
        raise ValueError("playersStats must be an array")
    
    for player in results["playersStats"]:
        if not isinstance(player, dict):
            raise ValueError("Each player in playersStats must be an object")
        
        # Validate player fields
        player_fields = ["AIModelId", "playerId", "playerType", "stats"]
        for field in player_fields:
            if field not in player:
                raise ValueError(f"Player missing required field: {field}")
        
        # Validate AIModelId - allow both numeric and string types
        if not isinstance(player["AIModelId"], (int, str)):
            # Try to convert to string if it's not already
            try:
                player["AIModelId"] = str(player["AIModelId"])
            except:
                raise ValueError("AIModelId must be convertible to string")
        
        # Validate playerType
        if player["playerType"] not in ["Outfielder", "goalKeeper"]:
            raise ValueError("playerType must be either 'Outfielder' or 'goalKeeper'")
        
        # Validate stats object
        if not isinstance(player["stats"], dict):
            raise ValueError("Player stats must be an object")
        
        # Validate goalkeeper stats
        if player["playerType"] == "goalKeeper":
            gk_stats = ["saves", "cleanSheets", "passes"]
            for stat in gk_stats:
                if stat not in player["stats"]:
                    raise ValueError(f"Goalkeeper missing required stat: {stat}")
        
        # Validate outfielder stats
        else:
            of_stats = ["passes", "speed", "corners", "shotsOnGoal"]
            for stat in of_stats:
                if stat not in player["stats"]:
                    raise ValueError(f"Outfielder missing required stat: {stat}")

def process_video_async(file_path, match_id):
    """Process video in background (async)"""
    try:
        # Convert string ID to ObjectId
        match_object_id = ObjectId(match_id)
        
        # Check if match exists
        existing_match = db.matches.find_one({"_id": match_object_id})
        if not existing_match:
            raise ValueError(f"Match with ID {match_id} not found in database")
        
        # Update match status to processing
        db.matches.update_one(
            {"_id": match_object_id},
            {"$set": {
                "status": "Processing",
                "file_path": file_path,
                "startTime": "00:00",
                "endTime": "00:00",
                "NumberOfPlayers": 0,  # Will be updated after analysis
                "weather": "unknown",
                "timeOfDay": "unknown"
            }}
        )
        
        # ==== Process the video =====
        analysis_results = analyze_video(file_path)
        
        # Validate results before saving
        try:
            validate_analysis_results(analysis_results)
        except ValueError as ve:
            raise ValueError(f"Invalid analysis results: {str(ve)}")
        
        # Count number of players from analysis results
        number_of_players = len(analysis_results.get("playersStats", []))
        
        # Update match with analysis results
        db.matches.update_one(
            {"_id": match_object_id},
            {"$set": {
                "originalVideo": analysis_results["originalVideo"],
                "analyzedVideo": analysis_results["analyzedVideo"],
                "playersImage": analysis_results["playersImage"],
                "passes": analysis_results["passes"],
                "shotsOnGoal": analysis_results["shotsOnGoal"],
                "corners": analysis_results["corners"],
                "saves": analysis_results["saves"],
                "goals": analysis_results["goals"],
                "fouls": analysis_results["fouls"],
                "cleanSheets": analysis_results["cleanSheets"],
                "playersStats": analysis_results["playersStats"],
                "status": "Completed",
                "NumberOfPlayers": number_of_players,
                "matchDate": datetime.utcnow()
            }}
        )
        
        # Search and update by modelID
        for player in analysis_results.get("playersStats", []):
            model_id = player.get("AIModelId")
            if model_id:
                try:
                    # Search for existing player record
                    existing_player = db.players.find_one({"AIModelId": model_id})
                    
                    if existing_player:
                        # Update existing player record - only update stats
                        db.players.update_one(
                            {"AIModelId": model_id},
                            {"$set": {
                                "stats": player.get("stats", {})
                            }}
                        )
                        print(f"Successfully updated player record for modelID: {model_id}")
                    else:
                        print(f"Skipping player with modelID: {model_id} - no existing record found")
                except Exception as e:
                    print(f"Error updating player record for modelID {model_id}: {str(e)}")
                    # Continue with other players even if one fails
                    continue
        
        print(f"Analysis completed successfully for match ID: {match_id}")
        
    except Exception as e:
        error_message = f"Failed to process video: {str(e)}"
        print(error_message)
        
        # Update match status to failed
        try:
            db.matches.update_one(
                {"_id": match_object_id},
                {"$set": {
                    "status": "failed",
                    "error": error_message
                }}
            )
        except Exception as update_error:
            print(f"Failed to update error status: {str(update_error)}")
        
        # Log the error in a separate collection
        try:
            db.error_logs.insert_one({
                "match_id": match_id,
                "timestamp": datetime.utcnow(),
                "error": error_message,
                "file_path": file_path
            })
        except Exception as log_error:
            print(f"Failed to log error: {str(log_error)}")

@app.route('/analyze', methods=['POST'])
def analyze_video_endpoint():
    """API endpoint to start video analysis"""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415
    
    data = request.get_json()
    file_path = data.get('file_path')
    match_id = data.get('match_id')
    
    if not file_path or not isinstance(file_path, str):
        return jsonify({"error": "Valid file_path is required"}), 400
        
    if not match_id or not isinstance(match_id, str):
        return jsonify({"error": "Valid match_id is required"}), 400
    
    # Verify file exists
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    # Verify match exists
    try:
        match_object_id = ObjectId(match_id)
        existing_match = db.matches.find_one({"_id": match_object_id})
        if not existing_match:
            return jsonify({"error": f"Match with ID {match_id} not found in database"}), 404
    except Exception as e:
        return jsonify({"error": f"Invalid match ID format: {str(e)}"}), 400
    
    # Start async processing
    Thread(target=process_video_async, args=(file_path, match_id)).start()
    
    return jsonify({
        "status": "processing",
        "match_id": match_id,
        "message": "Analysis started"
    }), 202

@app.route('/results/<match_id>', methods=['GET'])
def get_results(match_id):
    """Check analysis results"""
    try:
        match_object_id = ObjectId(match_id)
        result = db.matches.find_one({"_id": match_object_id})
        
        if not result:
            return jsonify({"error": "Analysis not found"}), 404
        
        return jsonify({
            "status": result["status"],
            "results": result.get("results"),
            "error": result.get("error")
        })
    except Exception as e:
        return jsonify({"error": f"Invalid match ID format: {str(e)}"}), 400

if __name__ == '__main__':
    print("Starting Flask server...")  # Debug line
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)
    print("Flask server started!")  # Debug line
