from fastapi import APIRouter

router = APIRouter()

# Route to trigger summarization
@router.post("/summarize")
async def summarize_transcript(transcript: dict):
    # TODO: Call gemini_service or langchain_service to generate summary
    return {"summary": "Summary placeholder", "action_items": []}
