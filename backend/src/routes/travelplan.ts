import { Router } from "express";
import { generatePlan } from "../services/groqServices.js";
import { validateTravelPlanBody } from "../middleware/validateRequest.js";

export const router = Router();

/**
 * POST /api/travel-plan
 * body: { country, state?, fromDate?, toDate?, budget?, currency?, activities?, travelType? }
 */
router.post("/", validateTravelPlanBody, async (req, res, next) => {
  try {
    const payload = req.body;
    const plan = await generatePlan(payload);
    res.json({ ok: true, plan });
  } catch (err) {
    next(err);
  }
});
