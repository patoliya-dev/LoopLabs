import express from "express";
import { createSession } from "../controllers/sessionController.js";

const router = express.Router();

// POST /api/sessions
router.post("/", createSession);

export default router;