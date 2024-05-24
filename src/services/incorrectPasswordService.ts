import { getAdminEmail } from '../Middleware/getAdminEmail';
import { Admin } from '../models/adminModel';
import User from '../models/userModel';
import { sendEmail } from './emailService';

export const blockUserAfterThreeAttempts = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error("User not found");
    }

    user.incorrectLoginAttempts += 1;

    if (user.incorrectLoginAttempts >= 3) {
      user.isBlocked = true;
      user.blockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Block for 15 minutes
      await user.save();

      // Notify user and admin via email
      await sendEmail(user.email, "Your account has been blocked", "Your account has been blocked for 15 minutes due to 3 incorrect login attempts.");
      
      const admin = await Admin.findOne({ role: "admin" });
      if(admin) {
        return admin.email
    }
    await sendEmail(admin!.email, "User Account Blocked", `User ${user.email}'s account has been blocked for 15 minutes due to 3 incorrect login attempts.`);

    } else {
      await user.save();
    }
  } catch (error) {
    throw new Error(`Failed to block user: ${error}`);
  }
};
