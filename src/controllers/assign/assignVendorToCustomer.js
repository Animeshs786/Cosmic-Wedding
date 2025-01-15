const Assign = require("../../models/assign");
const Customer = require("../../models/customer");
const LeadStatus = require("../../models/leadStatus");
const User = require("../../models/user");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

// exports.assignVendorToCustomer = catchAsync(async (req, res, next) => {
//   const { customer, vendor } = req.body;

//   if (!customer || !vendor) {
//     return next(new AppError("Customer and vendor are required fields.", 400));
//   }
//   const existingAssign = await Assign.findOne({ customer });

//   if (existingAssign) {
//     return next(new AppError("Customer already assigned to a vendor.", 400));
//   }

//   const assign = await Assign.create({ customer, vendor });

//   res.status(201).json({
//     status: true,
//     message: "Assignment created successfully",
//     data: assign,
//   });
// });

// exports.assignVendorToCustomer = catchAsync(async (req, res, next) => {
//   const { vendor: vendorId, customer: customerId } = req.body;

//   const customer = await Customer.findById(customerId).populate("budgetRange");
//   if (!customer) {
//     return res.status(404).json({ message: "Customer not found" });
//   }

//   const vendor = await User.findById(vendorId).populate({
//     path: "package",
//     populate: { path: "budgetRange" },
//   });
//   if (!vendor || vendor.role !== "Vendor" || vendor.verify !== "Verified") {
//     return next(new AppError("Invalid vendor", 400));
//   }

//   const alreadyAssigned = await Assign.findOne({
//     vendor: vendorId,
//     customer: customerId,
//   });
//   if (alreadyAssigned) {
//     return next(new AppError("Customer already assigned to this vendor", 400));
//   }

//   if (
//     vendor.package &&
//     vendor.package.budgetRange.some((range) =>
//       range.equals(customer.budgetRange._id)
//     ) &&
//     vendor.assignCustomerNumber < vendor.package.assignLeadValue
//   ) {
//     const assignment = new Assign({
//       customer: customerId,
//       vendor: vendorId,
//       assignedAt: new Date(),
//     });
//     await assignment.save();

//     vendor.assignCustomerNumber += 1;
//     vendor.lastAssignedAt = new Date();
//     await vendor.save();

//     customer.assignNumber += 1;
//     customer.assignDate = new Date();
//     await customer.save();

//     res.status(200).json({
//       status: true,
//       message: `Vendor ${vendor.userName} assigned to customer ${customer.name}`,
//     });
//   } else {
//     return next(
//       new AppError("Vendor cannot be assigned to this customer", 400)
//     );
//   }
// });

exports.assignVendorToCustomer = catchAsync(async (req, res, next) => {
  const { vendor: vendorId, customer: customerId } = req.body;

  const customer = await Customer.findById(customerId).populate("budgetRange");
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const vendor = await User.findById(vendorId).populate({
    path: "package",
    populate: { path: "budgetRange" },
  });
  if (!vendor || vendor.role !== "Vendor" || vendor.verify !== "Verified") {
    return next(new AppError("Invalid vendor", 400));
  }

  const alreadyAssigned = await Assign.findOne({
    vendor: vendorId,
    customer: customerId,
  });
  if (alreadyAssigned) {
    return next(new AppError("Customer already assigned to this vendor", 400));
  }

  if (
    vendor.package &&
    vendor.package.budgetRange.some((range) =>
      range.equals(customer.budgetRange._id)
    ) &&
    vendor.assignCustomerNumber < vendor.package.assignLeadValue
  ) {
    // Create a new assignment
    const assignment = new Assign({
      customer: customerId,
      vendor: vendorId,
      assignedAt: new Date(),
    });
    await assignment.save();

    const leadStatus = new LeadStatus({
      vendor: vendorId,
      customer: customerId,
      assign: assignment._id,
      status: "Pending", // Default status
    });
    await leadStatus.save();

    // Update vendor assignment count
    vendor.assignCustomerNumber += 1;
    vendor.lastAssignedAt = new Date();
    await vendor.save();

    // Update customer assign details
    customer.numberOfAssign += 1;
    customer.lastAssign = new Date();
    await customer.save();

    res.status(200).json({
      status: true,
      message: `Vendor ${vendor.userName} assigned to customer ${customer.name}`,
    });
  } else {
    return next(
      new AppError("Vendor cannot be assigned to this customer", 400)
    );
  }
});
