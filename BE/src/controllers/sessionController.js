import Session from "../models/Session.js";

// Create a new session
export const createSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.create({ sessionId });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};