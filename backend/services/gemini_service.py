import os
import json
import time
import logging
from groq import Groq
from dotenv import load_dotenv

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

load_dotenv()

# ---------------------------------------------------------
# 1. Initialize Groq (Fallback from Gemini)
# ---------------------------------------------------------
API_KEY = os.getenv("GROQ_API_KEY")

groq_client = None

if not API_KEY:
    logger.error("API key missing error: GROQ_API_KEY is not set in .env")
else:
    try:
        groq_client = Groq(api_key=API_KEY)
        logger.info("Groq initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Groq: {e}")
        groq_client = None

GROQ_MODEL = "llama-3.3-70b-versatile"

# ---------------------------------------------------------
# 5. Error Handling & API Helper
# ---------------------------------------------------------
def _call_groq_with_retry(prompt: str, retries: int = 3, retry_delay: int = 5) -> dict:
    if not API_KEY or not groq_client:
        raise ValueError("API key missing error")

    for attempt in range(retries):
        try:
            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            text = response.choices[0].message.content.strip()

            return json.loads(text)

        except json.JSONDecodeError:
            if attempt == retries - 1:
                raise ValueError("Invalid response error: Failed to parse JSON from Groq")
            time.sleep(2)

        except Exception as e:
            error_msg = str(e).lower()
            if "rate limit" in error_msg or "429" in error_msg:
                if attempt == retries - 1:
                    logger.error("Groq API rate limit exceeded after all retries.")
                    raise RuntimeError("QUOTA_EXCEEDED: Groq API quota exceeded.")
                time.sleep(retry_delay)
            else:
                if attempt == retries - 1:
                    raise RuntimeError(f"Groq API Error: {str(e)}")
                time.sleep(2)

    return {}

# ---------------------------------------------------------
# 2. Generate All Insights Function
# ---------------------------------------------------------
def generate_all_insights(transcript: str, timestamps: list) -> dict:
    prompt = f"""You are an expert meeting/lecture summarizer.
Analyze this transcript and its associated timestamps to generate comprehensive insights.
Return ONLY a valid JSON with this exact structure:
{{
  "summary": ["bullet 1", "bullet 2"],
  "action_items": ["task 1", "task 2"],
  "key_highlights": ["point 1", "point 2"],
  "one_line_summary": "one sentence overview",
  "sentiment": {{
    "overall": "positive or negative or neutral",
    "score": 0.75,
    "emotions": {{
      "happy": 0.6,
      "stressed": 0.2,
      "neutral": 0.2
    }},
    "summary": "1 sentence explanation of the sentiment"
  }},
  "chapters": [
    {{
      "title": "Brief title",
      "start_time": "MM:SS",
      "end_time": "MM:SS",
      "summary": "Brief summary"
    }}
  ]
}}

Ensure the sentiment scores are floats between 0.0 and 1.0.

Timestamps context: {timestamps}
Transcript: {transcript}"""

    return _call_groq_with_retry(prompt)
