const Package = require("../../models/package");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.getPackage = catchAsync(async (req, res, next) => {
  const packageData = await Package.findById(req.params.id);
  if (!packageData) {
    return next(new AppError("Package not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Package retrieved successfully",
    data: {packageData},
  });
});
