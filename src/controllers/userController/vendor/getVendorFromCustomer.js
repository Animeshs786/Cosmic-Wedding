const Customer = require("../../../models/customer");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getVendorFromCustomer = catchAsync(async (req, res) => {
  const { customerId } = req.body;

  // Find the customer and populate budget range
  const customer = await Customer.findById(customerId).populate("budgetRange");

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const vendors = await User.find({
    location: { $in: [customer.weedingLocation] },
    role: "Vendor",
    verify: "Verified",
  })
    .populate({
      path: "package",
      populate: { path: "budgetRange" },
    })
    .sort("lastAssignedAt");

  const filteredVendors = vendors.filter((vendor) => {
    return (
      vendor.package &&
      vendor.package.budgetRange &&
      vendor.package.budgetRange.some((range) =>
        range.equals(customer.budgetRange._id)
      )
    );
  });

  const vendorData = filteredVendors.map((vendor) => ({
    id: vendor._id,
    userName: vendor.userName,
  }));

  res.status(200).json({
    status: true,
    data: vendorData,
  });
});
