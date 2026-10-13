const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads/ is git-ignored, so it does not exist on a fresh deploy
fs.mkdirSync(path.join(__dirname, "../uploads"), { recursive: true });

const storage = multer.diskStorage({

  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename(req, file, cb) {

    cb(
      null,
      `${Date.now()}-${file.originalname}`
    );

  },

});

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {

    cb(null, true);

  } else {

    cb(
      new Error("Only JPG, PNG and PDF files are allowed."),
      false
    );

  }

};

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

});

module.exports = upload;