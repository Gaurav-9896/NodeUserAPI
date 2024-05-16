import {  Response, NextFunction } from "express";
import { generateResponse } from "../utils/Response";
import { Req } from "../interface/request";

export const checkAdminRole = (req: Req, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") {
    return generateResponse(res, 403, "Access forbidden: Admins only");
  }
  next();
};
