const BudgetRange = require("../../models/budgetRange");
const catchAsync = require("../../utils/catchAsync");

exports.createBudgetRange = catchAsync(async (req, res) => {
  const { name, min, max } = req.body;
  const budgetRange = await BudgetRange.create({ name, min, max });
  res.status(201).json({
    status: true,
    message: "Budget range created successfully",
    data: { budgetRange },
  });
});
