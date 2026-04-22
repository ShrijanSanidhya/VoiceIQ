from fastapi import APIRouter

router = APIRouter()

# Route for interacting with the transcript via chat
@router.post("/chat")
async def chat_with_transcript(query: dict):
    # TODO: Pass query and transcript context to langchain_service
    return {"reply": "Chat reply placeholder"}
