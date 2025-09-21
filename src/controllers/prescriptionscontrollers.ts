import PrescriptionService from "../services/prescriptionservice.js";
import type { Request, Response } from "express";

class PrescriptionsControllers {
  constructor(private readonly pres: PrescriptionService) {}

  async create(req: Request, res: Response) {
    try {
      const info = req.body;
      const result = await this.pres.create(info);
      if (!result.success) return res.status(400).json(result);

      return res.status(201).json(result);
    } catch (error) {
      console.error("Error in create prescription:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.pres.getAll();
      if (!result.success) return res.status(400).json(result);

      return res.json(result);
    } catch (error) {
      console.error("Error in getAll prescriptions:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.pres.getById(Number(id));
      if (!result.success) return res.status(404).json(result);

      return res.json(result);
    } catch (error) {
      console.error("Error in getById prescription:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { advice } = req.body;
      const result = await this.pres.update(Number(id), advice);
      if (!result.success) return res.status(400).json(result);

      return res.json(result);
    } catch (error) {
      console.error("Error in update prescription:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default PrescriptionsControllers;
