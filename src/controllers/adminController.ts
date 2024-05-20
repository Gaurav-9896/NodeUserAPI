import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/userService";
import { sendRegistrationEmail } from "../services/emailService";
import { generateResponse } from "../utils/Response";
import { registerSchema } from "../utils/validation";
import User from "../models/userModel";
import { deleteUser, getUserById, updateUser } from "../services/adminService";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password, dob, role } = req.body;

  try {
    const { error } = registerSchema.validate({
      firstName,
      lastName,
      email,
      password,
      dob,
      role,
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

    const newUser = await createUser(
      firstName,
      lastName,
      email,
      password,
      dob,
      role
    );

    const loginUrl = `http://localhost:3000/api/login`;
    await sendRegistrationEmail(newUser.email, loginUrl);

    return generateResponse(res, 201, "User registered successfully", {
      data: newUser.id,
    });
  } catch (error) {
    console.error("User registration failed:", error);
    next(error);
  }
};
export const updateUserById = async (req: Request, res: Response, next: NextFunction)=> {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      generateResponse(res, 404, "User not found");
      return;
    }

    if (user.role !== 'admin') {
      generateResponse(res, 403, "Access denied. Admins only.");
      return;
    }

    const updatedUser = await updateUser(userId, updateData);
    generateResponse(res, 200, "User updated successfully", { data: updatedUser });
  } catch (error) {
    console.error("User update failed:", error);
    next(error);
  }
};

export const deleteUserById = async (req: Request, res: Response, next: NextFunction)  => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      generateResponse(res, 404, "User not found");
      return;
    }

    if (user.role !== 'admin') {
      generateResponse(res, 403, "Access denied. Admins only.");
      return;
    }

    await deleteUser(userId);
    generateResponse(res, 200, "User deleted successfully");
  } catch (error) {
    console.error("User deletion failed:", error);
    next(error);
  }
};

