const User = require("../models/User");

// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE LOGGED-IN USER PROFILE
// ==========================================

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      fullName,
      phone,
      profileImage,
      dateOfBirth,
      gender,
      address,
      bloodGroup,
      emergencyContact,
      specialization,
      yearsOfExperience,
      licenseNumber,
      hospital,
      bio,
    } = req.body;

    // Common fields
    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.profileImage = profileImage || user.profileImage;

    // Patient fields
    if (req.user.role === "patient") {
      user.dateOfBirth =
        dateOfBirth || user.dateOfBirth;

      user.gender =
        gender || user.gender;

      user.address =
        address || user.address;

      user.bloodGroup =
        bloodGroup || user.bloodGroup;

      if (emergencyContact) {
        user.emergencyContact = emergencyContact;
      }
    }

    // Doctor fields
    if (req.user.role === "doctor") {
      user.specialization =
        specialization || user.specialization;

      user.yearsOfExperience =
        yearsOfExperience || user.yearsOfExperience;

      user.licenseNumber =
        licenseNumber || user.licenseNumber;

      user.hospital =
        hospital || user.hospital;

      user.bio =
        bio || user.bio;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL DOCTORS
// ==========================================

const getDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({
      role: "doctor",
    })
      .select("-password")
      .sort({ fullName: 1 });

    res.status(200).json({
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL USERS
// Admin only
// ==========================================

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET SINGLE USER
// Admin only
// ==========================================

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// VERIFY / UNVERIFY USER
// Admin only
// ==========================================

const updateUserVerification = async (req, res, next) => {
  try {
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        message: "isVerified must be true or false",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent admin from changing their own verification
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot change your own verification status",
      });
    }

    user.isVerified = isVerified;

    await user.save();

    res.status(200).json({
      message: isVerified
        ? "User verified successfully"
        : "User unverified successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE USER
// Admin only
// ==========================================

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  getProfile,
  updateProfile,
  getDoctors,
  getAllUsers,
  getUserById,
  updateUserVerification,
  deleteUser,
};