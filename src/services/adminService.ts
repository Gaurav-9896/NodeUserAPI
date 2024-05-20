import User from '../models/userModel';

export const createUser = async (firstName: string, lastName: string, email: string, password: string, dob: Date, role: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return null;
  }

  const newUser = new User({ firstName, lastName, email, password, dob, role });
  await newUser.save();
  return newUser;
};

export const updateUser = async (userId: string, updateData: Partial<typeof User.prototype>) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
  return updatedUser;
};

export const deleteUser = async (userId: string) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  return deletedUser;
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  return user;
};

