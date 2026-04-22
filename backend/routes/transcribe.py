from fastapi import APIRouter

router = APIRouter()

# Route to trigger transcription
@router.post("/transcribe/{filename}")
async def transcribe_audio(filename: str):
    # TODO: Integrate whisper_service to transcribe the audio file
    return {"filename": filename, "transcript": "Transcript placeholder"}
