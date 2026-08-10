const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "admin@test.com";

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      console.log(
        "Admin ID:",
        existingAdmin._id.toString()
      );

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Admin123!",
      10
    );

    const admin = await User.create({
      fullName: "HealthConnect Admin",
      email,
      password: hashedPassword,
      role: "admin",
      phone: "0200000000",
      isVerified: true,
    });

    console.log("Admin created successfully!");
    console.log("Admin ID:", admin._id.toString());
    console.log("Email:", admin.email);
    console.log("Password: Admin123!");

    process.exit(0);

  } catch (error) {
    console.error(
      "Error creating admin:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();