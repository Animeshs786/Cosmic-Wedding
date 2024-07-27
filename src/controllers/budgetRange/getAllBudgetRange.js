const BudgetRange = require("../../models/budgetRange");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

exports.getAllBudgetRanges = catchAsync(async (req, res) => {
  const { page, limit: currentLimit, search } = req.query;
  const obj = {
  };
  if (search) {
    obj.name = { $regex: search, $options: "i" };
  }

  const { limit, skip, totalResult, toatalPage } = await pagination(
    page,
    currentLimit,
    BudgetRange
  );
  const budgetRanges = await BudgetRange.find(obj).skip(skip).limit(limit);
  res.status(200).json({
    status: true,
    message: "Budget ranges retrieved successfully",
    totalResult,
    toatalPage,
    data: { budgetRanges },
  });
});
