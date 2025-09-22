import Presc_medsService from "../services/Presc_medsService.js";
import type { Request, Response } from "express";

class Presc_medsControllers {
  constructor(private readonly presc: Presc_medsService) {}

  // Create medicine
  async create(req: Request, res: Response) {
    try {
      const result = await this.presc.create(req.body);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }
      return res.status(201).json({ success: true, data: result.data });
    } catch (error) {
      console.error("Error in create Presc_meds:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Get all medicines
  async getAll(req: Request, res: Response) {
    try {
      const result = await this.presc.all();
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in getAll Presc_meds:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const {id} = req.params;
      const result = await this.presc.getById(Number(id));

      if (!result.success) {
        return res.status(404).json({ success: false, message: result.message });
      }
      
      return res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      console.error("Error in getById Presc_meds:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
        const {id}=req.params;
      const result = await this.presc.update(Number(id), req.body);

      if (!result.success || !("data" in result)) {
        return res.status(400).json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, data: result.data});
    } catch (error) {
      console.error("Error in update Presc_meds:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default Presc_medsControllers;
