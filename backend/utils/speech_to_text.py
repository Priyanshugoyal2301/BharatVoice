import os
from io import BytesIO

def speech_to_text(file_bytes):
    """
    Convert audio to text
    Uses OpenAI Whisper as primary, with helpful error messages if unavailable
    """
    try:
        # Try OpenAI Whisper first (works if user has credits)
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        audio = BytesIO(file_bytes)
        audio.name = "input.wav"
        
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio
        )
        return transcript.text
        
    except Exception as e:
        error_msg = str(e)
        
        # Provide helpful guidance based on error type
        if "insufficient_quota" in error_msg or "429" in error_msg:
            return "⚠️ OpenAI API quota exceeded. Please use Gemini API instead (see GEMINI_SETUP.md) or type your name manually in the text field below."
        elif "api_key" in error_msg.lower() or "auth" in error_msg.lower():
            return "⚠️ Please configure AI_PROVIDER=gemini in .env file and add your free Gemini API key. See GEMINI_SETUP.md for 2-minute setup. Or type your name manually below."
        else:
            return f"⚠️ Voice recognition unavailable. Please type your name manually in the text field below. ({error_msg[:100]})"
