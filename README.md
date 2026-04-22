# VoiceIQ

A full-stack web application that transcribes audio and video files in real time and generates AI-powered summaries, action items, sentiment analysis, and chapter breakdowns.

---

## Overview

Upload any audio or video file and get a live transcript streamed to your browser via WebSocket. Once transcription is complete, the application automatically runs the content through Gemini 2.0 Flash to produce structured insights — all displayed in a split-pane dashboard.

Whisper runs **locally** with no API cost. Gemini requires a free key from Google AI Studio.

---

## Tech Stack

**Frontend**

- React 18, React Router v6
- Tailwind CSS, Framer Motion
- Recharts (sentiment charts), Wavesurfer.js (audio player)
- Axios, React Hot Toast

**Backend**

- FastAPI, Uvicorn
- OpenAI Whisper (local, no API key needed)
- Gemini 2.0 Flash via `google-generativeai`
- LangChain (RAG-based chat)
- ReportLab (PDF export)
- Python-dotenv

---

## Project Structure

```
VoiceIQ/
├── backend/
│   ├── routes/
│   │   ├── upload.py          # POST /upload — validates and saves audio/video files
│   │   ├── transcribe.py      # POST /transcribe and WS /ws/transcribe — Whisper integration
│   │   ├── summarize.py       # POST /summarize — Gemini summary, actions, sentiment, chapters
│   │   ├── chat.py            # POST /chat — LangChain RAG Q&A over transcript
│   │   └── export.py          # POST /export-pdf — ReportLab PDF generation
│   ├── services/
│   │   ├── whisper_service.py     # Local Whisper model loading and transcription logic
│   │   ├── gemini_service.py      # Gemini API calls with retry and JSON parsing
│   │   ├── langchain_service.py   # Vector store and RAG chain setup
│   │   └── pdf_service.py         # PDF layout, styling, and content assembly
│   ├── uploads/               # Runtime directory for uploaded files (gitignored)
│   ├── main.py                # App entry point, CORS config, router registration
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx           # Landing page
│       │   ├── Upload.jsx         # File picker, upload progress, navigates to dashboard
│       │   ├── Dashboard.jsx      # Main view — WebSocket transcript + AI insights tabs
│       │   └── NotFound.jsx       # 404 fallback
│       ├── components/
│       │   ├── Transcript.jsx     # Real-time scrolling transcript with speaker labels
│       │   ├── SummaryCard.jsx    # Summary bullets and key highlights
│       │   ├── ActionItems.jsx    # Interactive checklist of extracted tasks
│       │   ├── SentimentMeter.jsx # Mood timeline (Recharts) and emotion breakdown
│       │   ├── ChatBox.jsx        # Conversational Q&A interface
│       │   ├── Waveform.jsx       # Wavesurfer.js audio player in the bottom bar
│       │   ├── ExportButton.jsx   # Triggers PDF export and handles blob download
│       │   ├── Navbar.jsx
│       │   ├── Button.jsx
│       │   ├── ProgressBar.jsx
│       │   └── LoadingSpinner.jsx
│       ├── App.jsx                # Router setup and page transitions
│       ├── index.js
│       └── index.css              # Tailwind directives and custom design tokens
│
├── .gitignore
└── README.md
```

---

## Getting Started

**Requirements**

- Python 3.11 or later
- Node.js 18 or later
- ffmpeg (`brew install ffmpeg` on macOS, or `apt install ffmpeg` on Linux)

**Clone the repo**

```bash
git clone https://github.com/ShrijanSanidhya/VoiceIQ.git
cd VoiceIQ
```

**Backend**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Open .env and add your GEMINI_API_KEY

uvicorn main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Create `backend/.env` with the following:

```
GEMINI_API_KEY=your_key_here
```

A free key can be obtained from [aistudio.google.com](https://aistudio.google.com).

---

## API Endpoints

| Method    | Path              | Description                                      |
|-----------|-------------------|--------------------------------------------------|
| GET       | /health           | Health check                                     |
| POST      | /upload           | Upload an audio or video file (max 100 MB)       |
| POST      | /transcribe       | Transcribe a previously uploaded file            |
| WebSocket | /ws/transcribe    | Stream transcript segments in real time          |
| POST      | /summarize        | Generate summary, action items, sentiment, chapters |
| POST      | /chat             | Ask questions about the transcript               |
| POST      | /export-pdf       | Download a PDF report of the full analysis       |

---

## How It Works

1. The user uploads a file on the Upload page. The file is sent to `POST /upload` and saved to `backend/uploads/`.
2. The Dashboard opens a WebSocket connection to `/ws/transcribe`, passing the filename. Whisper processes the file locally and streams transcript segments back to the client.
3. Once the stream ends, the full transcript is sent to `POST /summarize`. Gemini returns structured JSON with summary bullets, action items, sentiment scores, and chapter timestamps.
4. All data populates the five insight tabs in real time.
5. The user can ask follow-up questions via the Chat tab, which uses LangChain with the transcript as context.
6. A PDF report can be exported at any time from the bottom bar.

---

## Supported Formats

MP3, WAV, M4A, MP4 — up to 100 MB per file.

---

## License

MIT
