const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
} = require("../controllers/medicalRecordController");


// Doctor creates medical records
router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  createMedicalRecord
);


// Patient, Doctor, Admin view records
router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getMedicalRecords
);


// Patient, Doctor, Admin view single record
router.get(
  "/:id",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getMedicalRecordById
);


module.exports = router;