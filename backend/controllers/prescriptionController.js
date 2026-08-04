const Prescription = require("../models/Prescription");
const User = require("../models/User");
const MedicalRecord = require("../models/MedicalRecord");


// Create prescription
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
      medicalRecord.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot prescribe from this medical record",
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




// Get prescriptions
const getPrescriptions = async (req, res, next) => {
  try {

    let prescriptions = [];


    if (req.user.role === "patient") {

      prescriptions = await Prescription.find({
        patient: req.user._id,
      })
        .populate("doctor", "fullName email")
        .populate("medicalRecord")
        .sort({ createdAt: -1 });


    } else if (req.user.role === "doctor") {

      prescriptions = await Prescription.find({
        doctor: req.user._id,
      })
        .populate("patient", "fullName email")
        .populate("medicalRecord")
        .sort({ createdAt: -1 });


    } else if (req.user.role === "admin") {

      prescriptions = await Prescription.find()
        .populate("patient", "fullName email")
        .populate("doctor", "fullName email")
        .populate("medicalRecord")
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




// Get single prescription
const getPrescriptionById = async (req, res, next) => {
  try {

    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "fullName email phone")
      .populate("doctor", "fullName email phone")
      .populate("medicalRecord");


    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }


    if (
      req.user.role === "patient" &&
      prescription.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }


    if (
      req.user.role === "doctor" &&
      prescription.doctor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }


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