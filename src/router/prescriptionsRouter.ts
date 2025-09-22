import { Router } from "express";
import PrescriptionService from "../services/prescriptionservice.js";
import PrescriptionsControllers from "../controllers/prescriptionscontrollers.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authmiddleware.js";

const prescriptionService = new PrescriptionService();
const prescriptionsControllers = new PrescriptionsControllers(prescriptionService);
const preRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: APIs for managing medical prescriptions
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     PrescriptionInput:
 *       type: object
 *       required:
 *         - doctor_id
 *         - patient_id
 *         - appointment_id
 *         - advice
 *       properties:
 *         doctor_id:
 *           type: integer
 *           example: 1
 *         patient_id:
 *           type: integer
 *           example: 2
 *         appointment_id:
 *           type: integer
 *           example: 5
 *         advice:
 *           type: string
 *           example: "Take medicine after meals"
 *     Prescription:
 *       allOf:
 *         - $ref: '#/components/schemas/PrescriptionInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 10
 *             created_at:
 *               type: string
 *               format: date-time
 *             updated_at:
 *               type: string
 *               format: date-time
 */

/**
 * @swagger
 * /HMS/prescriptions:
 *   post:
 *     summary: Create a new prescription (Doctor only)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionInput'
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (requires doctor role)
 *       500:
 *         description: Server error
 */
preRouter.post("/", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
  try {
    await prescriptionsControllers.create(req, res);
  } catch (err) {
    console.error("Error in POST /prescriptions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @swagger
 * /HMS/prescriptions:
 *   get:
 *     summary: Get all prescriptions (Admin only)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all prescriptions
 *       401:
 *         description: Unauthorized (requires admin role)
 *       500:
 *         description: Server error
 */
preRouter.get("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    await prescriptionsControllers.getAll(req, res);
  } catch (err) {
    console.error("Error in GET /prescriptions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @swagger
 * /HMS/prescriptions/{id}:
 *   get:
 *     summary: Get prescription by ID (Doctor only)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prescription ID
 *     responses:
 *       200:
 *         description: Prescription found
 *       404:
 *         description: Prescription not found
 *       401:
 *         description: Unauthorized (requires doctor role)
 *       500:
 *         description: Server error
 */
preRouter.get("/:id", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
  try {
    await prescriptionsControllers.getById(req, res);
  } catch (err) {
    console.error("Error in GET /prescriptions/:id:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @swagger
 * /HMS/prescriptions/{id}:
 *   patch:
 *     summary: Update prescription advice (Doctor only)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prescription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - advice
 *             properties:
 *               advice:
 *                 type: string
 *                 example: "Take medicine after meals"
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Prescription not found
 *       401:
 *         description: Unauthorized (requires doctor role)
 *       500:
 *         description: Server error
 */
preRouter.patch("/:id",authenticateToken,authorizeRoles("doctor"), async (req, res) => {
  try {
    await prescriptionsControllers.update(req, res);
  } catch (err) {
    console.error("Error in PATCH /prescriptions/:id:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default preRouter;
