const Customer = require("../../models/customer");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.deleteCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    return next(new AppError("Customer not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Customer deleted successfully",
  });
});
