const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllAdmin = catchAsync(async (req, res) => {
  const { page, limit: currentLimit, search } = req.query;

  const obj = { role: "Admin" };

  if (search) {
    obj.userName = { $regex: search, $options: "i" };
  }

  const { limit, skip, totalResult, toatalPage } = await pagination(
    page,
    currentLimit,
    User,
    "Admin",
    obj
  );

  const admins = await User.find(obj)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: true,
    results: admins.length,
    totalResult,
    toatalPage,
    data: {
      admins,
    },
  });
});
