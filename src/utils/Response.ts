import { Response } from "express";


export const generateResponse = <T>(
  res: Response,
  code: number,
  message: string,
  data?: T | null
) => {
  if (data !== undefined && data !== null) {
    return res.status(code).json({ code, message, data });
  } else {
    return res.status(code).json({ code, message });
  }
};
