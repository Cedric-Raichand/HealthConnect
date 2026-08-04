const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
} = require("../controllers/medicalRecordController");


// Create medical record
router.post(
  "/",
  protect,
  createMedicalRecord
);


// Get all medical records based on role
router.get(
  "/",
  protect,
  getMedicalRecords
);


// Get single medical record
router.get(
  "/:id",
  protect,
  getMedicalRecordById
);


module.exports = router;