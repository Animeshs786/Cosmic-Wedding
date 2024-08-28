const Customer = require("../../models/customer");
const RejectedLead = require("../../models/rejectedLead");
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
    status,
    weedingLocation,
    reason,
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
  if (weedingLocation) updateObj.weedingLocation = weedingLocation;

  if (status) {
    if (status === "Reject") {
      await RejectedLead.create({
        lead: req.params.id,
        reason,
        rejectedBy: req.user._id,
      });
      updateObj.status = status;
    } else {
      updateObj.status = status;
    }
  }

  const customer = await Customer.findByIdAndUpdate(req.params.id, updateObj, {
    new: true,
    runValidators: true,
  });
  if (!customer) {
    return next(new AppError("Customer not found.", 404));
  }
  res.status(200).json({
    status: true,
    message: status
      ? "Status Update Successfully."
      : "Customer updated successfully",
    data: customer,
  });
});
