import { NextFunction, Response } from "express";
import { Req } from "../interface/request";
import jwt from "jsonwebtoken";
import envConfig from "../config/config";
import { generateResponse } from "../utils/Response";

export const authenticate = async (
  req: Req,
  res: Response,
  Next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.slice(7);

  if (!token) {
    return generateResponse(res, 404, "Token is not found enter the token");
  }
  console.log(`token ${token}`);

  jwt.verify(token, envConfig.JWT_token as string, (err: any, decoded: any) => {
    if (err) {
      return generateResponse(res, 401, "invalid or expired token", err);
    }
    req.user = decoded.userId;

    Next();
  });
};
