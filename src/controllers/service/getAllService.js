const Service = require("../../models/service");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

exports.getAllServiceCategories = catchAsync(async (req, res) => {
  const { page, limit: currentLimit, search } = req.query;
  const obj = {};
  if (search) {
    obj.name = { $regex: search, $options: "i" };
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    page,
    currentLimit,
    Service
  );

  const services = await Service.find(obj).skip(skip).limit(limit);
  
  res.status(200).json({
    status: true,
    message: "Service categories retrieved successfully",
    totalResult,
    totalPage,
    data: { services },
  });
});
