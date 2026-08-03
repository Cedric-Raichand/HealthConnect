const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Book appointment (Patient only)
const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, reason } = req.body;

    // Only patients can book appointments
    if (req.user.role !== "patient") {
      return res.status(403).json({
        message: "Only patients can book appointments",
      });
    }

    // Validate fields
    if (!doctorId || !appointmentDate || !reason) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check doctor exists
    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate,
      reason,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
// Get appointments
const getAppointments = async (req, res) => {
  try {

    let appointments = [];

    if (req.user.role === "patient") {

      appointments = await Appointment.find({
        patient: req.user._id,
      })
        .populate("doctor", "fullName email")
        .sort({ appointmentDate: 1 });

    } else if (req.user.role === "doctor") {

      appointments = await Appointment.find({
        doctor: req.user._id,
      })
        .populate("patient", "fullName email")
        .sort({ appointmentDate: 1 });

    } else if (req.user.role === "admin") {

      appointments = await Appointment.find()
        .populate("patient", "fullName email")
        .populate("doctor", "fullName email")
        .sort({ appointmentDate: 1 });

    }

    res.json(appointments);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  createAppointment,
  getAppointments,
};