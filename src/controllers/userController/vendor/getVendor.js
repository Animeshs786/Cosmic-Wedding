const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getVendor = catchAsync(async (req, res, next) => {
  const vendor = await User.findById(req.params.id);

  if (!vendor) {
    return next(new AppError("No vendor found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      vendor,
    },
  });
});
