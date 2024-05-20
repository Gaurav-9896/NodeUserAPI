import User from "../models/userModel";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dob: string,
  role: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    dob,
    role,
  });
  await newUser.save();
  return newUser;
};

export const findUserById = async (userId: string) => {
  return await User.findById(userId).select("-password");
};


