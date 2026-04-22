from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["Chat"])

# Request and Response Models
class ChatMessage(BaseModel):
    role: str      # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    question: str
    transcript: str
    chat_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]  # Which parts of the transcript were used

@router.post("/chat", response_model=ChatResponse)
async def chat_with_transcript(request: ChatRequest):
    """
    Accepts question and transcript. Uses RAG via langchain_service
    to answer the question while maintaining chat history context.
    """
    try:
        # TODO: Call langchain_service to get answer using RAG
        
        # Mocked response
        return ChatResponse(
            answer="This is a mock answer generated from the provided transcript.",
            sources=["Source excerpt from transcript..."]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat QA failed error: {str(e)}"
        )
