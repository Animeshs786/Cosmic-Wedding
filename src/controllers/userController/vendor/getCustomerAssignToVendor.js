// const mongoose = require("mongoose");
// const Assign = require("../../../models/assign");
// const catchAsync = require("../../../utils/catchAsync");

// exports.getCustomersAssignedToVendor = catchAsync(async (req, res) => {
//   const vendorId = req.user._id;
//   const {
//     search,
//     serviceId,
//     startDate,
//     endDate,
//     location,
//     status,
//     page = 1,
//     limit = 10,
//   } = req.query;

//   const pageNumber = parseInt(page, 10);
//   const limitNumber = parseInt(limit, 10);

//   const matchStage = { vendor: vendorId };

//   const pipeline = [
//     {
//       $match: matchStage,
//     },
//     {
//       $lookup: {
//         from: "customers",
//         localField: "customer",
//         foreignField: "_id",
//         as: "customer",
//       },
//     },
//     {
//       $unwind: "$customer",
//     },
//     {
//       $lookup: {
//         from: "locations",
//         localField: "customer.location",
//         foreignField: "_id",
//         as: "location",
//       },
//     },
//     {
//       $unwind: "$location",
//     },
//     {
//       $lookup: {
//         from: "locations",
//         localField: "customer.weedingLocation",
//         foreignField: "_id",
//         as: "weedingLocation",
//       },
//     },
//     {
//       $unwind: "$weedingLocation",
//     },
//     {
//       $lookup: {
//         from: "budgetranges",
//         localField: "customer.budgetRange",
//         foreignField: "_id",
//         as: "budgetRange",
//       },
//     },
//     {
//       $unwind: "$budgetRange",
//     },
//     {
//       $addFields: {
//         "customer.locationName": "$location.location",
//         "customer.weedingLocationName": "$weedingLocation.location",
//         "customer.budgetRangeName": "$budgetRange.name",
//       },
//     },
//   ];

//   // Search Filters
//   if (search || serviceId || startDate || endDate || status || location) {
//     const customerMatch = {};

//     if (search) {
//       customerMatch["customer.name"] = { $regex: search, $options: "i" };
//     }
//     if (serviceId) {
//       customerMatch["customer.services"] = new mongoose.Types.ObjectId(
//         serviceId
//       );
//     }
//     if (startDate && endDate) {
//       customerMatch["customer.eventDate"] = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     } else if (startDate) {
//       customerMatch["customer.eventDate"] = { $gte: new Date(startDate) };
//     } else if (endDate) {
//       customerMatch["customer.eventDate"] = { $lte: new Date(endDate) };
//     }
//     if (status) {
//       customerMatch["customer.status"] = status;
//     }
//     // Compare location with both location and weedingLocation
//     if (location) {
//       customerMatch["$or"] = [
//         { "customer.location": new mongoose.Types.ObjectId(location) },
//         { "customer.weedingLocation": new mongoose.Types.ObjectId(location) },
//       ];
//     }

//     pipeline.push({
//       $match: customerMatch,
//     });
//   }

//   const countPipeline = [...pipeline, { $count: "totalResult" }];
//   const countResult = await Assign.aggregate(countPipeline);
//   const totalResult = countResult[0]?.totalResult || 0;

//   pipeline.push(
//     {
//       $skip: (pageNumber - 1) * limitNumber,
//     },
//     {
//       $limit: limitNumber,
//     }
//   );

//   pipeline.push({
//     $project: {
//       _id: 0,
//       customer: 1,
//     },
//   });

//   const assignments = await Assign.aggregate(pipeline);
//   const customers = assignments.map((assignment) => assignment.customer);

//   const totalPage = Math.ceil(totalResult / limitNumber);

//   res.status(200).json({
//     status: true,
//     message: "Assigned customers retrieved successfully",
//     data: customers,
//     totalResult,
//     totalPage,
//   });
// });


const mongoose = require("mongoose");
const Assign = require("../../../models/assign");
const catchAsync = require("../../../utils/catchAsync");

exports.getCustomersAssignedToVendor = catchAsync(async (req, res) => {
  const vendorId = req.user._id;
  const {
    search,
    serviceId,
    startDate,
    endDate,
    location,
    status,
    page = 1,
    limit = 10,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const matchStage = { vendor: vendorId };

  const pipeline = [
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: "$customer",
    },
    {
      $lookup: {
        from: "locations",
        localField: "customer.location",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $unwind: "$location",
    },
    {
      $lookup: {
        from: "locations",
        localField: "customer.weedingLocation",
        foreignField: "_id",
        as: "weedingLocation",
      },
    },
    {
      $unwind: "$weedingLocation",
    },
    {
      $lookup: {
        from: "budgetranges",
        localField: "customer.budgetRange",
        foreignField: "_id",
        as: "budgetRange",
      },
    },
    {
      $unwind: "$budgetRange",
    },
    {
      $addFields: {
        "customer.locationName": "$location.location",
        "customer.weedingLocationName": "$weedingLocation.location",
        "customer.budgetRangeName": "$budgetRange.name",
      },
    },
  ];

  // Search Filters
  if (search || serviceId || startDate || endDate || status || location) {
    const customerMatch = {};

    if (search) {
      customerMatch["customer.name"] = { $regex: search, $options: "i" };
    }
    if (serviceId) {
      customerMatch["customer.services"] = new mongoose.Types.ObjectId(serviceId);
    }
    if (startDate && endDate) {
      customerMatch["customer.eventDate"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      customerMatch["customer.eventDate"] = { $gte: new Date(startDate) };
    } else if (endDate) {
      customerMatch["customer.eventDate"] = { $lte: new Date(endDate) };
    }
    if (status) {
      customerMatch["customer.status"] = status;
    }
    // Compare location with both location and weedingLocation
    if (location) {
      customerMatch["$or"] = [
        { "customer.location": new mongoose.Types.ObjectId(location) },
        { "customer.weedingLocation": new mongoose.Types.ObjectId(location) },
      ];
    }

    pipeline.push({
      $match: customerMatch,
    });
  }

  // Sort by createdAt in descending order
  pipeline.push({
    $sort: { createdAt: -1 },
  });

  const countPipeline = [...pipeline, { $count: "totalResult" }];
  const countResult = await Assign.aggregate(countPipeline);
  const totalResult = countResult[0]?.totalResult || 0;

  pipeline.push(
    {
      $skip: (pageNumber - 1) * limitNumber,
    },
    {
      $limit: limitNumber,
    }
  );

  pipeline.push({
    $project: {
      _id: 0,
      customer: 1,
    },
  });

  const assignments = await Assign.aggregate(pipeline);
  const customers = assignments.map((assignment) => assignment.customer);

  const totalPage = Math.ceil(totalResult / limitNumber);

  res.status(200).json({
    status: true,
    message: "Assigned customers retrieved successfully",
    data: customers,
    totalResult,
    totalPage,
  });
});
