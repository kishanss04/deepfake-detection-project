from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from deepfake_detector import DeepfakeDetector
import os
import logging
from pathlib import Path
import shutil
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create and mount static directory for videos
UPLOAD_DIR = Path("static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize detector
try:
    detector = DeepfakeDetector('models/deepfake_model.h5')
except Exception as e:
    logger.error(f"Failed to initialize detector: {e}")
    raise

def save_upload_file(upload_file: UploadFile) -> Path:
    """Save an upload file and return the path"""
    try:
        # Generate unique filename
        file_id = uuid.uuid4()
        file_extension = Path(upload_file.filename).suffix
        filename = f"{file_id}{file_extension}"
        file_path = UPLOAD_DIR / filename
        
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
            
        return file_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

@app.post("/analyze")
async def analyze_video(video: UploadFile = File(...)):
    if not video.filename:
        raise HTTPException(status_code=400, detail="No file provided")
        
    if not video.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="File must be a video")
    
    try:
        # Save uploaded file
        file_path = save_upload_file(video)
        
        # Run detection
        result = detector.detect_deepfake(str(file_path))
        
        # Generate video URL
        video_url = f"/static/uploads/{file_path.name}"
        
        # Format response
        response = {
            "prediction": "fake" if result['overall_result'] else "real",
            "confidence": float(result['confidence']),
            "frames_analyzed": result['frames_analyzed'],
            "deepfake_frame_count": result['deepfake_frame_count'],
            "details": result['frame_details'],
            "video_url": video_url  # Include video URL in response
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing video: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing video: {str(e)}")

# Optional: Add endpoint to cleanup old videos
@app.delete("/cleanup")
async def cleanup_old_videos():
    """Clean up videos older than 1 hour"""
    try:
        current_time = time.time()
        for video_path in UPLOAD_DIR.glob("*"):
            if current_time - video_path.stat().st_mtime > 3600:  # 1 hour
                video_path.unlink()
        return {"message": "Cleanup completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during cleanup: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)