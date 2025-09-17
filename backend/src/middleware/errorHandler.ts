import type { Request, NextFunction, Response} from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ ok: false, error: err.message || "Internal server error" });
}