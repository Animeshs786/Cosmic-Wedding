const Location = require("../../models/location");
const catchAsync = require("../../utils/catchAsync");

exports.getLocation = catchAsync(async (req, res) => {
  const { id } = req.params;

  const location = await Location.findById(id);

  res.status(200).json({
    status: true,
    data: {
      location,
    },
  });
});
