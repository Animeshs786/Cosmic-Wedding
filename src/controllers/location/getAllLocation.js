const Location = require("../../models/location");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

exports.getAllLocation = catchAsync(async (req, res) => {
  const { limit: currentLimit, page, search } = req.query;
  const obj = {};

  if (search) {
    obj.location = { $regex: search, $options: "i" };
  }

  const {
    limit,
    skip,
    totalResult,
    toatalPage: totalPage,
  } = await pagination(page, currentLimit, Location, null, obj);

  const locationData = await Location.find(obj).skip(skip).limit(limit);

  res.status(200).json({
    status: true,
    totalResult,
    totalPage,
    data: {
      location: locationData,
    },
  });
});
