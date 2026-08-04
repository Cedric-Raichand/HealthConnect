const User = require("../models/User");


// Get logged-in user's profile
const getProfile = async (req, res) => {
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

    res.status(500).json({
      message: error.message,
    });

  }
};




// Update logged-in user's profile
const updateProfile = async (req, res) => {
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

      user.dateOfBirth = dateOfBirth || user.dateOfBirth;
      user.gender = gender || user.gender;
      user.address = address || user.address;
      user.bloodGroup = bloodGroup || user.bloodGroup;


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

    res.status(500).json({
      message: error.message,
    });

  }
};



module.exports = {
  getProfile,
  updateProfile,
};