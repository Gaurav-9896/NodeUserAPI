import { NextFunction, Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/userService";
import { generateToken } from "../services/authService";
import { comparePasswords, hashPassword } from "../services/bcryptService";
import { sendRegistrationEmail } from "../services/emailService";
import { loginSchema, registerSchema } from "../utils/validation";
import { generateResponse } from "../utils/Response";
import { Req } from "../interface/request";
import { getRatingsByUser } from "../services/ratingService";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return generateResponse(res, 400, "Bad request - Invalid input", error);
  }

  const { email, password } = value;

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
    next(error);
  }
};

export const userDetails = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;

    const user = await findUserById(userId);
    if (!user) {
      return generateResponse(res, 404, "User not found");
    }
     const rating =await getRatingsByUser(userId);
     if(!rating){
      return generateResponse(res,404,"user has not been rated yet")
     }
    return generateResponse(
      res,
      200,
      "Successfully got the user details",
     { user,rating}
    );
  } catch (error) {
    console.error("Failed to get user details:", error);
    next(error);
  }
};
