const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");


const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
} = require("../controllers/prescriptionController");


const {
  createPrescriptionValidator,
} = require("../middleware/validators/prescriptionValidator");



// Doctor creates prescription
router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  createPrescriptionValidator,
  validate,
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