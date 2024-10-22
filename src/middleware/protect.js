const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/user");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Step1. check token exit or not
  if (
    req.headers.authorization &&
    req.headers.authorization?.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not login. Please login to access.", 404)
    );
  }

  //Step2. verify the token
  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

  //Step3. check user not removed
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User not existed.", 404));
  }

  if (user.role === "Vendor" && user.verify === "Unverified") {
    return next(new AppError("Yor Package has been expired.", 401));
  }

  //Step4. check password update
  if (await user.validatePasswordUpdate(decoded.iat)) {
    return next(new AppError("Password updated login again.", 404));
  }
  req.user = user;
  next();
});

exports.authorizedRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to access.", 400));
    }
    next();
  };
};
