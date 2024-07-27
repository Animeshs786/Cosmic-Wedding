const Customer = require("../../models/customer");
const catchAsync = require("../../utils/catchAsync");

exports.createCustomer = catchAsync(async (req, res) => {
  const { name, mobile, location, eventDate, email, budgetRange, guest, services } =
    req.body;

  const customer = await Customer.create({
    name,
    mobile,
    location,
    eventDate,
    email,
    budgetRange,
    guest,
    services,
  });

  res.status(201).json({
    status: true,
    message: "Customer created successfully",
    data: customer,
  });
});
