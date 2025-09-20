from fastapi import APIRouter, Request, HTTPException
from database import sessions_collection, conversations_collection
from bson.objectid import ObjectId
import datetime

router = APIRouter()

@router.post("/api/session")
async def create_session():
    session_doc = {
        "created_at": datetime.datetime.utcnow()
    }
    result = sessions_collection.insert_one(session_doc)
    return {"session_id": str(result.inserted_id)}

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

    if not ObjectId.is_valid(session_id):
        raise HTTPException(status_code=400, detail="Invalid session_id")

    conversation_doc = {
        "session_id": ObjectId(session_id),
        "prompt": prompt,
        "response": response,
        "word": word,
        "language": language,
        "created_at": datetime.datetime.utcnow()
    }

    conversations_collection.insert_one(conversation_doc)
    return {"message": "Conversation saved successfully"}
