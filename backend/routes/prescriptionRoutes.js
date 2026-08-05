const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
} = require("../controllers/prescriptionController");

const validate = require("../middleware/validate");

const {
  createPrescriptionValidator,
} = require("../middleware/validators/prescriptionValidator");



/**
 * @swagger
 * /api/prescriptions:
 *   post:
 *     summary: Create a new prescription
 *     tags:
 *       - Prescriptions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - medicalRecordId
 *               - medicine
 *               - dosage
 *               - frequency
 *               - duration
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               medicalRecordId:
 *                 type: string
 *                 example: 64f123456789abcdef654321
 *               medicine:
 *                 type: string
 *                 example: Amoxicillin
 *               dosage:
 *                 type: string
 *                 example: 500mg
 *               frequency:
 *                 type: string
 *                 example: Three times daily
 *               duration:
 *                 type: string
 *                 example: 7 days
 *               instructions:
 *                 type: string
 *                 example: Take after meals.
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Only doctors can create prescriptions
 */
router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  createPrescriptionValidator,
  validate,
  createPrescription
);



/**
 * @swagger
 * /api/prescriptions:
 *   get:
 *     summary: Get prescriptions
 *     tags:
 *       - Prescriptions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of prescriptions
 */
router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getPrescriptions
);



/**
 * @swagger
 * /api/prescriptions/{id}:
 *   get:
 *     summary: Get a prescription by ID
 *     tags:
 *       - Prescriptions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prescription ID
 *     responses:
 *       200:
 *         description: Prescription retrieved successfully
 *       404:
 *         description: Prescription not found
 */
router.get(
  "/:id",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getPrescriptionById
);


module.exports = router;