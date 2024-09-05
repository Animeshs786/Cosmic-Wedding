const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const createToken = require("../../../utils/createToken");

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Email and password are required.", 404));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(user.comparePassword(password)))
    return next(new AppError("Invalid email or password.", 404));

  // Check if the user is a vendor and their status is "Unverified"
  if (user.role === "Vendor" && user.verify === "Unverified") {
    return next(new AppError("You don't have permission to log in.", 401));
  }

  user.password = undefined;
  createToken(user, 200, res);
});
