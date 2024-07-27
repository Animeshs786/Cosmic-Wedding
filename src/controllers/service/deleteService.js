const Service = require("../../models/service");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.deleteServiceCategory = catchAsync(async (req, res, next) => {
  const serviceCategory = await Service.findByIdAndDelete(req.params.id);
  if (!serviceCategory) {
    return next(new AppError("Service category not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Service category deleted successfully",
  });
});
