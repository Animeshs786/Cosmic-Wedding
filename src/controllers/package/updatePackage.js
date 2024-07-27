const Package = require("../../models/package");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.updatePackage = catchAsync(async (req, res, next) => {
  const pacakgeData = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pacakgeData) {
    return next(new AppError("Package not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Package updated successfully",
    data: { pacakgeData },
  });
});
