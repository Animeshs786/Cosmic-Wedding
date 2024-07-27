const mongoose = require("mongoose");

const packageScheam = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Package = mongoose.model("Package", packageScheam);

module.exports = Package;
