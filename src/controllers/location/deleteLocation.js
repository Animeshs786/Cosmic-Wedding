const Location = require("../../models/location");
const catchAsync = require("../../utils/catchAsync");

exports.deleteLocation = catchAsync(async (req, res) => {
  const { id } = req.params;

  await Location.findByIdAndDelete(id);

  res.status(200).json({
    status: true,
    message: "Location deleted successfully",
  });
});
