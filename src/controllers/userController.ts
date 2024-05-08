import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { authenticate } from "../Middleware/authenticateToken";
import { Req } from "../interface/request";
import { registerSchema } from "../utils/validation";
import { generateResponse } from "../utils/Response";
import { sendRegistrationEmail } from "../services/emailService";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { firstName, lastName, email, password, dob } = req.body;

  const { error } = registerSchema.validate({
    firstName,
    lastName,
    email,
    password,
    dob,
  });
  if (error) {
    return generateResponse(res, 400, "BAD REQUEST, WRONG INPUT", error);
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return generateResponse(res, 400, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dob,
    });
    await newUser.save();
    const loginUrl = `http://localhost:3000/api/login`;

    sendRegistrationEmail(newUser.email, loginUrl, newUser.password);
    return generateResponse(res, 200, "User registered successfully", {
      data: newUser.id,
    });
  } catch (error) {
    console.error("User registration failed:", error);
    return generateResponse(res, 400, "Failed to register user", error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return generateResponse(res, 404, "user not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return generateResponse(res, 400, "Incorrect password");
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_token as string, {
      expiresIn: "1h",
    });
    generateResponse(res, 200, "login succesful", { token: token });
  } catch (error) {
    console.error("Login failed:", error);
    generateResponse(res, 500, "Login failed", error);
  }
};

export const userDetails = async (req: Req, res: Response) => {
  try {
    const userId = req.user;
    console.log(userId);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return generateResponse(res, 404, "User not found");
    }

    return generateResponse(res, 200, "Succefully got the user details", user);
  } catch (error) {
    return generateResponse(res, 500, "failed to get details", error);
  }
};

export const sendEmailLink = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const loginUrl = `http://localhost:3000/api/login`;

  sendRegistrationEmail(email, loginUrl, password);

  return generateResponse(res, 200, "email sent");
};
