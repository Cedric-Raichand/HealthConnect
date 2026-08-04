const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
} = require("../controllers/prescriptionController");


// Doctor creates prescription
router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  createPrescription
);


// Patient, Doctor, Admin can view prescriptions
router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getPrescriptions
);


// Patient, Doctor, Admin can view single prescription
router.get(
  "/:id",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getPrescriptionById
);


module.exports = router;