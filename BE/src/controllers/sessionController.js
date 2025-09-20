import Session from '../models/Session.js';

// GET all sessions (temporary)
export const getSessions = async (_req, res) => {
  const sessions = await Session.find();
  res.json(sessions);
};
