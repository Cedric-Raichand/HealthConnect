const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    symptoms: {
      type: String,
      required: true,
      trim: true,
    },

    treatment: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


medicalRecordSchema.index({ patient: 1 });
medicalRecordSchema.index({ doctor: 1 });


module.exports = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);