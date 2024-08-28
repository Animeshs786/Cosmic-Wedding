const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllVendors = catchAsync(async (req, res) => {
  const {
    page,
    limit: currentLimit,
    search,
    service,
    package: packageData,
    budgetRange,
    location,
  } = req.query;

  const obj = {
    role: "Vendor",
  };

  if (search) {
    obj.$or = [
      { userName: { $regex: search, $options: "i" } },
      // Search for the query in any of the locations
      // { location: { $in: [new RegExp(search, "i")] } },
    ];
  }
  
  if (location) {
    obj.location = location;
  }

  if (service) {
    obj.service = service;
  }
  if (packageData) {
    obj.package = packageData;
  }
  if (budgetRange) {
    obj.budgetRange = budgetRange;
  }

  const { limit, skip, totalResult, toatalPage } = await pagination(
    page,
    currentLimit,
    User,
    "Vendor",
    obj
  );

  const vendors = await User.find(obj)
    .populate("location", "location")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: true,
    results: vendors.length,
    totalResult,
    totalPage: toatalPage,
    data: {
      vendors,
    },
  });
});

// const User = require("../../../models/user");
// const catchAsync = require("../../../utils/catchAsync");
// const pagination = require("../../../utils/pagination");

// exports.getAllVendors = catchAsync(async (req, res) => {
//   const {
//     page,
//     limit: currentLimit,
//     search,
//     service,
//     package: packageData,
//     budgetRange,
//   } = req.query;

//   const matchObj = {
//     role: "Vendor",
//   };

//   if (service) {
//     matchObj.service = service;
//   }
//   if (packageData) {
//     matchObj.package = packageData;
//   }
//   if (budgetRange) {
//     matchObj.budgetRange = budgetRange;
//   }

//   const pipeline = [
//     { $match: matchObj },
//     {
//       $lookup: {
//         from: "locations", // Assuming 'locations' is the name of the collection
//         localField: "location",
//         foreignField: "_id",
//         as: "location",
//       },
//     },
//     {
//       $unwind: "$location",
//     },
//   ];

//   if (search) {
//     pipeline.push({
//       $match: {
//         $or: [
//           { userName: { $regex: search, $options: "i" } },
//           { "location.location": { $regex: search, $options: "i" } },
//         ],
//       },
//     });
//   }

//   const { limit, skip, totalResult, toatalPage } = await pagination(
//     page,
//     currentLimit,
//     User,
//     "Vendor",
//     matchObj
//   );

//   pipeline.push(
//     { $sort: { createdAt: -1 } },
//     { $skip: skip },
//     { $limit: limit }
//   );

//   const vendors = await User.aggregate(pipeline);

//   res.status(200).json({
//     status: true,
//     results: vendors.length,
//     totalResult,
//     totalPage: toatalPage,
//     data: {
//       vendors,
//     },
//   });
// });
