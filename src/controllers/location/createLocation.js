const Location = require("../../models/location");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.createLocation = catchAsync(async (req, res, next) => {
  const { location } = req.body;

  if (!location) {
    return next(new AppError("Please provide a location", 400));
  }
  const locationData = await Location.findOne({ location });

  if (locationData) {
    return next(new AppError("Location already exists", 400));
  }

  const newLocation = await Location.create({
    location,
  });

  res.status(201).json({
    status: true,
    message: "Location created successfully",
    data: {
      location: newLocation,
    },
  });
});
