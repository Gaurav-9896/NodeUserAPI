import express from "express";
import { loginUser, userDetails } from "../controllers/userController";
import { authenticate } from "../Middleware/authenticateToken";
import { registerUser } from "../controllers/adminController";
import { checkAdminRole } from "../Middleware/checkAdminRole";
import {
  deleteUserRating,
  getAllRatings,
  rateUser,
  updateRatingById,
} from "../controllers/ratingController";

const router = express.Router();

router.post("/register", authenticate, checkAdminRole, registerUser);
router.post("/login", loginUser);
router.get("/userdetails", authenticate, userDetails);
router.post("/rateuser", authenticate, rateUser);
router.post("/updaterating", authenticate, updateRatingById);
router.delete("/deleterating", authenticate, deleteUserRating);
router.get("/getratings", authenticate, getAllRatings);

export default router;
