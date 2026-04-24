from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(tags=["Export"])

# Request Model
class ExportRequest(BaseModel):
    filename: str
    transcript: str
    summary: Dict[str, Any]
    sentiment: Dict[str, Any]
    chapters: List[Dict[str, Any]]
    speakers: List[Dict[str, Any]]
    chat_history: List[Dict[str, str]]

@router.post("/export-pdf")
async def export_pdf_route(request: ExportRequest):
    """
    Generates and returns a PDF report.
    NOTE: Using POST instead of GET because passing massive payloads
    like transcript and chat history in GET query parameters will exceed URL limits.
    """
    try:
        from services.pdf_service import export_pdf
        from fastapi.responses import FileResponse
        from fastapi.concurrency import run_in_threadpool
        
        def run_export():
            return export_pdf(
                filename=request.filename,
                transcript=request.transcript,
                summary=request.summary,
                sentiment=request.sentiment,
                chapters=request.chapters,
                speakers=request.speakers,
                chat_history=request.chat_history
            )
            
        pdf_path = await run_in_threadpool(run_export)
        
        return FileResponse(path=pdf_path, filename="VoiceIQ_Report.pdf", media_type="application/pdf")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF export failed error: {str(e)}"
        )
