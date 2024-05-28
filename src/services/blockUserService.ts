import { getAdminEmail } from "../Middleware/getAdminEmail";
import User from "../models/userModel";
import { generateResponse } from "../utils/Response";
import { sendEmail } from "./emailService";
import { findUserByEmail } from "./userService";

export const blockUserAfterThreeAttempts = async (email: string) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    user.incorrectLoginAttempts += 1;

    if (user.incorrectLoginAttempts >= 3) {
      user.isBlocked = true;
      user.blockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Block for 15 minutes

      await user.save();

      // Notify the user via email
      await sendEmail(
        user.email,
        "Your account has been blocked",
        "Your account has been blocked for 15 minutes due to 3 incorrect login attempts."
      );

      // Notify the admin via email
      
      const admin = await User.findOne({ role: "admin" });
      if (admin) {
        await sendEmail(
          admin.email,
          "User Account Blocked",
          `User ${user.email}'s account has been blocked for 15 minutes due to 3 incorrect login attempts.`
        );
      } else {
        console.log("Admin not found. Unable to send admin notification.");
      }
    } else {
      await user.save();
    }
  } catch (error) {
    console.error("Failed to block user", error);
  }
};
