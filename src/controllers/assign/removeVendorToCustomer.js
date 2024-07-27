const Assign = require("../../models/assign");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.removeVendorToCustomer = catchAsync(async (req, res, next) => {
  const assign = await Assign.findByIdAndDelete(req.params.id);
  console.log(assign,"tsdf")
  if (!assign) {
    return next(new AppError("Assignment not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Assignment deleted successfully",
  });
});
