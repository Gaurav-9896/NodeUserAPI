import { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/userService";
import { generateToken } from "../services/authService";
import { comparePasswords, hashPassword} from "../services/bcryptService";
import { sendRegistrationEmail } from "../services/emailService";
import { registerSchema } from "../utils/validation";
import { generateResponse } from "../utils/Response";
import { Req } from "../interface/request";

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, dob } = req.body;

  try {
    const { error } = registerSchema.validate({
      firstName,
      lastName,
      email,
      password,
      dob,
    });
    if (error) {
      return generateResponse(res, 400, "Bad request - Wrong input", error);
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return generateResponse(res, 400, "User already exists");
    }
    const hashedPassword =await hashPassword(password)
    const newUser = await createUser(firstName, lastName, email, hashedPassword, dob);

    const loginUrl = `http://localhost:3000/api/login`;
    sendRegistrationEmail(newUser.email, loginUrl);

    return generateResponse(res, 201, "User registered successfully", {
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
    const user = await findUserByEmail(email);
    if (!user) {
      return generateResponse(res, 404, "User not found");
    }

   
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return generateResponse(res, 400, "Incorrect password");
    }

    const token = generateToken(user._id);

    return generateResponse(res, 200, "Login successful", { token });
  } catch (error) {
    console.error("Login failed:", error);
    return generateResponse(res, 500, "Login failed", error);
  }
};

export const userDetails = async (req: Req, res: Response) => {
  try {
    const userId = req.user;

    const user = await findUserById(userId);
    if (!user) {
      return generateResponse(res, 404, "User not found");
    }

    return generateResponse(
      res,
      200,
      "Successfully got the user details",
      user
    );
  } catch (error) {
    console.error("Failed to get user details:", error);
    return generateResponse(res, 500, "Failed to get user details", error);
  }
};
