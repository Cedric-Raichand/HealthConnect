const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
} = require("../controllers/prescriptionController");


// ==========================================
// CREATE PRESCRIPTION
// Doctor only
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  createPrescription
);


// ==========================================
// GET ALL PRESCRIPTIONS
// Patient, Doctor, Admin
// ==========================================

router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getPrescriptions
);


// ==========================================
// GET SINGLE PRESCRIPTION
// Patient, Doctor, Admin
// ==========================================

router.get(
  "/:id",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  validateObjectId("id", "prescription"),
  getPrescriptionById
);


module.exports = router;