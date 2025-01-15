const mongoose = require("mongoose");

const rejectedLeadSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  remark: {
    type: String,
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Success", "Reject"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RejectedLead = mongoose.model("RejectedLead", rejectedLeadSchema);
module.exports = RejectedLead;
