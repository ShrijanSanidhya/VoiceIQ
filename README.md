# 🎙️ VoiceIQ — AI-Powered Audio & Video Summarization Pipeline

<div align="center">

![VoiceIQ Banner](https://img.shields.io/badge/VoiceIQ-AI%20Summarization-7C3AED?style=for-the-badge&logo=audiomack&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Whisper](https://img.shields.io/badge/Whisper-OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Python](https://img.shields.io/badge/Python%203.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Upload any audio or video file → Get a real-time transcript, AI summary, action items, sentiment analysis, and chapters — all in a premium dark-mode dashboard.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [API Reference](#-api-reference)

</div>

---

## ✨ Features

- 🎤 **Real-Time Transcription** — WebSocket-powered live transcript streaming via OpenAI Whisper (local, no API cost)
- 🤖 **AI Summarization** — Bullet-point summaries, key highlights, and one-line overview via Gemini 2.0 Flash
- ✅ **Action Item Extraction** — Automatically identifies and lists tasks from conversations
- 😊 **Sentiment Analysis** — Mood timeline, emotion breakdown, and overall sentiment score
- 📚 **Chapter Detection** — Splits long audio into labeled chapters with timestamps
- 💬 **Contextual Chat** — Ask follow-up questions about your audio using LangChain RAG
- 📄 **PDF Export** — Beautiful, professional PDF reports via ReportLab
- 🌊 **Audio Waveform** — Interactive wavesurfer.js audio player in the bottom bar
- 🌙 **Premium Dark UI** — Glassmorphism, Framer Motion animations, responsive layout

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Sentiment Visualizations |
| Wavesurfer.js | Audio Waveform Player |
| Axios | HTTP Client |
| React Hot Toast | Notifications |
| React Router v6 | Client-side Routing |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST & WebSocket API |
| Uvicorn | ASGI Server |
| OpenAI Whisper (local) | Speech-to-Text (FREE, no API key) |
| Gemini 2.0 Flash | Summarization & Sentiment AI |
| LangChain | RAG Chatbot Orchestration |
| ReportLab | PDF Report Generation |
| Python-dotenv | Environment Variables |

---

## 📁 Project Structure

```
VoiceIQ/
├── frontend/                     # React App
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Upload.jsx        # File upload + real API call
│   │   │   └── Dashboard.jsx     # Live dashboard with WebSocket
│   │   ├── components/
│   │   │   ├── Transcript.jsx    # Real-time transcript panel
│   │   │   ├── SummaryCard.jsx   # AI summary display
│   │   │   ├── ActionItems.jsx   # Interactive task list
│   │   │   ├── SentimentMeter.jsx# Recharts mood visualization
│   │   │   ├── ChatBox.jsx       # LangChain chat interface
│   │   │   ├── Waveform.jsx      # Wavesurfer.js audio player
│   │   │   ├── ExportButton.jsx  # PDF export via blob
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── Button.jsx        # Reusable button component
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css             # Tailwind + custom design tokens
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                      # FastAPI Backend
│   ├── main.py                   # App entry, CORS, routers
│   ├── routes/
│   │   ├── upload.py             # POST /upload (file ingestion)
│   │   ├── transcribe.py         # POST /transcribe + WS /ws/transcribe
│   │   ├── summarize.py          # POST /summarize (Gemini)
│   │   ├── chat.py               # POST /chat (LangChain RAG)
│   │   └── export.py             # POST /export-pdf (ReportLab)
│   ├── services/
│   │   ├── whisper_service.py    # Local Whisper transcription
│   │   ├── gemini_service.py     # Gemini 2.0 Flash integration
│   │   ├── langchain_service.py  # LangChain RAG setup
│   │   └── pdf_service.py        # ReportLab PDF generation
│   ├── uploads/                  # Uploaded audio files (gitignored)
│   ├── requirements.txt
│   └── .env                      # API keys (gitignored)
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- `ffmpeg` installed (`brew install ffmpeg` on Mac)

### 1. Clone the Repository

```bash
git clone https://github.com/ShrijanSanidhya/VoiceIQ.git
cd VoiceIQ
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (free at aistudio.google.com)

# Start the backend server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Open **[http://localhost:3000](http://localhost:3000)** and upload an audio file to get started!

---

## 🔑 Environment Variables

Create a `backend/.env` file:

```env
GEMINI_API_KEY=your_free_key_from_aistudio.google.com
```

> Get a **free** Gemini API key at [aistudio.google.com](https://aistudio.google.com)

---

## 🏗 Architecture

```
User
 │
 ▼
[React Frontend (localhost:3000)]
 │
 ├─ POST /upload ──────────────────────────▶ [FastAPI Backend (localhost:8000)]
 │                                               │
 ├─ WS  /ws/transcribe ───────────────────────▶ │──▶ [Whisper (local)] ──stream──▶ Frontend
 │                                               │
 ├─ POST /summarize ──────────────────────────▶ │──▶ [Gemini 2.0 Flash] ──────────▶ Frontend
 │                                               │
 ├─ POST /chat ────────────────────────────────▶ │──▶ [LangChain RAG] ─────────────▶ Frontend
 │                                               │
 └─ POST /export-pdf ─────────────────────────▶ │──▶ [ReportLab PDF] ─────────────▶ Download
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/upload` | Upload audio/video file (≤ 100MB) |
| `POST` | `/transcribe` | Transcribe audio via Whisper |
| `WS` | `/ws/transcribe` | Real-time streaming transcription |
| `POST` | `/summarize` | Generate summary, actions, sentiment, chapters |
| `POST` | `/chat` | Contextual Q&A via LangChain |
| `POST` | `/export-pdf` | Export full report as PDF |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#7C3AED` (Deep Purple) |
| Secondary | `#06B6D4` (Cyan) |
| Background | `#0F0F1A` |
| Card | `#1A1A2E` |
| Text | `#FFFFFF` / `#94A3B8` |
| Font | Inter (Google Fonts) |
| Border Radius | `16px` |

---

## 🧠 How It Works

1. **Upload** — User selects an audio/video file (MP3, MP4, WAV, M4A)
2. **Transcription** — File is sent to the backend; Whisper processes it locally and streams segments via WebSocket
3. **AI Analysis** — Once transcription completes, the full text is sent to Gemini 2.0 Flash which returns structured JSON (summary, action items, sentiment, chapters)
4. **Dashboard** — All data is rendered in real-time across the 5-tab insights panel
5. **Chat** — User can ask questions about the audio; LangChain uses the transcript as context
6. **Export** — A professional PDF report can be generated and downloaded

---

## 📸 Screenshots

> Dashboard with real-time transcript (left panel) and AI insights (right panel)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License — © 2025 [ShrijanSanidhya](https://github.com/ShrijanSanidhya)
