const AppError = require("../utils/AppError");

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to access.", 400));
    }
    next();
  };
};

module.exports = authorizeRole;
