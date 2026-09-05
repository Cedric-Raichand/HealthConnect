const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadmiddleware");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");

const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordDocument,
} = require("../controllers/medicalRecordController");

const {
  createMedicalRecordValidator,
} = require("../middleware/validators/medicalRecordValidator");

// ==========================================
// CREATE MEDICAL RECORD
// Doctor only
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  upload.array("documents", 5),
  createMedicalRecordValidator,
  validate,
  createMedicalRecord
);

// ==========================================
// GET ALL MEDICAL RECORDS
// Patient, Doctor, Admin
// ==========================================

router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getMedicalRecords
);

// ==========================================
// GET MEDICAL RECORD DOCUMENT
// Patient, Doctor, Admin
// ==========================================

router.get(
  "/:id/documents/:documentId",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  validateObjectId("id", "medical record"),
  validateObjectId("documentId", "document"),
  getMedicalRecordDocument
);

// ==========================================
// GET SINGLE MEDICAL RECORD
// Patient, Doctor, Admin
// ==========================================

router.get(
  "/:id",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  validateObjectId("id", "medical record"),
  getMedicalRecordById
);

module.exports = router;
