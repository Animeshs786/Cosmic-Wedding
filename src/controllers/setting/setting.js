const Setting = require("../../models/setting");
const catchAsync = require("../../utils/catchAsync");

exports.setting = catchAsync(async (req, res) => {
  const { duration, numberOfAssign, id="671209786e71f92bd39c21d6" } = req.body;

  const updateData = {};

  if (duration) updateData.duration = duration;
  if (numberOfAssign) updateData.numberOfAssign = numberOfAssign;

  let home;
  if (!id) {
    home = await Setting.create({
      duration: updateData.duration,
      numberOfAssign: updateData.numberOfAssign,
    });
  }

  if (id) {
    home = await Setting.findByIdAndUpdate(id, updateData, { new: true });
  }

  res.status(200).json({
    success: true,
    message: "Setting data updated successfully",
    data: { home },
  });
});
