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
    location,
    verify,
    startDate,
    endDate,
  } = req.query;

  const obj = {
    role: "Vendor",
  };

  if (search) {
    obj.$or = [
      { userName: { $regex: search, $options: "i" } },
      // You can add more fields to search in location or other fields
    ];
  }

  if (verify) {
    obj.verify = verify;
  }

  if (location) {
    obj.location = location;
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

  const setStartOfDay = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const setEndOfDay = (date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  if (startDate && !endDate) {
    obj.createdAt = {
      $gte: setStartOfDay(startDate),
      $lte: setEndOfDay(startDate),
    };
  } else if (startDate && endDate) {
    obj.createdAt = {
      $gte: setStartOfDay(startDate),
      $lte: setEndOfDay(endDate),
    };
  } else if (endDate) {
    obj.createdAt = {
      $lte: setEndOfDay(endDate),
    };
  }

  const { limit, skip, totalResult, toatalPage } = await pagination(
    page,
    currentLimit,
    User,
    "Vendor",
    obj
  );

  const vendors = await User.find(obj)
    .populate("location", "location")
    .populate("package","assignLeadValue")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: true,
    results: vendors.length,
    totalResult,
    totalPage: toatalPage,
    data: {
      vendors,
    },
  });
});
