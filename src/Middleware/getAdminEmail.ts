import { Response } from "express";
import { Admin } from "../models/adminModel";
import { generateResponse } from "../utils/Response";

export const getAdminEmail = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne({ role: "admin" });

    if (!admin) {
      return generateResponse(res, 404, "Admin not found");
    }

    return admin.email;
    console.log(admin?.email);
  } catch (error: any) {
    throw new Error(`Failed to retrieve admin email: ${error.message}`);
  }
};
