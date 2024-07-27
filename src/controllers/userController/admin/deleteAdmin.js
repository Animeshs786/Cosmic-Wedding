const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await User.findByIdAndDelete(req.params.id);

  if (!admin) {
    return next(new AppError("No admin found with that ID", 404));
  }

  if (admin.profileImage) {
    await deleteOldFiles(admin.profileImage).catch((err) => {
      console.error("Failed to delete profile image:", err);
    });
  }

  res.status(200).json({
    status: true,
    message: "admin deleted successfully",
  });
});
