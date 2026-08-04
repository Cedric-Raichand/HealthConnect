const User = require("../models/User");
const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");
const Prescription = require("../models/Prescription");


// Get dashboard statistics
const getDashboard = async (req, res) => {
  try {

    let dashboard = {};


    // Patient dashboard
    if (req.user.role === "patient") {

      const appointments = await Appointment.countDocuments({
        patient: req.user._id,
      });

      const upcomingAppointments = await Appointment.countDocuments({
        patient: req.user._id,
        status: {
          $in: ["pending", "confirmed"],
        },
      });

      const medicalRecords = await MedicalRecord.countDocuments({
        patient: req.user._id,
      });

      const prescriptions = await Prescription.countDocuments({
        patient: req.user._id,
      });


      dashboard = {
        appointments,
        upcomingAppointments,
        medicalRecords,
        prescriptions,
      };

    }


    // Doctor dashboard
    else if (req.user.role === "doctor") {

      const appointments = await Appointment.countDocuments({
        doctor: req.user._id,
      });

      const pendingAppointments = await Appointment.countDocuments({
        doctor: req.user._id,
        status: "pending",
      });

      const completedAppointments = await Appointment.countDocuments({
        doctor: req.user._id,
        status: "completed",
      });

      const patients = await Appointment.distinct(
        "patient",
        {
          doctor: req.user._id,
        }
      );


      dashboard = {
        totalAppointments: appointments,
        totalPatients: patients.length,
        pendingAppointments,
        completedAppointments,
      };

    }


    // Admin dashboard
    else if (req.user.role === "admin") {

      const users = await User.countDocuments();

      const doctors = await User.countDocuments({
        role: "doctor",
      });

      const patients = await User.countDocuments({
        role: "patient",
      });

      const appointments = await Appointment.countDocuments();

      const records = await MedicalRecord.countDocuments();

      const prescriptions = await Prescription.countDocuments();


      dashboard = {
        users,
        doctors,
        patients,
        appointments,
        records,
        prescriptions,
      };

    }


    res.status(200).json(dashboard);


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


module.exports = {
  getDashboard,
};