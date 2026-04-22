import os
import json
import time
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

load_dotenv()

# ---------------------------------------------------------
# 1. Initialize Gemini
# ---------------------------------------------------------
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    logger.error("API key missing error: GEMINI_API_KEY is not set in .env")
else:
    # Initialize the generative AI client with the free API key
    genai.configure(api_key=API_KEY)

# Use the fast and free gemini-2.0-flash model
try:
    gemini_model = genai.GenerativeModel("gemini-2.0-flash")
    print("Gemini initialized successfully")
    logger.info("Gemini initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Gemini: {e}")
    gemini_model = None

# ---------------------------------------------------------
# 5. Error Handling & API Helper
# ---------------------------------------------------------
def _call_gemini_with_retry(prompt: str, retries: int = 3) -> dict:
    """
    Helper function to call Gemini API with retry logic and JSON parsing.
    Handles 'API key missing', 'Rate limit exceeded', and 'Invalid response' errors.
    """
    if not API_KEY or not gemini_model:
        raise ValueError("API key missing error")
        
    for attempt in range(retries):
        try:
            response = gemini_model.generate_content(prompt)
            text = response.text.strip()
            
            # Strip markdown JSON blocks if present to ensure clean JSON parsing
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            return json.loads(text.strip())
            
        except json.JSONDecodeError:
            if attempt == retries - 1:
                raise ValueError("Invalid response error: Failed to parse JSON from Gemini")
            logger.warning(f"Failed to parse JSON, retrying ({attempt + 1}/{retries})...")
            time.sleep(2)
            
        except Exception as e:
            error_msg = str(e).lower()
            if "rate limit" in error_msg or "429" in error_msg or "quota" in error_msg:
                if attempt == retries - 1:
                    raise RuntimeError("Rate limit exceeded error")
                logger.warning(f"Rate limit hit, sleeping before retry ({attempt + 1}/{retries})...")
                time.sleep(5)
            else:
                if attempt == retries - 1:
                    raise RuntimeError(f"Gemini API Error: {str(e)}")
                time.sleep(2)
                
    return {}

# ---------------------------------------------------------
# 2. Generate Summary Function
# ---------------------------------------------------------
def generate_summary(transcript: str) -> dict:
    """
    Sends the transcript to Gemini and returns a structured summary JSON
    including bullet points, action items, highlights, and a single-line overview.
    """
    prompt = f"""You are an expert meeting/lecture summarizer.
Analyze this transcript and return a JSON with:
- summary: list of 5-7 bullet point summaries
- action_items: list of action items mentioned
- key_highlights: top 5 most important points
- one_line_summary: one sentence overview

Transcript: {transcript}

Return ONLY valid JSON, no extra text."""
    
    return _call_gemini_with_retry(prompt)

# ---------------------------------------------------------
# 3. Sentiment Analysis Function
# ---------------------------------------------------------
def analyze_sentiment(transcript: str) -> dict:
    """
    Analyzes overall mood/tone of the transcript.
    Returns a specific JSON structure with overall sentiment, a score, and a breakdown.
    """
    prompt = f"""Analyze the overall mood and tone of the following transcript.
Return ONLY a valid JSON with this exact structure:
{{
  "overall": "positive or negative or neutral",
  "score": 0.75,
  "emotions": {{
    "happy": 0.6,
    "stressed": 0.2,
    "neutral": 0.2
  }},
  "summary": "1 sentence explanation of the sentiment"
}}

Ensure the scores are floats between 0.0 and 1.0.

Transcript: {transcript}"""

    return _call_gemini_with_retry(prompt)

# ---------------------------------------------------------
# 4. Generate Chapters Function
# ---------------------------------------------------------
def generate_chapters(transcript: str, timestamps: list) -> list:
    """
    Detects topic changes in the transcript and groups them into sequential chapters.
    """
    prompt = f"""Analyze this transcript and its associated timestamps to detect topic changes.
Return a list of chapters covering the entire audio.
Return ONLY a valid JSON array of objects, with each object exactly like this:
[
  {{
    "title": "Brief title of the topic",
    "start_time": "MM:SS",
    "end_time": "MM:SS",
    "summary": "Brief summary of what was discussed"
  }}
]

Timestamps context: {timestamps}
Transcript: {transcript}"""

    response = _call_gemini_with_retry(prompt)
    
    # Normalize the output depending on how the model formats the top-level structure
    if isinstance(response, list):
        return response
    elif isinstance(response, dict) and "chapters" in response:
        return response["chapters"]
    
    # Fallback if structure is wrong
    return []
