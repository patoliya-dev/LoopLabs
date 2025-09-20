import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';               // ✅ add this
import connectDB from './config/db.js';

import sessionRoutes from './routes/sessionRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';

dotenv.config();
await connectDB();

const app = express();

// --- CORS SETUP ---
app.use(cors({
  origin: '*',            // Allow all origins (simple for dev)
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));
// -------------------

app.use(express.json());
app.use('/api/sessions', sessionRoutes);
app.use('/api/conversations', conversationRoutes);

export default app;
