const BudgetRange = require("../../models/budgetRange");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.updateBudgetRange = catchAsync(async (req, res, next) => {
  const { name, min, max } = req.body;
  const updateObj = {};
  if (name) updateObj.name = name;
  if (min) updateObj.min = min;
  if (max) updateObj.max = max;

  const budgetRange = await BudgetRange.findByIdAndUpdate(
    req.params.id,
    updateObj,
    { new: true, runValidators: true }
  );
  
  if (!budgetRange) {
    return next(new AppError("Budget range not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Budget range updated successfully",
    data: { budgetRange },
  });
});
