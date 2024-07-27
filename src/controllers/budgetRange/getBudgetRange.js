const BudgetRange = require("../../models/budgetRange");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.getBudgetRange = catchAsync(async (req, res, next) => {
  const budgetRange = await BudgetRange.findById(req.params.id);
  if (!budgetRange) {
    return next(new AppError("Budget range not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Budget range retrieved successfully",
    data: { budgetRange },
  });
});
