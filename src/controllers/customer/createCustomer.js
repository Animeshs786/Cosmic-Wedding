const Customer = require("../../models/customer");
const catchAsync = require("../../utils/catchAsync");

exports.createCustomer = catchAsync(async (req, res) => {
  const {
    name,
    mobile,
    location,
    weedingLocation,
    eventDate,
    email,
    budgetRange,
    guest,
    services = ["66b70f0e79e583121137805d"],
  } = req.body;

  const customer = await Customer.create({
    name,
    mobile,
    location,
    eventDate,
    email,
    budgetRange,
    guest,
    services,
    weedingLocation,
  });

  res.status(201).json({
    status: true,
    message: "Customer created successfully",
    data: customer,
  });
});
