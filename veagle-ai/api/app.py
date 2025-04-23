import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).resolve().parents[1]  # Adjust if needed
sys.path.append(str(project_root))

import os
import uuid
from flask import Flask, request, jsonify
from pymongo import MongoClient
from threading import Thread
from dotenv import load_dotenv
from pathlib import Path
from match_analysis.match_analysis import analyze_video

# Load environment variables
env_path = Path(__file__).resolve().parents[1] / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)

# ===== Configuration =====
MONGODB_URI = os.getenv("MONGODB_URI")  # Default local
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")  # Your DB name

FLASK_HOST = os.getenv("FLASK_HOST")
FLASK_PORT = int(os.getenv("FLASK_PORT"))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"

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



def process_video_async(file_path):
    """Process video in background (async)"""
    try:
        # Generate analysis ID
        analysis_id = str(uuid.uuid4())
        
        # Initialize DB record
        db.analysis_results.insert_one({
            "analysis_id": analysis_id,
            "status": "processing",
            "file_path": file_path
        })
        # ==== Process the video =====
        analysis_results = analyze_video(file_path)



        # Update DB on success
        db.analysis_results.update_one(
            {"analysis_id": analysis_id},
            {"$set": {
                "results": analysis_results,
                "status": "completed"
            }}
        )
    except Exception as e:
        # Update DB on failure
        db.analysis_results.update_one(
            {"analysis_id": analysis_id},
            {"$set": {
                "status": "failed",
                "error": str(e)
            }}
        )

@app.route('/analyze', methods=['POST'])
def analyze_video_endpoint():
    """API endpoint to start video analysis"""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415
    
    data = request.get_json()
    file_path = data.get('file_path')
    
    if not file_path or not isinstance(file_path, str):
        return jsonify({"error": "Valid file_path is required"}), 400
    
    # Verify file exists
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    # Start async processing
    analysis_id = str(uuid.uuid4())
    Thread(target=process_video_async, args=(file_path,)).start()
    
    return jsonify({
        "status": "processing",
        "analysis_id": analysis_id,
        "message": "Analysis started"
    }), 202

@app.route('/results/<analysis_id>', methods=['GET'])
def get_results(analysis_id):
    """Check analysis results"""
    result = db.analysis_results.find_one({"analysis_id": analysis_id})
    
    if not result:
        return jsonify({"error": "Analysis not found"}), 404
    
    return jsonify({
        "status": result["status"],
        "results": result.get("results"),
        "error": result.get("error")
    })

if __name__ == '__main__':
    print("Starting Flask server...")  # Debug line
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)
    print("Flask server started!")  # Debug line