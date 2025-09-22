import Presc_medsService from "../services/Presc_medsService.js";
import Presc_medsControllers from "../controllers/Presc_medscontrollers.js";
import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middlewares/authmiddleware.js";

const presc_medsService = new Presc_medsService();
const presc_medsControllers = new Presc_medsControllers(presc_medsService);

const pscRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Presc_meds
 *   description: API for managing prescribed medicines
 *
 * components:
 *   schemas:
 *     Presc_meds:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         prescription_id:
 *           type: integer
 *           example: 10
 *         medicine_name:
 *           type: string
 *           example: Paracetamol
 *         dosage:
 *           type: string
 *           example: 500mg
 *         frequency:
 *           type: integer
 *           example: 3
 *         frequency_unit:
 *           type: string
 *           example: day
 *         duration_days:
 *           type: integer
 *           example: 7
 */

/**
 * @swagger
 * /presc-meds:
 *   post:
 *     summary: Create a new prescribed medicine
 *     tags: [Presc_meds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Presc_meds'
 *     responses:
 *       201:
 *         description: Medicine created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
pscRouter.post("/", async (req, res) => {
  try {
    await presc_medsControllers.create(req, res);
  } catch (error) {
    console.error("Error in POST /presc-meds:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @swagger
 * /presc-meds:
 *   get:
 *     summary: Get all prescribed medicines
 *     tags: [Presc_meds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of prescribed medicines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Presc_meds'
 *       500:
 *         description: Server error
 */
pscRouter.get("/", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
  try {
    await presc_medsControllers.getAll(req, res);
  } catch (error) {
    console.error("Error in GET /presc-meds:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @swagger
 * /presc-meds/{id}:
 *   get:
 *     summary: Get a prescribed medicine by ID
 *     tags: [Presc_meds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medicine ID
 *     responses:
 *       200:
 *         description: Medicine details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Presc_meds'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Server error
 */
pscRouter.get("/:id", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
  try {
    await presc_medsControllers.getById(req, res);
  } catch (error) {
    console.error("Error in GET /presc-meds/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @swagger
 * /presc-meds/{id}:
 *   put:
 *     summary: Update a prescribed medicine by ID
 *     tags: [Presc_meds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medicine ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Presc_meds'
 *     responses:
 *       200:
 *         description: Medicine updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Server error
 */
pscRouter.put("/:id", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
  try {
    await presc_medsControllers.update(req, res);
  } catch (error) {
    console.error("Error in PUT /presc-meds/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default pscRouter;
