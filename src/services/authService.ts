import { type Info } from "../models/authDB.js";
import usersBD from "../models/authDB.js";
import jwt from "jsonwebtoken";
import bycrbt from "bcrypt";
import ValidationResult from "../Validation/authV.js";
import {
  insertTempUser,
  findTempUserByEmailAndOtp,
  deleteTempUser,
} from "../models/tempUser.js";
import { sendOtpEmail } from "../utils/sendOTP.js";
import otpGenerator from "otp-generator";
import { OAuth2Client } from "google-auth-library";

const checkSuper = new ValidationResult();
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

class UserService {
  constructor() {}

  private generateToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.jwt_secret as string,
      { expiresIn: "7d" }
    );
  }

  private otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
  private async sendemail(email: string) {

    
      const findUser = await usersBD.findUser(email);
      if (!findUser) {
        return { success: false, message: "User does not exist" };
      }

      
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

      await insertTempUser({
        ...findUser,
        password: findUser.password,
        otp: this.otp,
        otpExpires,
      });

      await sendOtpEmail(email, this.otp);
     return { success: true, message: "OTP has been sent to your email" };
  }


  async SignUp(infoUsers: Info) {
    try{

      const check = checkSuper.validate(infoUsers);
      const finduser = await usersBD.findUser(infoUsers.email);
      if (!check.success) return { success: false, message: check.message };
      if(finduser) return { success: false, message: "User already exists" };
      const pasworHash = await bycrbt.hash(infoUsers.password, 10);
       const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

      await insertTempUser({
        name: infoUsers.name,
        email: infoUsers.email,
        role: infoUsers.role,
        phone: infoUsers.phone,
        password: pasworHash,
        otp: this.otp,
        otpExpires,
      });
      await sendOtpEmail(infoUsers.email, this.otp);
      return { success: true, message: "OTP has been sent to your email" };

    }catch(err:any){
      console.error("SignUp error:", err);
      return { success: false, message: "Internal server error" };
    }
  }

  async verifyOtp(email: string, otp: string) {
    const result = await findTempUserByEmailAndOtp(email, otp);
    if (result.rowCount === 0)
      return { success: false, message: "OTP is invalid or has expired" };

    const userTemp = result.rows[0];

    const newUser = await usersBD.createUser({
      name: userTemp.name,
      email: userTemp.email,
      password: userTemp.password,
      role: userTemp.role,
      phone: userTemp.phone,
    });

    await deleteTempUser(email);

    const token = this.generateToken(newUser);

    return {
      success: true,
      message: "Account has been successfully activated",
      token,
    };
  }

  async login(email: string, password: string) {
    try {
      const findUser = await usersBD.findUser(email);
      if (!findUser) {
        return { success: false, message: "User does not exist" };
      }

      const passMatch = await bycrbt.compare(password, findUser.password);
      if (!passMatch) {
        return { success: false, message: "Invalid password" };
      }

      const token = this.generateToken(findUser);

      return {
        success: true,
        message: "Login successful",
        token
      };
    } catch (err: any) {
      console.error("Login error:", err);
      return { success: false, message: "Internal server error" };
    }
  }

  async loginWithGoogle(code: string) {
    try {
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token as string,
        audience: process.env.GOOGLE_CLIENT_ID as string,
      });

      const payload = ticket.getPayload();
      if (!payload)
        return { success: false, message: "Google authentication failed" };

      const email = payload.email as string;
      const name = payload.name as string;

      let user = await usersBD.findUser(email);

      if (!user) {
        user = await usersBD.createUser({
          name: name || "Google User",
          email,
          password: "google-oauth",
          role: "patient",
          phone: "Not Provided",
        });
      }

      const token = this.generateToken(user);

      return {
        success: true,
        message: "Google login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (err: any) {
      console.error("Google login error:", err);
      return { success: false, message: "Internal server error" };
    }
  }

  async ChangePassword(email: string, newPassword: string) {
    try {
      const checkpass = checkSuper.validatePassword(newPassword);
      if (!checkpass.success) return {checkpass};

      const passwordHash = await bycrbt.hash(newPassword, 10);

      const user = await usersBD.updatepassword(email, passwordHash);

      if (!user) {
        return { success: false, message: "User not found" };
      }

      return { success: true, message: "Password changed successfully", user };
    } catch (err: any) {
      console.error("Change password error:", err);
      return { success: false, message: "Internal server error" };
    }
  }

  async forgetPassword(email: string) {
    try {
      const validateEmail = checkSuper.validateEmail(email);
      if (!validateEmail.success) return validateEmail;
      return await this.sendemail(email);
    } catch (err: any) {
      console.log("Forget password error:", err);
      return { success: false, message: "Internal server error" };
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    try {
      const result = await findTempUserByEmailAndOtp(email, otp);
      if (result.rowCount === 0) {
        return { success: false, message: "Invalid or expired OTP" };
      }
      const checkpass = checkSuper.validatePassword(newPassword);
      if (!checkpass.success) return checkpass;

      const passwordHash = await bycrbt.hash(newPassword, 10);
      const user = await usersBD.updatepassword(email, passwordHash);

      await deleteTempUser(email);

      return { success: true, message: "Password reset successfully", user };
    } catch (err: any) {
      console.error("Reset password error:", err);
      return { success: false, message: "Internal server error" };
    }
  }
}

export default UserService;
