// const Assign = require("../../../models/assign");
// const RejectedLead = require("../../../models/rejectedLead");
// const User = require("../../../models/user");
// const catchAsync = require("../../../utils/catchAsync");

// exports.getVendorDashboard = catchAsync(async (req, res) => {
//   const vendorId = req.user._id;
//   const startOfToday = new Date();
//   startOfToday.setHours(0, 0, 0, 0);

//   const totalAssignedCustomers = await Assign.countDocuments({
//     vendor: vendorId,
//   });

//   const todayAssignedCustomers = await Assign.countDocuments({
//     vendor: vendorId,
//     createdAt: { $gte: startOfToday },
//   });

//   const vendorStats = await User.findById(vendorId)
//     .populate("package", "assignLeadValue")
//     .select("package assignCustomerNumber");

//   const leadUnderProcess = await RejectedLead.countDocuments({
//     rejectedBy: vendorId,
//     status: "Pending",
//   });

//   res.status(200).json({
//     status: true,
//     message: "Vendor dashboard data retrieved successfully",
//     data: {
//       totalAssignedCustomers,
//       todayAssignedCustomers,
//       totalLeadValue: vendorStats.package.assignLeadValue,
//       usedLeadValue: vendorStats.assignCustomerNumber,
//       remainingLeadValue:
//         vendorStats.package.assignLeadValue - vendorStats.assignCustomerNumber,
//       leadUnderProcess,
//     },
//   });
// });

const Assign = require("../../../models/assign");
const RejectedLead = require("../../../models/rejectedLead");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getVendorDashboard = catchAsync(async (req, res) => {
  const vendorId = req.user._id;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totalAssignedCustomers = await Assign.countDocuments({
    vendor: vendorId,
  });

  const todayAssignedCustomers = await Assign.countDocuments({
    vendor: vendorId,
    createdAt: { $gte: startOfToday },
  });

  const vendorStats = await User.findById(vendorId)
    .populate("package", "assignLeadValue")
    .select("package assignCustomerNumber");

  const leadUnderProcess = await RejectedLead.countDocuments({
    rejectedBy: vendorId,
    status: "Pending",
  });

  const totalRejectedLeads = await RejectedLead.countDocuments({
    rejectedBy: vendorId,
  });

  const todayRejectedLeads = await RejectedLead.countDocuments({
    rejectedBy: vendorId,
    createdAt: { $gte: startOfToday },
  });

  res.status(200).json({
    status: true,
    message: "Vendor dashboard data retrieved successfully",
    data: {
      totalAssignedCustomers,
      todayAssignedCustomers,
      totalLeadValue: vendorStats.package.assignLeadValue,
      usedLeadValue: vendorStats.assignCustomerNumber,
      remainingLeadValue:
        vendorStats.package.assignLeadValue - vendorStats.assignCustomerNumber,
      leadUnderProcess,
      totalRejectedLeads,
      todayRejectedLeads,
    },
  });
});
