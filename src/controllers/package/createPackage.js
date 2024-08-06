const Package = require("../../models/package");
const catchAsync = require("../../utils/catchAsync");

exports.createPackage = catchAsync(async (req, res) => {
  const { name, validity, price, assignLeadValue } = req.body;
  const packageData = await Package.create({
    name,
    validity,
    price,
    assignLeadValue,
  });
  res.status(201).json({
    status: true,
    message: "package category created successfully",
    data: packageData,
  });
});
