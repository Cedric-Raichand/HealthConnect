const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");

const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
} = require("../controllers/prescriptionController");

const {
  createPrescriptionValidator,
} = require("../middleware/validators/prescriptionValidator");

// ==========================================
// CREATE PRESCRIPTION
// Doctor only
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  createPrescriptionValidator,
  validate,
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