from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, transcribe, summarize, chat, export

# Initialize FastAPI application with title
app = FastAPI(title="VoiceIQ API", description="Real-Time Audio/Video Summarization Pipeline")

# Configure CORS for frontend communication (allow React frontend on localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(upload.router)
app.include_router(transcribe.router)
app.include_router(summarize.router)
app.include_router(chat.router)
app.include_router(export.router)

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Returns the health status of the API.
    """
    return {"status": "ok", "message": "VoiceIQ API is running."}
