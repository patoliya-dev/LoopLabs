from fastapi import APIRouter, Request, HTTPException, UploadFile, File
from database import sessions_collection, conversations_collection
from bson.objectid import ObjectId
from stt import speech_to_text
from pathlib import Path      # <-- add this import
import datetime

router = APIRouter()

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
