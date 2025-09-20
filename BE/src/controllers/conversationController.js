import Conversation from '../models/Conversation.js';

export const getConversations = async (_req, res) => {
  const convos = await Conversation.find();
  res.json(convos);
};
