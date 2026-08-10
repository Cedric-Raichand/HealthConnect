const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC USER INFORMATION
    // ==========================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },


    // ==========================================
    // PATIENT INFORMATION
    // ==========================================

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    bloodGroup: {
      type: String,
      default: "",
      trim: true,
    },

    emergencyContact: {
      name: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      relationship: {
        type: String,
        default: "",
      },
    },


    // ==========================================
    // DOCTOR INFORMATION
    // ==========================================

    specialization: {
      type: String,
      default: "",
      trim: true,
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
    },

    licenseNumber: {
      type: String,
      default: "",
      trim: true,
    },

    hospital: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },


    // ==========================================
    // ACCOUNT VERIFICATION
    // ==========================================

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("User", userSchema);