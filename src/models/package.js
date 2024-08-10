const mongoose = require("mongoose");

const packageScheam = new mongoose.Schema({
  name: {
    type: String,
    required: true,
   
  },
  validity: {
    type: Number,
    enum: [1, 3, 6, 12],
    required: true,
  },
  budgetRange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BudgetRange",
  },
  assignLeadValue: {
    type: Number,
    required: true, //it define lead value for package
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Package = mongoose.model("Package", packageScheam);

module.exports = Package;
