// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");
// const deleteOldFiles = require("../../../utils/deleteOldFiles");
// const User = require("../../../models/user");

// exports.updateVendor = catchAsync(async (req, res, next) => {
//   const { userName, email, mobile, password,location, service,verify } = req.body;
//   const superAdmin = await User.findById(req.params.id);

//   if (!superAdmin) {
//     return next(new AppError("No vendor found with that ID", 404));
//   }

//   if (email && email !== superAdmin.email) {
//     const emailExists = await User.findOne({ email });
//     if (emailExists) {
//       return next(new AppError("Email already exists", 400));
//     }
//   }

//   let profileImage = superAdmin.profileImage;

//   if (req.files && req.files.profileImage) {
//     profileImage = `${req.files.profileImage[0].destination}/${req.files.profileImage[0].filename}`;

//     if (superAdmin.profileImage) {
//       await deleteOldFiles([superAdmin.profileImage]).catch((err) => {
//         console.error("Failed to delete old profile image", err);
//       });
//     }
//   }

//   if (userName) superAdmin.userName = userName;
//   if (email) superAdmin.email = email;
//   if (profileImage) superAdmin.profileImage = profileImage;
//   if (mobile) superAdmin.mobile = mobile;
//   if (location) superAdmin.location = location;
//   if (service) superAdmin.service = service;
//   if (verify) superAdmin.verify = verify;
//       if (password) {
//     superAdmin.password = password;
//     superAdmin.confirmPassword = password;
//   }

//   await superAdmin.save();

//   res.status(200).json({
//     status: true,
//     message: "Vendor Profile updated successfully",
//     data: {
//       vendor: superAdmin,
//     },
//   });
// });

const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const deleteOldFiles = require("../../../utils/deleteOldFiles");
const User = require("../../../models/user");
const Package = require("../../../models/package");

exports.updateVendor = catchAsync(async (req, res, next) => {
  const { userName, email, mobile, password, location, service, verify, packageId } = req.body;
  const vendor = await User.findById(req.params.id);

  if (!vendor) {
    return next(new AppError("No vendor found with that ID", 404));
  }

  // Check if email is being updated and ensure it doesn't already exist
  if (email && email !== vendor.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new AppError("Email already exists", 400));
    }
  }

  // Handle profile image update
  let profileImage = vendor.profileImage;
  if (req.files && req.files.profileImage) {
    profileImage = `${req.files.profileImage[0].destination}/${req.files.profileImage[0].filename}`;
    if (vendor.profileImage) {
      await deleteOldFiles([vendor.profileImage]).catch((err) => {
        console.error("Failed to delete old profile image", err);
      });
    }
  }

  // Assign new values to the vendor if provided
  if (userName) vendor.userName = userName;
  if (email) vendor.email = email;
  if (profileImage) vendor.profileImage = profileImage;
  if (mobile) vendor.mobile = mobile;
  if (location) vendor.location = location;
  if (service) vendor.service = service;
  if (verify) vendor.verify = verify;
  if (password) {
    vendor.password = password;
    vendor.confirmPassword = password;
  }

  // Assign package to vendor if packageId is provided
  if (packageId) {
    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) {
      return next(new AppError("Package not found", 404));
    }

    vendor.package = selectedPackage._id;
    vendor.packageExpiry = new Date(
      Date.now() + selectedPackage.validity * 30 * 24 * 60 * 60 * 1000
    );
    vendor.assignCustomerNumber = 0; // Reset assigned customer number
  }

  // Save the updated vendor
  await vendor.save();

  res.status(200).json({
    status: true,
    message: "Vendor Profile updated successfully",
    data: {
      vendor,
    },
  });
});

