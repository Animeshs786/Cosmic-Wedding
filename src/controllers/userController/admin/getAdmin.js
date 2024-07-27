const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.GetAdmin = catchAsync(async (req, res, next) => {
  const admin = await User.findById(req.params.id);

  if (!admin) {
    return next(new AppError("No admin found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      admin,
    },
  });
});
