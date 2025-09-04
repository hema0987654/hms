import { Router } from "express";
import UserService from "../services/authService.js";
import UserController from "../controllers/userControllers.js";
import {rateLimit} from "express-rate-limit";
const userService = new UserService();
const usersController = new UserController(userService);
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    await usersController.SignUp(req, res);
  } catch (err: any) {
    console.error("Signup route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

userRouter.post("/verify-otp", async (req, res) => {
  try {
    await usersController.verifyOtp(req, res);
  } catch (err: any) {
    console.error("Verify OTP route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


userRouter.post("/login", loginLimiter, async (req, res) => {
  try {
    await usersController.login(req, res);
  } catch (err: any) {
    console.error("Login route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

userRouter.post("/google", async (req, res) => {
  try {
    await usersController.loginWithGoogle(req, res);
  }catch (err: any) {
    console.error("Google login route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }});

  userRouter.patch("/update-user", async (req, res) => {
  try {
    await usersController.changePassword(req, res);
  }catch (err: any) {
    console.error("Update user route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }});

  userRouter.post("/forgot-password", async (req, res) => {
  try {
    await usersController.frogetPassword(req, res);
  }catch (err: any) {
    console.log("Forgot password route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" }); 
  }
  });

  userRouter.patch("/reset-password", async (req, res) => {
    try{
      await usersController.resetPassword(req, res);
    }catch (err: any) {
      console.log("Reset password route error:", err);
      res.status(500).json({ success: false, message: "Internal server error" }); 
    }
  });

export default userRouter;
