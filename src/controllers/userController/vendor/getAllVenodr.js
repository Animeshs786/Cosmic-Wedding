const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllVendors = catchAsync(async (req, res) => {
  const {
    page,
    limit: currentLimit,
    search,
    service,
    package: packageData,
    budgetRange,
  } = req.query;

  const obj = {
    role: "Vendor",
  };

  if (search) {
    obj.$or = [
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }
  
  if (service) {
    obj.service = service;
  }
  if (packageData) {
    obj.package = packageData;
  }
  if (budgetRange) {
    obj.budgetRange = budgetRange;
  }

  const { limit, skip, totalResult, toatalPage } = await pagination(
    page,
    currentLimit,
    User,
    "Vendor",
    obj
  );

  const vendors = await User.find(obj)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: true,
    results: vendors.length,
    totalResult,
    totalPage:toatalPage,
    data: {
      vendors,
    },
  });
});
