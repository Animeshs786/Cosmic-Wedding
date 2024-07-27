const Package = require("../../models/package");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.deletePackage = catchAsync(async (req, res, next) => {
  const packageData = await Package.findByIdAndDelete(req.params.id);
  if (!packageData) {
    return next(new AppError("Pacakge not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Pacakge deleted successfully",
  });
});
