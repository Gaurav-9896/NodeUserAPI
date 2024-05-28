import { NextFunction, Request, Response } from "express";
import { findUserByEmail, findUserById } from "../services/userService";
import { generateToken } from "../services/authService";
import { comparePasswords, hashPassword } from "../services/bcryptService";
import { loginSchema } from "../utils/validation";
import { generateResponse } from "../utils/Response";
import { Req } from "../interface/request";
import { getRatingsByUser } from "../services/ratingService";
import { blockUserAfterThreeAttempts } from "../services/blockUserService";
import { sendEmail } from "../services/emailService";

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

    if (user.isBlocked) {
      if (user.blockedUntil && user.blockedUntil.getTime() > Date.now()) {
        const remainingTime = Math.ceil(
          (user.blockedUntil.getTime() - Date.now()) / 60000
        );
        return generateResponse(
          res,
          401,
          `Your account is blocked for ${remainingTime} minutes, please try after ${remainingTime}minutes`
        );
      } else {
        // Unblock the user as the block time has expired
        user.isBlocked = false;
        user.incorrectLoginAttempts = 0;
        await user.save();

        await sendEmail(
          user.email,
          "Account Unblocked",
          "Your account is now unblocked. You can now log in to your account."
        );
      }
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      user.incorrectLoginAttempts += 1;

      if (user.incorrectLoginAttempts >= 3) {
        await blockUserAfterThreeAttempts(email);
      } else {
        await user.save();
      }

      return generateResponse(res, 400, "Incorrect password");
    }

    user.incorrectLoginAttempts = 0;
    user.blockedUntil=null;
    
    await user.save();

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
    const rating = await getRatingsByUser(userId);
    if (!rating) {
      return generateResponse(res, 404, "user has not been rated yet");
    }
    return generateResponse(res, 200, "Successfully got the user details", {
      user,
      rating,
    });
  } catch (error) {
    console.error("Failed to get user details:", error);
    next(error);
  }
};
