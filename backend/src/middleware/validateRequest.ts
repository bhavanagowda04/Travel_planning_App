import { Request, Response, NextFunction } from "express";

export const validateTravelPlanBody = (req: Request, res: Response, next: NextFunction) => {
  const { country } = req.body;
  
  if (!country) {
    return res.status(400).json({ ok: false, error: "Destination is required" });
  }
  
  next();
};