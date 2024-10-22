const Setting = require("../../models/setting");
const catchAsync = require("../../utils/catchAsync");

exports.getSetting = catchAsync(async (req, res) => {
  const home = await Setting.findById("671209786e71f92bd39c21d6");

  res.status(200).json({
    success: true,
    message: "Setting data fetched successfully",
    data: { home },
  });
});
