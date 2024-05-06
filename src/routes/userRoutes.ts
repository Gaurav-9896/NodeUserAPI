import express from "express";
import {
  loginUser,
  registerUser,
  userDetails,
} from "../controllers/userController";
import { authenticate } from "../Middleware/authenticateToken";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/login/userdetails",authenticate ,userDetails);

export default router;
