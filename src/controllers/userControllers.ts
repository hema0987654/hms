import UserService from "../services/authService.js";
import type { Request, Response } from "express";

class UserController {
  constructor(private readonly userService: UserService) {}

  async SignUp(req: Request, res: Response) {
    try {
      const infoUsers = req.body;

      const result = await this.userService.SignUp(infoUsers);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (err: any) {
      console.error("Error in SignUp:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      const result = await this.userService.verifyOtp(email, otp);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in verifyOtp:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await this.userService.login(email, password);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in login:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Authorization code is required",
        });
      }

      const result = await this.userService.loginWithGoogle(code);

      if (!result.success) {
        return res.status(401).json(result); // 401 better than 400 here
      }

      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in loginWithGoogle:", err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong during Google login",
      });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;
      const result = await this.userService.ChangePassword(email, newPassword);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in changePassword:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async frogetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await this.userService.forgetPassword(email);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in forgetPassword:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await this.userService.resetPassword(
        email,
        otp,
        newPassword
      );
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in resetPassword:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
export default UserController;
