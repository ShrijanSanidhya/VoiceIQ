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
        import os
        from services.whisper_service import transcribe_audio as whisper_transcribe, detect_speakers
        
        from fastapi.concurrency import run_in_threadpool
        
        file_path = os.path.join("uploads", request.filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found on server")
            
        transcription_data = await run_in_threadpool(whisper_transcribe, file_path)
        speakers_data = await run_in_threadpool(detect_speakers, file_path)
        
        # Extract unique speakers
        speakers_list = list(set([s.get("speaker", "Unknown") for s in speakers_data]))
        
        return TranscribeResponse(
            transcript_text=transcription_data.get("transcript", ""),
            language_detected=transcription_data.get("language", "unknown"),
            duration=transcription_data.get("duration", 0.0),
            timestamps_list=transcription_data.get("timestamps", []),
            speakers_list=speakers_list
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
    Expects client to send a JSON with {"filename": "..."} first.
    """
    await websocket.accept()
    try:
        # Receive filename from client
        data = await websocket.receive_json()
        filename = data.get("filename")
        if not filename:
            await websocket.send_json({"error": "No filename provided"})
            await websocket.close()
            return
            
        import os
        file_path = os.path.join("uploads", filename)
        if not os.path.exists(file_path):
             await websocket.send_json({"error": "File not found on server"})
             await websocket.close()
             return

        # Import the real whisper service
        from services.whisper_service import transcribe_stream
        from fastapi.concurrency import run_in_threadpool
        import asyncio
        
        # Run the blocking transcription in a thread pool so it doesn't freeze the async event loop
        def get_chunks():
            return list(transcribe_stream(file_path))
            
        chunks = await run_in_threadpool(get_chunks)
        
        # Stream chunks back to client
        for chunk in chunks:
            await websocket.send_json(chunk)
            await asyncio.sleep(0.1)  # Simulate streaming delay
            
        await websocket.send_json({"status": "completed"})
        # Explicitly close with normal code 1000 so client receives onclose, not onerror
        await websocket.close(code=1000)
            
    except WebSocketDisconnect:
        print("Client disconnected from real-time transcription websocket")
    except Exception as e:
        await websocket.send_json({"error": str(e)})
        await websocket.close(code=1011, reason=str(e))
