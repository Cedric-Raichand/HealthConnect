const User = require("../models/User");
const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");
const Prescription = require("../models/Prescription");

// Get dashboard statistics
// All counts for a role run in parallel (one round-trip of latency instead of 4-6 in a row).
const getDashboard = async (req, res, next) => {
  try {
    const { role, _id } = req.user;
    let dashboard = {};

    if (role === "patient") {
      const [
        appointments,
        upcomingAppointments,
        medicalRecords,
        prescriptions,
      ] = await Promise.all([
        Appointment.countDocuments({ patient: _id }),
        Appointment.countDocuments({
          patient: _id,
          status: { $in: ["pending", "confirmed"] },
        }),
        MedicalRecord.countDocuments({ patient: _id }),
        Prescription.countDocuments({ patient: _id }),
      ]);

      dashboard = {
        appointments,
        upcomingAppointments,
        medicalRecords,
        prescriptions,
      };
    } else if (role === "doctor") {
      const [
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        patients,
      ] = await Promise.all([
        Appointment.countDocuments({ doctor: _id }),
        Appointment.countDocuments({ doctor: _id, status: "pending" }),
        Appointment.countDocuments({ doctor: _id, status: "completed" }),
        Appointment.distinct("patient", { doctor: _id }),
      ]);

      dashboard = {
        totalAppointments,
        totalPatients: patients.length,
        pendingAppointments,
        completedAppointments,
      };
    } else if (role === "admin") {
      const [
        users,
        doctors,
        patients,
        appointments,
        records,
        prescriptions,
      ] = await Promise.all([
        User.estimatedDocumentCount(),
        User.countDocuments({ role: "doctor" }),
        User.countDocuments({ role: "patient" }),
        Appointment.estimatedDocumentCount(),
        MedicalRecord.estimatedDocumentCount(),
        Prescription.estimatedDocumentCount(),
      ]);

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
    next(error);
  }
};

module.exports = {
  getDashboard,
};