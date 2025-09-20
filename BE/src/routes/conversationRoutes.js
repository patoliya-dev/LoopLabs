import { Router } from 'express';
import { getConversations } from '../controllers/conversationController.js';

const router = Router();
router.get('/', getConversations);
export default router;
