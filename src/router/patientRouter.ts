import PatientService from "../services/patientService.js";
import PatientController from "../controllers/patientControllers.js";
import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middlewares/authmiddleware.js";

const patientRouter = Router();
const patientService = new PatientService();
const patientController = new PatientController(patientService);

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management APIs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Ahmed Ali"
 *         age:
 *           type: number
 *           example: 30
 *         gender:
 *           type: string
 *           enum: [Male, Female]
 *           example: "Male"
 *         address:
 *           type: string
 *           example: "Cairo, Egypt"
 *         emergencyContact:
 *           type: string
 *           example: "+201234567890"
 */

/**
 * @swagger
 * /HMS/patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *                 token:
 *                   type: string
 *                   description: JWT token for the patient
 *       400:
 *         description: Validation error or user role mismatch
 *       500:
 *         description: Internal server error
 */
patientRouter.post(
  "/",
  authenticateToken,
  authorizeRoles("patient"),
  (req, res) => patientController.createPatient(req, res)
);

/**
 * @swagger
 * /HMS/patients/{userId}:
 *   get:
 *     summary: Get patient by userId
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: User ID of the patient
 *     responses:
 *       200:
 *         description: Patient found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
patientRouter.get(
  "/:userId",
  authenticateToken,
  authorizeRoles("patient", "admin","doctor"),
  (req, res) => patientController.getPatientByUserId(req, res)
);

/**
 * @swagger
 * /HMS/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
patientRouter.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => patientController.getAllPatients(req, res)
);

/**
 * @swagger
 * /HMS/patients/{userId}:
 *   patch:
 *     summary: Update patient details partially by userId
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: User ID of the patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *               address:
 *                 type: string
 *               emergencyContact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
patientRouter.patch(
  "/:userId",
  authenticateToken,
  authorizeRoles("patient", "admin"),
  (req, res) => patientController.updatePatient(req, res)
);

/**
 * @swagger
 * /HMS/patients/{userId}:
 *   delete:
 *     summary: Delete patient by userId
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: User ID of the patient
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
patientRouter.delete(
  "/:userId",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => patientController.deletePatient(req, res)
);

export default patientRouter;
