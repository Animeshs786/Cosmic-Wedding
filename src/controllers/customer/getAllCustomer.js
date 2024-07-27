const Customer = require("../../models/customer");
const Assign = require("../../models/assign"); // Import the Assign model
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

exports.getAllCustomers = catchAsync(async (req, res) => {
  const { page, limit: currentLimit, search, eventDate } = req.query;
  const obj = {};
  if (search) {
    obj.name = { $regex: search, $options: "i" };
  }
  if (eventDate) {
    obj.eventDate = eventDate;
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    page,
    currentLimit,
    Customer
  );

  const customers = await Customer.find(obj)
    .populate("budgetRange")
    .populate("services")
    .skip(skip)
    .limit(limit);

  // Fetch assigned vendors for each customer
  const customerIds = customers.map((customer) => customer._id);
  const assignments = await Assign.find({ customer: { $in: customerIds } }).populate("vendor");

  // Map assignments to customers
  const customersWithVendors = customers.map((customer) => {
    const assignment = assignments.find((assign) => String(assign.customer) === String(customer._id));
    return {
      ...customer._doc,
      vendor: assignment ? assignment.vendor : null,
    };
  });

  res.status(200).json({
    status: true,
    message: "Customers retrieved successfully",
    totalResult,
    totalPage,
    data: { customers: customersWithVendors },
  });
});
