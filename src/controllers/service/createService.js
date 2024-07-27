const Service = require("../../models/service");
const catchAsync = require("../../utils/catchAsync");

exports.createServiceCategory = catchAsync(async (req, res) => {
  const { name} = req.body;
  const service = await Service.create({ name});
  res.status(201).json({
    status: true,
    message: "Service category created successfully",
    data: service,
  });
});
