from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(tags=["Export"])

# Request Model
class ExportRequest(BaseModel):
    transcript: str
    summary: List[str]
    action_items: List[str]
    sentiment: Dict[str, Any]
    chat_history: List[Dict[str, str]]

@router.post("/export-pdf")
async def export_pdf(request: ExportRequest):
    """
    Generates and returns a PDF report.
    NOTE: Using POST instead of GET because passing massive payloads
    like transcript and chat history in GET query parameters will exceed URL limits.
    """
    try:
        # TODO: Call pdf_service to generate the file
        # pdf_path = pdf_service.create_pdf(...)
        
        # Mocking the response, actual will use FileResponse:
        # return FileResponse(path=pdf_path, filename="VoiceIQ_Report.pdf", media_type="application/pdf")
        
        return {"message": "PDF export will be returned as a FileResponse."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF export failed error: {str(e)}"
        )
