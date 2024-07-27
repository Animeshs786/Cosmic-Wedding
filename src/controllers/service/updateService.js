const Service = require("../../models/service");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.updateServiceCategory = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    return next(new AppError("Service category not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Service category updated successfully",
    data: { service },
  });
});
