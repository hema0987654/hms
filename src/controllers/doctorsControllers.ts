import DoctorService from "../services/doctorsService.js";
import type { Request, Response } from "express";

class DoctorController {
  constructor(private readonly doctor: DoctorService) {}

  async createDoctor(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      console.log(user_id);
      
      if (!user_id) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
      const doctorData = { ...req.body, user_id };
      const result = await this.doctor.createDoctor(doctorData);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    } catch (err: any) {
      console.error("Error in createDoctor:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getDoctorById(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const result = await this.doctor.getDoctorById(userId);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in getDoctorById:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getAllDoctors(req: Request, res: Response) {
    try {
      const result = await this.doctor.getAllDoctors();
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in getAllDoctors:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async updateDoctor(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const doctorData = req.body;
      const result = await this.doctor.updateDoctor(userId, doctorData);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in updateDoctor:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async deleteDoctor(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const result = await this.doctor.deleteDoctor(userId);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in deleteDoctor:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default DoctorController;
