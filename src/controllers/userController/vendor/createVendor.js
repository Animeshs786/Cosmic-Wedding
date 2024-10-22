const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const createToken = require("../../../utils/createToken");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.createVendor = catchAsync(async (req, res, next) => {
  const { userName, email, mobile, location, service, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });
  if (existingUser) {
    if (existingUser.email === email) {
      return next(new AppError("Email already exists", 400));
    }
    if (existingUser.mobile === mobile) {
      return next(new AppError("Mobile number already exists", 400));
    }
  }

  const obj = {
    userName,
    email,
    mobile,
    role: "Vendor",
    location: location ? JSON.parse(location) : [],
    service,
    password,
  };

  let profileImagePath;

  try {
    // Handle profile image if uploaded
    if (req.files && req.files.profileImage) {
      const url = `${req.files.profileImage[0].destination}/${req.files.profileImage[0].filename}`;
      obj.profileImage = url;
      profileImagePath = url;
    }

    const newUser = await User.create(obj);
    newUser.password = undefined; 
    createToken(newUser, 201, res); // Send response with token
  } catch (error) {
    // If there was an error and profileImage was uploaded, delete the file
    if (profileImagePath) {
      await deleteOldFiles(profileImagePath).catch((err) => {
        console.error("Failed to delete profile image:", err);
      });
    }
    return next(error); // Pass the error to the global error handler
  }
});
