const Assign = require("../../models/assign");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.assignVendorToCustomer = catchAsync(async (req, res, next) => {
  const { customer, vendor } = req.body;

  if (!customer || !vendor) {
    return next(new AppError("Customer and vendor are required fields.", 400));
  }

  const assign = await Assign.create({ customer, vendor });

  res.status(201).json({
    status: true,
    message: "Assignment created successfully",
    data: assign,
  });
});
