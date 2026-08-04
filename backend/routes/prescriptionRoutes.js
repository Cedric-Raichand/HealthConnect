const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
} = require("../controllers/prescriptionController");


// Create prescription (Doctor only)
router.post(
  "/",
  protect,
  createPrescription
);


// Get prescriptions based on role
router.get(
  "/",
  protect,
  getPrescriptions
);


// Get single prescription
router.get(
  "/:id",
  protect,
  getPrescriptionById
);


module.exports = router;