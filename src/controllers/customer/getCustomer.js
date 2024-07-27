const Customer = require("../../models/customer");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.getCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id)
    .populate("budgetRange")
    .populate("services");
    
  if (!customer) {
    return next(new AppError("Customer not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Customer retrieved successfully",
    data: customer,
  });
});
