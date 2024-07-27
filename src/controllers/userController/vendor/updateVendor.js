const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const deleteOldFiles = require("../../../utils/deleteOldFiles");
const User = require("../../../models/user");

exports.updateVendor = catchAsync(async (req, res, next) => {
  const { userName, email, mobile, password,location, service,package:packageData,budgetRange } = req.body;
  const superAdmin = await User.findById(req.params.id);

  if (!superAdmin) {
    return next(new AppError("No vendor found with that ID", 404));
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

  if (userName) superAdmin.userName = userName;
  if (email) superAdmin.email = email;
  if (profileImage) superAdmin.profileImage = profileImage;
  if (mobile) superAdmin.mobile = mobile;
  if (location) superAdmin.location = location;
  if (service) superAdmin.service = service;
  if (packageData) superAdmin.package = packageData;
  if (budgetRange) superAdmin.budgetRange = budgetRange;
  if (password) {
    superAdmin.password = password;
    superAdmin.confirmPassword = password;
  }

  await superAdmin.save();

  res.status(200).json({
    status: true,
    message: "Vendor Profile updated successfully",
    data: {
      vendor: superAdmin,
    },
  });
});
