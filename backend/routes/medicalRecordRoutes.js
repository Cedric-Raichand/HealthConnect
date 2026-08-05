const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
} = require("../controllers/medicalRecordController");



/**
 * @swagger
 * /api/medical-records:
 *   post:
 *     summary: Create a new medical record
 *     tags:
 *       - Medical Records
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
 *               - diagnosis
 *               - symptoms
 *               - treatment
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               diagnosis:
 *                 type: string
 *                 example: Malaria
 *               symptoms:
 *                 type: string
 *                 example: Fever, headache and body pains
 *               treatment:
 *                 type: string
 *                 example: Artemether-Lumefantrine tablets
 *               notes:
 *                 type: string
 *                 example: Patient should drink plenty of water.
 *     responses:
 *       201:
 *         description: Medical record created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Only doctors can create medical records
 */
router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  createMedicalRecord
);



/**
 * @swagger
 * /api/medical-records:
 *   get:
 *     summary: Get medical records
 *     tags:
 *       - Medical Records
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of medical records
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getMedicalRecords
);



/**
 * @swagger
 * /api/medical-records/{id}:
 *   get:
 *     summary: Get a single medical record
 *     tags:
 *       - Medical Records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medical record ID
 *     responses:
 *       200:
 *         description: Medical record retrieved successfully
 *       404:
 *         description: Medical record not found
 */
router.get(
  "/:id",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getMedicalRecordById
);


module.exports = router;