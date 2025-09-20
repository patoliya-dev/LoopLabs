import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.model('Conversation', conversationSchema);