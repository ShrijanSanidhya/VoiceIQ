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
        from services.langchain_service import chat_with_transcript
        from fastapi.concurrency import run_in_threadpool
        
        # Convert Pydantic ChatMessage list to list of dicts
        chat_history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]
        
        def run_chat():
            return chat_with_transcript(
                question=request.question,
                transcript=request.transcript,
                chat_history=chat_history_dicts
            )
            
        try:
            result = await run_in_threadpool(run_chat)
        except Exception as e:
            error_msg = str(e).lower()
            if "rate limit" in error_msg or "429" in error_msg or "quota" in error_msg:
                result = {
                    "answer": "I'm sorry, but the Gemini API quota has been exceeded for today. Please try again tomorrow.",
                    "sources": []
                }
            else:
                raise e
        
        return ChatResponse(
            answer=result.get("answer", "I'm sorry, I couldn't generate an answer."),
            sources=result.get("sources", [])
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat QA failed error: {str(e)}"
        )
