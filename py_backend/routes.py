from fastapi import APIRouter, Request, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from database import sessions_collection, conversations_collection
from bson.objectid import ObjectId
from stt import speech_to_text
from tts_service import tts_service
from pathlib import Path    
from pydantic import BaseModel 
import io
from typing import Optional
import datetime

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "en"
    voice_speed: Optional[float] = 1.0
    format: Optional[str] = "mp3"

# -----------------------------
# Session Endpoints
# -----------------------------
@router.post("/api/session")
async def create_or_store_session(request: Request):
    data = await request.json()
    
    session_id = data.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id must be provided by frontend")

    # Check if session exists
    existing_session = sessions_collection.find_one({"session_id": session_id})

    if existing_session:
        # Update last accessed time
        sessions_collection.update_one(
            {"session_id": session_id},
            {"$set": {"last_accessed": datetime.datetime.utcnow()}}
        )
        return {"session_id": session_id, "message": "Session exists"}

    # Create new session
    session_doc = {
        "session_id": session_id,
        "created_at": datetime.datetime.utcnow(),
        "last_accessed": datetime.datetime.utcnow()
    }
    sessions_collection.insert_one(session_doc)
    return {"session_id": session_id, "message": "New session created"}

# -----------------------------
# Conversation Endpoints
# -----------------------------
@router.post("/api/conversation")
async def add_conversation(request: Request):
    data = await request.json()
    
    session_id = data.get("session_id")
    prompt = data.get("prompt")
    response = data.get("response")
    word = data.get("word", "")
    language = data.get("language")

    if not session_id or not prompt or not response or not language:
        raise HTTPException(status_code=400, detail="Missing required fields")

    conversation_doc = {
        "session_id": session_id,
        "prompt": prompt,
        "response": response,
        "word": word,
        "language": language,
        "created_at": datetime.datetime.utcnow()
    }

    conversations_collection.insert_one(conversation_doc)
    return {"message": "Conversation saved successfully"}

# -----------------------------
# Speech-to-Text Endpoint
# -----------------------------
@router.post("/api/stt")
async def stt(file: UploadFile = File(...)):
    # Save uploaded file
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    file_path = upload_dir / file.filename
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Convert speech to text
    transcription = speech_to_text(str(file_path))
    return {"text": transcription}

@router.post("/api/tts")
async def text_to_speech(tts_request: TTSRequest):
    """
    Convert text to natural-sounding speech and return as streaming audio.
    
    Parameters:
    - text: The text to convert to speech
    - language: Language code (en, es, fr, de, etc.) - defaults to 'en'
    - voice_speed: Speech speed (0.5 to 2.0) - defaults to 1.0
    - format: Audio format (mp3, wav, ogg) - defaults to 'mp3'
    
    Returns streaming audio response that can be played directly in frontend.
    """
    try:
        # Validate input
        if not tts_request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if not (0.5 <= tts_request.voice_speed <= 2.0):
            raise HTTPException(status_code=400, detail="Voice speed must be between 0.5 and 2.0")
        
        if tts_request.format not in ["mp3", "wav", "ogg"]:
            raise HTTPException(status_code=400, detail="Format must be mp3, wav, or ogg")
        
        # Generate audio
        audio_bytes = tts_service.text_to_audio_bytes(
            text=tts_request.text,
            language=tts_request.language,
            voice_speed=tts_request.voice_speed,
            format=tts_request.format
        )
        
        # Determine content type
        content_types = {
            "mp3": "audio/mpeg",
            "wav": "audio/wav",
            "ogg": "audio/ogg"
        }
        content_type = content_types.get(tts_request.format, "audio/mpeg")
        
        # Create streaming response
        def generate():
            yield audio_bytes
        
        return StreamingResponse(
            generate(),
            media_type=content_type,
            headers={
                "Content-Disposition": f"inline; filename=speech.{tts_request.format}",
                "Cache-Control": "no-cache"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS processing failed: {str(e)}")
