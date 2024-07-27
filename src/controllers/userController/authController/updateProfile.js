const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const deleteOldFiles = require("../../../utils/deleteOldFiles");
const User = require("../../../models/user");

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { userName, email, mobile } = req.body;
  const superAdmin = await User.findById(req.params.id);

  if (!superAdmin) {
    return next(new AppError("No admin found with that ID", 404));
  }

  if (email && email !== superAdmin.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new AppError("Email already exists", 400));
    }
  }

  let profileImage = superAdmin.profileImage;

  if (req.files && req.files.profileImage) {
    profileImage = `${req.files.profileImage[0].destination}/${req.files.profileImage[0].filename}`;

    if (superAdmin.profileImage) {
      await deleteOldFiles([superAdmin.profileImage]).catch((err) => {
        console.error("Failed to delete old profile image", err);
      });
    }
  }

  const updatedData = {};
  if (userName) updatedData.userName = userName;
  if (email) updatedData.email = email;
  if (profileImage) updatedData.profileImage = profileImage;
  if (mobile) updatedData.mobile = mobile;

  const updatedSuperAdmin = await User.findByIdAndUpdate(
    req.params.id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: true,
    message: "Profile updated successfully",
    data: {
      admin: updatedSuperAdmin,
    },
  });
});
