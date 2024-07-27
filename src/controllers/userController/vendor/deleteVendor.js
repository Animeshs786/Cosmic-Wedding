const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteVendor = catchAsync(async (req, res, next) => {
  const vendor = await User.findByIdAndDelete(req.params.id);

  if (!vendor) {
    return next(new AppError("No vendor found with that ID", 404));
  }

  if (vendor.profileImage) {
    await deleteOldFiles(vendor.profileImage).catch((err) => {
      console.error("Failed to delete profile image:", err);
    });
  }

  res.status(200).json({
    status: true,
    message: "Vendor deleted successfully",
  });
});
