const Location = require("../../models/location");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.updateLocation = catchAsync(async (req, res, next) => {
  const { location } = req.body;
  const { id } = req.params;

  if (!location) {
    return next(new AppError("Please provide a location", 400));
  }
  const locationData = await Location.findById(id);

  if (!locationData) {
    return next(new AppError("Location not exists", 400));
  }
  const locationExists = await Location.findOne({ location });

  if (locationExists) {
    return next(new AppError("Location already exists", 400));
  }

  locationData.location = location;
  await locationData.save();

  res.status(200).json({
    status: true,
    message: "Location update successfully",
    data: {
      location: locationData,
    },
  });
});
