from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, status
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(tags=["Transcribe"])

# Request and Response Models
class TranscribeRequest(BaseModel):
    filename: str

class TranscribeResponse(BaseModel):
    transcript_text: str
    language_detected: str
    duration: float
    timestamps_list: List[Dict[str, Any]]
    speakers_list: List[str]

@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(request: TranscribeRequest):
    """
    Accepts filename from upload and calls whisper_service.
    Returns transcript text, language, duration, timestamps, and speakers.
    """
    try:
        # TODO: Call whisper_service to transcribe the provided request.filename
        
        # Mocked response
        return TranscribeResponse(
            transcript_text="This is a mocked transcript text.",
            language_detected="en",
            duration=120.5,
            timestamps_list=[{"start": 0.0, "end": 2.0, "text": "This is a"}],
            speakers_list=["Speaker 1"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transcription failed error: {str(e)}"
        )

@router.websocket("/ws/transcribe")
async def websocket_transcribe(websocket: WebSocket):
    """
    WebSocket endpoint for real-time streaming transcription.
    """
    await websocket.accept()
    try:
        while True:
            # Receive audio chunk from client
            data = await websocket.receive_bytes()
            
            # TODO: Process chunk through real-time whisper_service
            
            # Send back partial transcript
            await websocket.send_json({"partial_transcript": "streaming text..."})
            
    except WebSocketDisconnect:
        print("Client disconnected from real-time transcription websocket")
    except Exception as e:
        await websocket.close(code=1011, reason=str(e))
