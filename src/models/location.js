const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
