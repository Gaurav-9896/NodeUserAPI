import { NextFunction, Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
 
} from "../services/userService";
import { sendRegistrationEmail } from "../services/emailService";
import { generateResponse } from "../utils/Response";
import { registerSchema } from "../utils/validation";
import User from "../models/userModel"; 

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { firstName, lastName, email, password, dob,role } = req.body;
  
    try {
      const { error } = registerSchema.validate({
        firstName,
        lastName,
        email,
        password,
        dob,
      });
      if (error) {
        return generateResponse(res, 400, "Validation error", error.message);
      }
      if (role === "admin") {
        const existingAdmin = await User.findOne({ role: "admin" });
        if (existingAdmin) {
          return generateResponse(res, 403, "Only one admin allowed");
        }
      }
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return generateResponse(res, 400, "User already exists");
      }
      const newUser = await createUser(firstName, lastName, email, password, dob);
  
      const loginUrl = `http://localhost:3000/api/login`;
      sendRegistrationEmail(newUser.email, loginUrl);
  
      return generateResponse(res, 201, "User registered successfully", {
        data: newUser.id,
      });
    } catch (error) {
      console.error("User registration failed:", error);
      next(error);
    }
  };