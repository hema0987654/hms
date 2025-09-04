import { Router } from "express";
import UserService from "../services/authService.js";
import UserController from "../controllers/userControllers.js";
import { rateLimit } from "express-rate-limit";

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

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully, OTP sent
 *       400:
 *         description: Validation error or user already exists
 */
userRouter.post("/signup", async (req, res) => {
  try {
    await usersController.SignUp(req, res);
  } catch (err: any) {
    console.error("Signup route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for account activation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */
userRouter.post("/verify-otp", async (req, res) => {
  try {
    await usersController.verifyOtp(req, res);
  } catch (err: any) {
    console.error("Verify OTP route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
userRouter.post("/login", loginLimiter, async (req, res) => {
  try {
    await usersController.login(req, res);
  } catch (err: any) {
    console.error("Login route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login with Google
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google login successful
 *       400:
 *         description: Google login failed
 */
userRouter.post("/google", async (req, res) => {
  try {
    await usersController.loginWithGoogle(req, res);
  } catch (err: any) {
    console.error("Google login route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/update-user:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid password
 */
userRouter.patch("/update-user", async (req, res) => {
  try {
    await usersController.changePassword(req, res);
  } catch (err: any) {
    console.error("Update user route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent to email
 *       400:
 *         description: Email not found
 */
userRouter.post("/forgot-password", async (req, res) => {
  try {
    await usersController.frogetPassword(req, res);
  } catch (err: any) {
    console.log("Forgot password route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   patch:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
userRouter.patch("/reset-password", async (req, res) => {
  try {
    await usersController.resetPassword(req, res);
  } catch (err: any) {
    console.log("Reset password route error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default userRouter;
