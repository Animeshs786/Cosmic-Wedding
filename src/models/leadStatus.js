const mongoose = require("mongoose");

const leadStatusSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    assign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assign",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Contact", "Accept", "Reject"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const LeadStatus = mongoose.model("LeadStatus", leadStatusSchema);
module.exports = LeadStatus;
