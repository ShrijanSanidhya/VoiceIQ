from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Any

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

def parse_timestamp_to_seconds(ts: Any) -> float:
    if isinstance(ts, (int, float)):
        return float(ts)
    if not isinstance(ts, str):
        return 0.0
    # Clean up whitespace
    ts_str = ts.strip()
    if not ts_str:
        return 0.0
    parts = ts_str.split(":")
    try:
        if len(parts) == 1:
            return float(parts[0])
        elif len(parts) == 2:
            return float(parts[0]) * 60 + float(parts[1])
        elif len(parts) == 3:
            return float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
    except ValueError:
        pass
    return 0.0

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_transcript(request: SummarizeRequest):
    """
    Accepts transcript text and calls gemini_service
    to generate summary, action items, sentiment, chapters, and highlights.
    """
    try:
        from services.gemini_service import generate_all_insights
        
        # Call a single function to avoid rate limits
        data = generate_all_insights(request.transcript_text, [])
        
        return SummarizeResponse(
            summary=data.get("summary", []),
            action_items=data.get("action_items", []),
            sentiment=SentimentData(
                label=data.get("sentiment", {}).get("overall", "neutral"),
                score=data.get("sentiment", {}).get("score", 0.0)
            ),
            chapters=[
                ChapterData(
                    topic=c.get("title", "") or c.get("topic", "Topic"),
                    start_time=parse_timestamp_to_seconds(c.get("start_time")),
                    end_time=parse_timestamp_to_seconds(c.get("end_time"))
                ) for c in data.get("chapters", [])
            ],
            key_highlights=data.get("key_highlights", [])
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarization failed error: {str(e)}"
        )
