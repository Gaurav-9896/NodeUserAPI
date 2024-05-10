
import jwt from "jsonwebtoken";
import config from "../config/config";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.JWT_token as string, { expiresIn: "1h" });
};
