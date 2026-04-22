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
    Accepts transcript text and calls gemini_service
    to generate summary, action items, sentiment, chapters, and highlights.
    """
    try:
        from services.gemini_service import generate_summary, analyze_sentiment, generate_chapters
        
        # Parallel execution could be used here for speed, but sequential for safety
        summary_data = generate_summary(request.transcript_text)
        sentiment_data = analyze_sentiment(request.transcript_text)
        # Pass empty timestamps for now or just the text
        chapters_data = generate_chapters(request.transcript_text, [])
        
        return SummarizeResponse(
            summary=summary_data.get("summary", []),
            action_items=summary_data.get("action_items", []),
            sentiment=SentimentData(
                label=sentiment_data.get("overall", "neutral"),
                score=sentiment_data.get("score", 0.0)
            ),
            chapters=[
                ChapterData(
                    topic=c.get("title", ""),
                    start_time=float(c.get("start_time", "0.0").replace(":", ".")) if isinstance(c.get("start_time"), str) else 0.0,
                    end_time=float(c.get("end_time", "0.0").replace(":", ".")) if isinstance(c.get("end_time"), str) else 0.0
                ) for c in chapters_data
            ],
            key_highlights=summary_data.get("key_highlights", [])
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarization failed error: {str(e)}"
        )
