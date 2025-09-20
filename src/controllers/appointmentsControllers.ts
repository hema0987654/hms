import AppointmentsService from "../services/appointmentsService.js";
import type { Request, Response } from "express";
import type { Appointment } from "../models/appointments.js";

class AppointmentController {
  constructor(private readonly AM: AppointmentsService) {}

  async create(req: Request, res: Response) {
    try {
      const appointmentData: Appointment = req.body;
      const result = await this.AM.create(appointmentData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (err) {
      console.error("Error in create appointment:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { appointmentId, doctorId, status } = req.body;

      if (!appointmentId || !doctorId || !status) {
        return res.status(400).json({
          success: false,
          message: "appointmentId, doctorId and status are required",
        });
      }

      const result = await this.AM.updateAppointmentStatus(
        Number(appointmentId),
        Number(doctorId),
        status
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (err) {
      console.error("Error in updateStatus:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

 async getAll(req: Request, res: Response) {
    try {
      const result = await this.AM.getAll();
      if (!result.success) return res.status(400).json(result);
      return res.json(result);
    } catch (err) {
      console.error("Error in getAll:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await this.AM.getById(Number(userId));
      if (!result.success) return res.status(404).json(result);
      return res.json(result);
    } catch (err) {
      console.error("Error in getById:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getByDoctorId(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const result = await this.AM.getdoctorByid(Number(doctorId));
      if (!result.success) return res.status(404).json(result);
      return res.json(result);
    } catch (err) {
      console.error("Error in getByDoctorId:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getByPatientId(req: Request, res: Response) {
    try {
      const { patientId } = req.params;
      const result = await this.AM.getpatientByid(Number(patientId));
      if (!result.success) return res.status(404).json(result);
      return res.json(result);
    } catch (err) {
      console.error("Error in getByPatientId:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default AppointmentController;
