import { Response } from "express";
import { Admin } from "../models/adminModel";
import { generateResponse } from "../utils/Response";
import { Req } from "../interface/request";

export const getAdminEmail = async (req: Req, res: Response) => {
  try {
    const user = req.user;
    const admin = await user.findOne({ role: "admin" });

    if (!admin) {
      return generateResponse(res, 404, "Admin not found");
    }

    return admin.email;
    console.log(admin?.email);
  } catch (error: any) {
    throw new Error(`Failed to retrieve admin email: ${error.message}`);
  }
};
