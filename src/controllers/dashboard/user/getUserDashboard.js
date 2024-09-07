const User = require("../../../models/user");
const Customer = require("../../../models/customer");
const catchAsync = require("../../../utils/catchAsync");
const RejectedLead = require("../../../models/rejectedLead");

exports.getUserDashboard = catchAsync(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totalVendors = await User.countDocuments({ role: "Vendor" });

  const totalCustomers = await Customer.countDocuments();

  const todayCustomers = await Customer.countDocuments({
    createdAt: { $gte: startOfToday },
  });

  const totalRejectedLeads = await RejectedLead.countDocuments();

  const todayRejectedLeads = await RejectedLead.countDocuments({
    createdAt: { $gte: startOfToday },
  });

  res.status(200).json({
    status: true,
    message: "Admin dashboard data retrieved successfully",
    data: {
      totalVendors,
      totalCustomers,
      todayCustomers,
      totalRejectedLeads,
      todayRejectedLeads,
    },
  });
});
