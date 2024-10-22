const mongoose = require("mongoose");

const packageScheam = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  validity: {
    type: Number,
    enum: [1, 10, 15, 40, 100, 190, 375, 60],
    required: true,
  },
  budgetRange: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BudgetRange",
    },
  ],
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
