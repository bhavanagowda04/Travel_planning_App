import { Router } from "express";
import { serpSearch } from "../services/serpServices.js";

export const router = Router();

/**
 * POST /api/search
 * body: { q }
 */
router.post("/", async (req, res, next) => {
  try {
    const { q } = req.body;
    if (!q) return res.status(400).json({ ok: false, error: "Missing query 'q' in body" });

    const results = await serpSearch(q);
    res.json({ ok: true, results });
  } catch (err) {
    next(err);
  }
});
