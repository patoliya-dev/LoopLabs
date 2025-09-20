from fastapi import APIRouter, HTTPException
from models import SessionCreate, ConversationCreate
from database import sessions_collection, conversations_collection
from bson.objectid import ObjectId
import datetime

router = APIRouter()

@router.post("/api/session")
def create_session(session: SessionCreate):
    session_doc = {
        "created_at": datetime.datetime.utcnow()
    }
    result = sessions_collection.insert_one(session_doc)
    return {"session_id": str(result.inserted_id)}

@router.post("/api/conversation")
def add_conversation(conversation: ConversationCreate):
    # Validate session_id format
    if not ObjectId.is_valid(conversation.session_id):
        raise HTTPException(status_code=400, detail="Invalid session_id")
    
    session_obj_id = ObjectId(conversation.session_id)

    conversation_doc = {
        "session_id": session_obj_id,
        "prompt": conversation.prompt,
        "response": conversation.response,
        "word": conversation.word,
        "language": conversation.language,
        "created_at": datetime.datetime.utcnow()
    }

    conversations_collection.insert_one(conversation_doc)
    return {"message": "Conversation saved successfully"}
