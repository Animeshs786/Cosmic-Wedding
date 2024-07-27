const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const deleteOldFiles = require("../../../utils/deleteOldFiles");
const User = require("../../../models/user");

exports.updateAdmin = catchAsync(async (req, res, next) => {
  const { userName, email, mobile, password } = req.body;
  const admin = await User.findById(req.params.id);

  if (!admin) {
    return next(new AppError("No admin found with that ID", 404));
  }

  if (email && email !== admin.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new AppError("Email already exists", 400));
    }
  }

  let profileImage = admin.profileImage;

  if (req.files && req.files.profileImage) {
    profileImage = `${req.files.profileImage[0].destination}/${req.files.profileImage[0].filename}`;

    if (admin.profileImage) {
      await deleteOldFiles([admin.profileImage]).catch((err) => {
        console.error("Failed to delete old profile image", err);
      });
    }
  }

  if (userName) admin.userName = userName;
  if (email) admin.email = email;
  if (profileImage) admin.profileImage = profileImage;
  if (mobile) admin.mobile = mobile;
  if (password) {
    admin.password = password;
    admin.confirmPassword = password;
  }

  await admin.save();

  res.status(200).json({
    status: true,
    message: "Vendor Profile updated successfully",
    data: {
      admin: admin,
    },
  });
});
