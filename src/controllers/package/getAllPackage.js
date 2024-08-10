const Package = require("../../models/package");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

exports.getAllPackage = catchAsync(async (req, res) => {
  const { page, limit: currentLimit, search } = req.query;
  const obj = {};
  if (search) {
    obj.name = { $regex: search, $options: "i" };
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    page,
    currentLimit,
    Package
  );

  const packageData = await Package.find(obj).populate('budgetRange','name').skip(skip).limit(limit);

  res.status(200).json({
    status: true,
    message: "Package retrieved successfully",
    totalResult,
    totalPage,
    data: { packageData },
  });
});
