import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".mp3", ".mp4", ".wav", ".m4a"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB limit

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Pydantic model for the response
class UploadResponse(BaseModel):
    filename: str
    file_path: str
    file_size: int
    duration: float | None = None  # Duration to be populated later

@router.post("/upload", response_model=UploadResponse)
async def upload_audio(file: UploadFile = File(...)):
    """
    Accepts audio/video files (mp3, mp4, wav, m4a).
    Enforces a max file size of 100MB.
    Saves file to uploads/ folder with a unique filename.
    """
    try:
        # Validate file extension
        _, ext = os.path.splitext(file.filename)
        if ext.lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Wrong file format error. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Read file contents
        file_content = await file.read()
        file_size = len(file_content)
        
        # Validate file size
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File too large error. Maximum allowed size is 100MB."
            )
            
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{ext.lower()}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file to disk
        with open(file_path, "wb") as f:
            f.write(file_content)
            
        # Mock duration for now (will extract using audio processing library later)
        duration = 0.0
        
        return UploadResponse(
            filename=unique_filename,
            file_path=file_path,
            file_size=file_size,
            duration=duration
        )
        
    except HTTPException:
        # Re-raise known HTTP exceptions
        raise
    except Exception as e:
        # Catch-all for upload failed error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed error: {str(e)}"
        )
