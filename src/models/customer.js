const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  weedingLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  eventDate: {
    type: Date,
    // required: true,
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
  budgetRange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BudgetRange",
    required: true,
  },
  guest: {
    type: Number,
    default: 0,
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  ],
  numberOfAssign: {
    type: Number,
    default: 0,
  },
  lastAssign: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["Pending", "Contact", "Accept", "Reject"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
