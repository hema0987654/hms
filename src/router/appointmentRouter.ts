// routes/appointmentsRouter.ts
import { Router } from "express";
import AppointmentController from "../controllers/appointmentsControllers.js";
import AppointmentsService from "../services/appointmentsService.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authmiddleware.js";

const appointmentsService = new AppointmentsService();
const appointmentsControllers = new AppointmentController(appointmentsService);
const AM = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: APIs for managing appointments
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patient_user_id
 *         - doctor_user_id
 *         - starts_at
 *       properties:
 *         patient_user_id:
 *           type: number
 *           example: 1
 *         doctor_user_id:
 *           type: number
 *           example: 2
 *         starts_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-21T10:00:00Z"
 *         ends_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-21T10:30:00Z"
 *         status:
 *           type: string
 *           enum: [Pending, Confirmed, Completed]
 *           example: Pending
 *         notes:
 *           type: string
 *           example: "First consultation"
 *
 *     UpdateStatus:
 *       type: object
 *       required:
 *         - appointmentId
 *         - doctorId
 *         - status
 *       properties:
 *         appointmentId:
 *           type: number
 *           example: 5
 *         doctorId:
 *           type: number
 *           example: 2
 *         status:
 *           type: string
 *           enum: [Confirmed, Canceled]
 *           example: Confirmed
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message"
 */

/**
 * @swagger
 * /HMS/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
AM.post("/", authenticateToken, authorizeRoles("patient"), (req, res) =>
  appointmentsControllers.create(req, res)
);

/**
 * @swagger
 * /HMS/appointments/confirm:
 *   get:
 *     summary: Confirm an appointment (Doctor)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor user ID
 *     responses:
 *       200:
 *         description: Appointment confirmed successfully
 *       400:
 *         description: Invalid request or already booked
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
AM.get("/confirm", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
  const { appointmentId, doctorId } = req.query;
  const result = await appointmentsService.updateAppointmentStatus(
    Number(appointmentId),
    Number(doctorId),
    "Confirmed"
  );
  if (!result.success) return res.status(400).json(result);
  return res.send("<h2>✅ Appointment confirmed successfully!</h2>");
});

/**
 * @swagger
 * /HMS/appointments/reject:
 *   get:
 *     summary: Reject an appointment (Doctor)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor user ID
 *     responses:
 *       200:
 *         description: Appointment rejected successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
AM.get("/reject", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
  const { appointmentId, doctorId } = req.query;
  const result = await appointmentsService.updateAppointmentStatus(
    Number(appointmentId),
    Number(doctorId),
    "Canceled"
  );
  if (!result.success) return res.status(400).json(result);
  return res.send("<h2>❌ Appointment rejected!</h2>");
});

/**
 * @swagger
 * /HMS/appointments:
 *   patch:
 *     summary: Update appointment status (Doctor)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatus'
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
AM.patch("/", authenticateToken, authorizeRoles("doctor"), (req, res) =>
  appointmentsControllers.updateStatus(req, res)
);

/**
 * @swagger
 * /HMS/appointments:
 *   get:
 *     summary: Get all appointments (Admin)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all appointments
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
AM.get("/", authenticateToken, authorizeRoles("admin"), (req, res) =>
  appointmentsControllers.getAll(req, res)
);

/**
 * @swagger
 * /HMS/appointments/{userId}:
 *   get:
 *     summary: Get appointment by user ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID (patient or doctor)
 *     responses:
 *       200:
 *         description: Appointment found
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
AM.get("/:userId", authenticateToken, (req, res) =>
  appointmentsControllers.getById(req, res)
);

/**
 * @swagger
 * /HMS/appointments/doctor/{doctorId}:
 *   get:
 *     summary: Get all appointments for a specific doctor
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor user ID
 *     responses:
 *       200:
 *         description: List of doctor's appointments
 *       404:
 *         description: No appointments found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
AM.get("/doctor/:doctorId", authenticateToken, authorizeRoles("doctor", "admin"), (req, res) =>
  appointmentsControllers.getByDoctorId(req, res)
);

/**
 * @swagger
 * /HMS/appointments/patient/{patientId}:
 *   get:
 *     summary: Get all appointments for a specific patient
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient user ID
 *     responses:
 *       200:
 *         description: List of patient's appointments
 *       404:
 *         description: No appointments found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
AM.get("/patient/:patientId", authenticateToken, authorizeRoles("patient", "admin"), (req, res) =>
  appointmentsControllers.getByPatientId(req, res)
);

export default AM;
