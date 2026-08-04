const Appointment = require("../models/Appointment");
const User = require("../models/User");


// Book appointment
const createAppointment = async (req, res, next) => {
  try {

    const {
      doctorId,
      appointmentDate,
      reason
    } = req.body;


    // Validate fields
    if (!doctorId || !appointmentDate || !reason) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    // Check appointment date
    const appointmentTime = new Date(appointmentDate);


    if (appointmentTime <= new Date()) {
      return res.status(400).json({
        message: "Appointment date must be in the future",
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


    // Prevent double booking
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: appointmentTime,
      status: {
        $in: ["pending", "confirmed"],
      },
    });


    if (existingAppointment) {
      return res.status(400).json({
        message: "Doctor is already booked for this time",
      });
    }


    const appointment = await Appointment.create({

      patient: req.user._id,

      doctor: doctorId,

      appointmentDate: appointmentTime,

      reason,

    });


    res.status(201).json({

      message: "Appointment booked successfully",

      appointment,

    });


  } catch (error) {

    next(error);

  }
};




// Get all appointments
const getAppointments = async (req, res, next) => {
  try {

    let appointments = [];


    if (req.user.role === "patient") {

      appointments = await Appointment.find({
        patient: req.user._id,
      })
        .populate("doctor", "fullName email phone")
        .sort({ appointmentDate: 1 });


    } else if (req.user.role === "doctor") {

      appointments = await Appointment.find({
        doctor: req.user._id,
      })
        .populate("patient", "fullName email phone")
        .sort({ appointmentDate: 1 });


    } else if (req.user.role === "admin") {

      appointments = await Appointment.find()
        .populate("patient", "fullName email phone")
        .populate("doctor", "fullName email phone")
        .sort({ appointmentDate: 1 });

    }


    res.status(200).json({

      count: appointments.length,

      appointments,

    });


  } catch (error) {

    next(error);

  }
};




// Get single appointment
const getAppointmentById = async (req, res, next) => {
  try {

    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "fullName email phone")
      .populate("doctor", "fullName email phone");


    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }


    if (
      req.user.role === "patient" &&
      appointment.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }


    if (
      req.user.role === "doctor" &&
      appointment.doctor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }


    res.status(200).json(appointment);


  } catch (error) {

    next(error);

  }
};




// Update appointment status
const updateAppointmentStatus = async (req, res, next) => {
  try {

    const {
      status,
      notes
    } = req.body;


    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];


    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }


    const appointment = await Appointment.findById(req.params.id);


    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }


    if (
      req.user.role !== "admin" &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }


    appointment.status = status;


    if (notes) {
      appointment.notes = notes;
    }


    await appointment.save();


    res.status(200).json({

      message: "Appointment updated successfully",

      appointment,

    });


  } catch (error) {

    next(error);

  }
};




// Cancel appointment
const cancelAppointment = async (req, res, next) => {
  try {

    const {
      cancelReason
    } = req.body;


    const appointment = await Appointment.findById(req.params.id);


    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }


    if (
      req.user.role === "patient" &&
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }


    appointment.status = "cancelled";

    appointment.cancelReason = cancelReason || "";


    await appointment.save();


    res.status(200).json({

      message: "Appointment cancelled successfully",

      appointment,

    });


  } catch (error) {

    next(error);

  }
};



module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
};