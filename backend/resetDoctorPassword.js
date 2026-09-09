require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");

const resetDoctorPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "doctor@gmail.com";
    const newPassword = "Doctor@123";

    const user = await User.findOne({ email });

    if (!user) {
      console.log("Doctor account not found.");
      process.exit(1);
    }

    if (user.role !== "doctor") {
      console.log("This account is not a doctor account.");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    console.log("Doctor password reset successfully.");
    console.log(`Email: ${email}`);
    console.log(`New password: ${newPassword}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Password reset failed:", error.message);
    process.exit(1);
  }
};

resetDoctorPassword();