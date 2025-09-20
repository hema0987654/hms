import AppointmentController from "../controllers/appointmentsControllers.js";
import AppointmentsService from "../services/appointmentsService.js";
import { Router } from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authmiddleware.js";

const appointmentsService = new AppointmentsService();
const appointmentsControllers = new AppointmentController(appointmentsService);
const AM = Router();

AM.post("/", authenticateToken, authorizeRoles("patient"), (req, res) =>
  appointmentsControllers.create(req, res)
);

AM.get(
  "/confirm",
  authenticateToken,
  authorizeRoles("doctor"),
  async (req, res) => {
    const { appointmentId, doctorId } = req.query;
    const result = await appointmentsService.updateAppointmentStatus(
      Number(appointmentId),
      Number(doctorId),
      "Confirmed"
    );
    if (!result.success) return res.status(400).json(result);
    return res.send("<h2>✅ Appointment confirmed successfully!</h2>");
  }
);

AM.get(
  "/reject",
  authenticateToken,
  authorizeRoles("doctor"),
  async (req, res) => {
    const { appointmentId, doctorId } = req.query;
    const result = await appointmentsService.updateAppointmentStatus(
      Number(appointmentId),
      Number(doctorId),
      "Canceled"
    );
    if (!result.success) return res.status(400).json(result);
    return res.send("<h2>❌ Appointment rejected!</h2>");
  }
);

AM.patch("/", authenticateToken, authorizeRoles("doctor"), (req, res) =>
  appointmentsControllers.updateStatus(req, res)
);

AM.get("/", authenticateToken, authorizeRoles("admin"), (req, res) =>
  appointmentsControllers.getAll(req, res)
);

AM.get("/:userId", authenticateToken, (req, res) =>
  appointmentsControllers.getById(req, res)
);

AM.get(
  "/doctor/:doctorId",
  authenticateToken,
  authorizeRoles("doctor", "admin"),
  (req, res) => appointmentsControllers.getByDoctorId(req, res)
);

AM.get(
  "/patient/:patientId",
  authenticateToken,
  authorizeRoles("patient", "admin"),
  (req, res) => appointmentsControllers.getByPatientId(req, res)
);

export default AM;
