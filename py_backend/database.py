from pymongo import MongoClient

# Replace the URI below with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://LoopLabs:root-LoopLabs@cluster0.ozlndnw.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.ai_talker_db  # You can choose your database name here

sessions_collection = db.sessions
conversations_collection = db.conversations
    