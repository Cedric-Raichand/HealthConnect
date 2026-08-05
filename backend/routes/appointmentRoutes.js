const express = require("express");

const router = express.Router();


const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


const {
  createAppointment,
  getAppointments,
} = require("../controllers/appointmentController");





/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book a new appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - appointmentDate
 *               - reason
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               appointmentDate:
 *                 type: string
 *                 example: 2026-08-10T10:00:00Z
 *               reason:
 *                 type: string
 *                 example: Regular medical checkup
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Only patients can book appointments
 */
router.post(
  "/",
  protect,
  authorizeRoles("patient"),
  createAppointment
);






/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get appointments based on user role
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getAppointments
);



module.exports = router;