const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  duration: {
    type: Number,
    required: true,
  },
  numberOfAssign: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Setting = mongoose.model("Setting", settingSchema);
module.exports = Setting;
