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

// Use the existing model if it is already defined, otherwise define it
const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);

module.exports = Location;
