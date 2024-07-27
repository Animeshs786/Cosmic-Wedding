const Assign = require("../../../models/assign");
const catchAsync = require("../../../utils/catchAsync");

exports.getVendorDashboard = catchAsync(async (req, res) => {
  const vendorId = req.user._id;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totalAssignedCustomers = await Assign.countDocuments({ vendor: vendorId });

  const todayAssignedCustomers = await Assign.countDocuments({
    vendor: vendorId,
    createdAt: { $gte: startOfToday },
  });

  res.status(200).json({
    status: true,
    message: "Vendor dashboard data retrieved successfully",
    data: {
      totalAssignedCustomers,
      todayAssignedCustomers,
    },
  });
});
