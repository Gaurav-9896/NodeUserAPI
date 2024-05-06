import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import envConfig from "../config/config";


export const authenticate = async (
  req: Request<{ userId: string }>,
  res: Response,
  Next: NextFunction
) => {
  console.log("inside authenticate");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.slice(7); ;

  if (!token) {
    return res
      .status(404)
      .json({ message: "Token is not found enter the token" });
  }
  console.log(`token ${token}`);

  jwt.verify(token, envConfig.JWT_token as string, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "invalid token" });
    }
    req.params = decoded;
   

    Next();
  });
};
