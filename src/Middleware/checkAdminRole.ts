import { NextFunction, Response } from "express";
import { Req } from "../interface/request";
import { generateResponse } from "../utils/Response";
import User from "../models/userModel";

export const checkAdminRole = async (req:Req, res:Response, next:NextFunction) => {
  try {
    const user = await User.findById(req.user);
    if (user && user.role === 'admin') {
      next();
    } else {
      return generateResponse(res, 403, 'Access denied. Admins only.');
    }
  } catch (error) {
    console.error('Authorization check failed:', error);
    return generateResponse(res, 500, 'Internal server error.');
  }
};