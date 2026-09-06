const Prescription = require("../models/Prescription");
const User = require("../models/User");
const MedicalRecord = require("../models/MedicalRecord");

// ==========================================
// CREATE PRESCRIPTION
// Doctor only
// ==========================================

const createPrescription = async (req, res, next) => {
  try {
    const {
      patientId,
      medicalRecordId,
      medicine,
      dosage,
      frequency,
      duration,
      instructions,
    } = req.body;

    // Validate required fields
    if (
      !patientId ||
      !medicalRecordId ||
      !medicine ||
      !dosage ||
      !frequency ||
      !duration
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check patient exists
    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // Check medical record exists
    const medicalRecord = await MedicalRecord.findById(
      medicalRecordId
    );

    if (!medicalRecord) {
      return res.status(404).json({
        message: "Medical record not found",
      });
    }

    // Ensure doctor owns the medical record
    if (
      medicalRecord.doctor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot prescribe from this medical record",
      });
    }

    // Ensure the medical record belongs to the selected patient
    if (
      medicalRecord.patient.toString() !==
      patientId.toString()
    ) {
      return res.status(400).json({
        message: "Medical record does not belong to this patient",
      });
    }

    const prescription = await Prescription.create({
      patient: patientId,
      doctor: req.user._id,
      medicalRecord: medicalRecordId,
      medicine,
      dosage,
      frequency,
      duration,
      instructions,
    });

    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET PRESCRIPTIONS
// ==========================================

const getPrescriptions = async (req, res, next) => {
  try {
    let prescriptions = [];

    if (req.user.role === "patient") {
      prescriptions = await Prescription.find({
        patient: req.user._id,
      })
        .populate("doctor", "fullName email")
        .populate(
          "medicalRecord",
          "diagnosis symptoms treatment notes createdAt"
        )
        .sort({ createdAt: -1 });
    } else if (req.user.role === "doctor") {
      prescriptions = await Prescription.find({
        doctor: req.user._id,
      })
        .populate("patient", "fullName email")
        .populate(
          "medicalRecord",
          "diagnosis symptoms treatment notes createdAt"
        )
        .sort({ createdAt: -1 });
    } else if (req.user.role === "admin") {
      prescriptions = await Prescription.find()
        .populate("patient", "fullName email")
        .populate("doctor", "fullName email")
        .populate(
          "medicalRecord",
          "diagnosis symptoms treatment notes createdAt"
        )
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET SINGLE PRESCRIPTION
// ==========================================

const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "fullName email phone")
      .populate("doctor", "fullName email phone")
      .populate(
        "medicalRecord",
        "diagnosis symptoms treatment notes createdAt"
      );

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    // Patients can only access their own prescriptions
    if (
      req.user.role === "patient" &&
      prescription.patient._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Doctors can only access prescriptions they created
    if (
      req.user.role === "doctor" &&
      prescription.doctor._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Admins are allowed to access all prescriptions
    res.status(200).json(prescription);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
};