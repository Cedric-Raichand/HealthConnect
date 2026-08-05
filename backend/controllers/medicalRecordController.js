const MedicalRecord = require("../models/MedicalRecord");
const User = require("../models/User");


// Create medical record (Doctor only)
const createMedicalRecord = async (req, res) => {
  try {

    const {
      patientId,
      diagnosis,
      symptoms,
      treatment,
      notes,
    } = req.body;


    // Check patient exists
    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    });


    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }



    // Store uploaded documents
    const documents = [];


    if (req.files && req.files.length > 0) {

      req.files.forEach((file) => {

        documents.push({

          fileName: file.filename,

          filePath: `/uploads/${file.filename}`,

          fileType: file.mimetype,

        });

      });

    }



    const medicalRecord = await MedicalRecord.create({

      patient: patientId,

      doctor: req.user._id,

      diagnosis,

      symptoms,

      treatment,

      notes,

      documents,

    });



    res.status(201).json({

      message: "Medical record created successfully",

      medicalRecord,

    });



  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};





// Get medical records
const getMedicalRecords = async (req, res) => {
  try {

    let records = [];


    if (req.user.role === "patient") {

      records = await MedicalRecord.find({
        patient: req.user._id,
      })
        .populate("doctor", "fullName email phone")
        .sort({ createdAt: -1 });

    }


    else if (req.user.role === "doctor") {

      records = await MedicalRecord.find({
        doctor: req.user._id,
      })
        .populate("patient", "fullName email phone")
        .sort({ createdAt: -1 });

    }


    else if (req.user.role === "admin") {

      records = await MedicalRecord.find()
        .populate("patient", "fullName email phone")
        .populate("doctor", "fullName email phone")
        .sort({ createdAt: -1 });

    }



    res.status(200).json({

      count: records.length,

      records,

    });



  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};







// Get single medical record
const getMedicalRecordById = async (req, res) => {
  try {


    const record = await MedicalRecord.findById(req.params.id)
      .populate("patient", "fullName email phone")
      .populate("doctor", "fullName email phone");



    if (!record) {

      return res.status(404).json({

        message: "Medical record not found",

      });

    }




    if (
      req.user.role === "patient" &&
      record.patient._id.toString() !== req.user._id.toString()
    ) {


      return res.status(403).json({

        message: "Access denied",

      });


    }





    if (
      req.user.role === "doctor" &&
      record.doctor._id.toString() !== req.user._id.toString()
    ) {


      return res.status(403).json({

        message: "Access denied",

      });


    }





    res.status(200).json(record);




  } catch (error) {


    res.status(500).json({

      message: error.message,

    });


  }
};




module.exports = {

  createMedicalRecord,

  getMedicalRecords,

  getMedicalRecordById,

};