const Assign = require("../../models/assign");
const Customer = require("../../models/customer");
const RejectedLead = require("../../models/rejectedLead");
const User = require("../../models/user");
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
    verify,
    assignVendor,
  } = req.body;

  const updateObj = {};

  if (name) updateObj.name = name;
  if (verify === true || verify === false) {
    updateObj.verify = verify;
  }
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

    if (status === "Pending") {
      if (!assignVendor)
        return next(new AppError("Please select a vendor", 400));

      const assingData = await Assign.findOne({
        customer: req.params.id,
        vendor: assignVendor,
      });

      if (assingData) {
        const vendorData = await User.findById(assingData.vendor);
        vendorData.assignCustomerNumber -= 1;
        await vendorData.save();
        await Assign.findByIdAndDelete(assingData._id);

        //Decrease the assign lead number of the customer
        const customer = await Customer.findById(assingData.customer);
        customer.numberOfAssign -= 1;
        customer.lastAssign = new Date();
        await customer.save();
      }
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
