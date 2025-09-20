import mongoose from 'mongoose';

// Temporary empty schema until you provide details
const sessionSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.model('Session', sessionSchema);
