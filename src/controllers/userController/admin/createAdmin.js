const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const createToken = require("../../../utils/createToken");
const deleteOldFiles = require("../../../utils/deleteOldFiles");


exports.createAdmin = catchAsync(async (req, res, next) => {
  const { userName, password, email, confirmPassword } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already exists", 400));
  }

  const obj = {
    userName,
    password,
    email,
    confirmPassword,
    role: "Admin",
  };

  let profileImagePath;
  try {
    if (
      req.files &&
      req.files.profileImage &&
      req.files.profileImage.length > 0
    ) {
      const profileImageFile = req.files.profileImage[0];
      const url = `${profileImageFile.destination}/${profileImageFile.filename}`;
      obj.profileImage = url;
      profileImagePath = url;
    }

    const newUser = await User.create(obj);
    newUser.password = undefined;
    createToken(newUser, 201, res); 
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
