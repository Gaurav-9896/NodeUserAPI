import { NextFunction, Request, Response } from "express";
import { generateResponse } from "../utils/Response";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  Next: NextFunction
) => {
  console.error("Global error handler:", err);

  const status = err.status || 500;
  const message = err.message || "internal server error";

  generateResponse(res, status, message);
};
