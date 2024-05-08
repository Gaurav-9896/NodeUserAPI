import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { authenticate } from "../Middleware/authenticateToken";
import { Req } from "../interface/request";
import { registerSchema } from "../utils/validation";
import { generateResponse } from "../utils/Response";

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
      return res.status(404).json({ message: "email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_token as string, {
      expiresIn: "1h",
    });
    res.status(200).json(`login succesful, TOKEN :${token}`);
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const userDetails = async (req: Req, res: Response) => {
  try {
    const userId = req.user;
    console.log(userId);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {}
};
