from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["Summarize"])

# Request and Response Models
class SummarizeRequest(BaseModel):
    transcript_text: str

class SentimentData(BaseModel):
    label: str  # positive/negative/neutral
    score: float

class ChapterData(BaseModel):
    topic: str
    start_time: float
    end_time: float

class SummarizeResponse(BaseModel):
    summary: List[str]               # Bullet points list
    action_items: List[str]
    sentiment: SentimentData
    chapters: List[ChapterData]      # Topics with timestamps
    key_highlights: List[str]        # Top 5 important points

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_transcript(request: SummarizeRequest):
    """
    Accepts transcript text and calls gemini_service + langchain_service
    to generate summary, action items, sentiment, chapters, and highlights.
    """
    try:
        # TODO: Call gemini_service and langchain_service using request.transcript_text
        
        # Mocked response
        return SummarizeResponse(
            summary=["First bullet point of summary", "Second bullet point of summary"],
            action_items=["Follow up with team", "Review documentation"],
            sentiment=SentimentData(label="positive", score=0.92),
            chapters=[
                ChapterData(topic="Introduction", start_time=0.0, end_time=60.0),
                ChapterData(topic="Main Discussion", start_time=60.0, end_time=300.0)
            ],
            key_highlights=["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4", "Highlight 5"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarization failed error: {str(e)}"
        )
