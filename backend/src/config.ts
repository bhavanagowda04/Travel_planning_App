import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
export const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
export const SERP_API_KEY = process.env.SERP_API_KEY || "1269bba54bcc65049956cc79553c337c2a50d94aa8d4378b96d8ed494c354268";
