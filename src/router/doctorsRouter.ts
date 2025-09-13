// routes/doctorsRouter.ts
import { Router } from "express";
import DoctorController from "../controllers/doctorsControllers.js";
import DoctorService from "../services/doctorsService.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authmiddleware.js";

const doctorsRouter = Router();
const doctorService = new DoctorService();
const doctorController = new DoctorController(doctorService);

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: APIs for managing doctors
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           example: 1
 *         specialization:
 *           type: string
 *           example: "Cardiology"
 *         bio:
 *           type: string
 *           example: "Experienced cardiologist with 10 years of practice."
 *         licenseNumber:
 *           type: string
 *           example: "MOH-123456"
 *         schedule:
 *           type: object
 *           example:
 *             Monday: ["09:00-12:00", "14:00-17:00"]
 *             Tuesday: ["10:00-13:00"]
 *         clinic_room:
 *           type: string
 *           example: "Room 101"
 *       required:
 *         - userId
 *         - specialization
 *         - bio
 *         - licenseNumber
 *         - schedule
 *
 *     DoctorUpdate:
 *       type: object
 *       properties:
 *         specialization:
 *           type: string
 *           example: "Neurology"
 *         bio:
 *           type: string
 *           example: "Specialist in neurological disorders."
 *         licenseNumber:
 *           type: string
 *           example: "MOH-654321"
 *         schedule:
 *           type: object
 *           example:
 *             Wednesday: ["09:00-12:00"]
 *         clinic_room:
 *           type: string
 *           example: "Room 202"
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
 * /HMS/doctors:
 *   post:
 *     summary: Create a new doctor profile
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       201:
 *         description: Doctor profile created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
doctorsRouter.post(
  "/",
  authenticateToken,
  authorizeRoles("doctor"),
  (req, res) => doctorController.createDoctor(req, res)
);

/**
 * @swagger
 * /HMS/doctors/{userId}:
 *   get:
 *     summary: Get doctor profile by userId
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the doctor (same as userId)
 *     responses:
 *       200:
 *         description: Doctor found
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
doctorsRouter.get("/:userId", (req, res) =>
  doctorController.getDoctorById(req, res)
);

/**
 * @swagger
 * /HMS/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of doctors
 *       500:
 *         description: Internal server error
 */
doctorsRouter.get("/", authenticateToken,(req, res) =>
  doctorController.getAllDoctors(req, res)
);

/**
 * @swagger
 * /HMS/doctors/{userId}:
 *   patch:
 *     summary: Update doctor profile
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the doctor (same as userId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoctorUpdate'
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
doctorsRouter.patch(
  "/:userId",
  authenticateToken,
  authorizeRoles("doctor"),
  (req, res) => doctorController.updateDoctor(req, res)
);

/**
 * @swagger
 * /HMS/doctors/{userId}:
 *   delete:
 *     summary: Delete doctor profile
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the doctor (same as userId)
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
doctorsRouter.delete(
  "/:userId",
  authenticateToken,
  authorizeRoles("doctor"),
  (req, res) => doctorController.deleteDoctor(req, res)
);

export default doctorsRouter;
