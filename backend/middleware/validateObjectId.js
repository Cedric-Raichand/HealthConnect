const mongoose = require("mongoose");

const validateObjectId = (paramName, resourceName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Invalid ${resourceName} ID`,
      });
    }

    next();
  };
};

module.exports = validateObjectId;