import PatientService from "../services/patientService.js";
import type { Request, Response } from "express";

class PatientController {
  constructor(private readonly patientService: PatientService) {}

  async createPatient(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    const patientData = { ...req.body, userId };
      const result = await this.patientService.setPatient(patientData);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    } catch (err: any) {
      console.error("Error in createPatient:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getPatientByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const result = await this.patientService.getPatientByUserId(userId);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in getPatientByUserId:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getAllPatients(req: Request, res: Response) {
    try {
      const result = await this.patientService.getAllPatients();
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in getAllPatients:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async updatePatient(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const updateData = req.body;
      const result = await this.patientService.updatePatient(userId, updateData);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in updatePatient:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async deletePatient(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const result = await this.patientService.deletePatient(userId);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Error in deletePatient:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default PatientController;
