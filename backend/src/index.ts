import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { router as travelPlanRouter } from "./routes/travelplan.js";
import { router as searchRouter } from "./routes/search.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { FRONTEND_URL, PORT } from "./config.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "100kb" }));

// Enhanced CORS configuration
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:3000"], // frontend URL + local dev
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// OPTIONS pre-flight for all routes
app.options("*", cors());

app.get("/", (req, res) => res.send("Travel backend up ✅"));

// Use clean, hyphenated URLs
app.use("/api/travel-plan", travelPlanRouter);
app.use("/api/search", searchRouter);

// Central error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
