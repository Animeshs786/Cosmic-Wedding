const mongoose = require("mongoose");

const budgetRangeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BudgetRange = mongoose.model("BudgetRange", budgetRangeSchema);

module.exports = BudgetRange;
