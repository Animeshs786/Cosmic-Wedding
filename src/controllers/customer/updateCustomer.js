const Customer = require("../../models/customer");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.updateCustomer = catchAsync(async (req, res, next) => {
  const {
    name,
    mobile,
    location,
    eventDate,
    email,
    budgetRange,
    guest,
    services,
    status
  } = req.body;

  const updateObj = {};

  if (name) updateObj.name = name;
  if (mobile) updateObj.mobile = mobile;
  if (location) updateObj.location = location;
  if (eventDate) updateObj.eventDate = eventDate;
  if (email) updateObj.email = email;
  if (budgetRange) updateObj.budgetRange = budgetRange;
  if (guest) updateObj.guest = guest;
  if (services) updateObj.services = services;
  if (status) updateObj.status = status;

  const customer = await Customer.findByIdAndUpdate(req.params.id, updateObj, {
    new: true,
    runValidators: true,
  });
  if (!customer) {
    return next(new AppError("Customer not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: "Customer updated successfully",
    data: customer,
  });
});
