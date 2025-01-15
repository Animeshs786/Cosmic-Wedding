// const Assign = require("../../models/assign");
// const catchAsync = require("../../utils/catchAsync");

// exports.getAllAssign = catchAsync(async (req, res) => {
//   const {
//     search,
//     startDate = new Date(),
//     endDate,
//     page = 1,
//     limit = 10,
//   } = req.query;

//   const pageNumber = parseInt(page, 10);
//   const limitNumber = parseInt(limit, 10);

//   const matchStage = {};

//   // Filter by start date and end date
//   if (startDate || endDate) {
//     if (startDate && !endDate) {
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(startDate);
//       end.setHours(23, 59, 59, 999);
//       matchStage.createdAt = { $gte: start, $lte: end };
//     } else if (startDate && endDate) {
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//       matchStage.createdAt = {
//         $gte: new Date(start),
//         $lte: new Date(end),
//       };
//     }
//   }

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
//         from: "users",
//         localField: "vendor",
//         foreignField: "_id",
//         as: "vendor",
//       },
//     },
//     {
//       $unwind: "$vendor",
//     },
//   ];

//   // Search by vendor or customer name
//   if (search) {
//     const searchRegex = { $regex: search, $options: "i" };
//     pipeline.push({
//       $match: {
//         $or: [
//           { "customer.name": searchRegex }, // Customer name
//           { "vendor.userName": searchRegex }, // Vendor name
//         ],
//       },
//     });
//   }

//   pipeline.push(
//     {
//       $sort: { createdAt: -1 }, // Sort by latest assignment
//     },
//     {
//       $skip: (pageNumber - 1) * limitNumber,
//     },
//     {
//       $limit: limitNumber,
//     },
//     {
//       $project: {
//         _id: 1,
//         createdAt: 1,
//         "customer.name": 1,
//         "customer._id": 1,
//         "vendor.userName": 1,
//         "vendor._id": 1,
//       },
//     }
//   );

//   // Count total results for pagination
//   const countPipeline = [
//     ...pipeline.slice(0, pipeline.length - 3), // Exclude pagination stages
//     { $count: "totalResult" },
//   ];
//   const countResult = await Assign.aggregate(countPipeline);
//   const totalResult = countResult[0]?.totalResult || 0;

//   const assignedLeads = await Assign.aggregate(pipeline);
//   const totalPage = Math.ceil(totalResult / limitNumber);

//   res.status(200).json({
//     status: true,
//     message: "Assigned leads retrieved successfully",
//     data: assignedLeads,
//     totalResult,
//     totalPage,
//   });
// });

const Assign = require("../../models/assign");
const catchAsync = require("../../utils/catchAsync");
const mongoose = require("mongoose");

exports.getAllAssign = catchAsync(async (req, res) => {
  const {
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    vendorId,
    customerId,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const matchStage = {};

  if (vendorId) {
    matchStage.vendor = new mongoose.Types.ObjectId(vendorId);
  }

  if (customerId) {
    matchStage.customer = new mongoose.Types.ObjectId(customerId);
  }

  // Filter by start date and end date
  if (startDate || endDate) {
    if (startDate && !endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(startDate);
      end.setHours(23, 59, 59, 999);
      matchStage.createdAt = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchStage.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }
  }

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
        from: "users",
        localField: "vendor",
        foreignField: "_id",
        as: "vendor",
      },
    },
    {
      $unwind: "$vendor",
    },
  ];

  // Search by vendor or customer name
  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    pipeline.push({
      $match: {
        $or: [
          { "customer.name": searchRegex }, // Customer name
          { "vendor.userName": searchRegex }, // Vendor name
        ],
      },
    });
  }

  pipeline.push(
    {
      $sort: { createdAt: -1 }, // Sort by latest assignment
    },
    {
      $skip: (pageNumber - 1) * limitNumber,
    },
    {
      $limit: limitNumber,
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        "customer.name": 1,
        "customer._id": 1,
        "vendor.userName": 1,
        "vendor._id": 1,
      },
    }
  );

  // Count total results for pagination
  const countPipeline = [
    ...pipeline.slice(0, pipeline.length - 3), // Exclude pagination stages
    { $count: "totalResult" },
  ];
  const countResult = await Assign.aggregate(countPipeline);
  const totalResult = countResult[0]?.totalResult || 0;

  const assignedLeads = await Assign.aggregate(pipeline);
  const totalPage = Math.ceil(totalResult / limitNumber);

  res.status(200).json({
    status: true,
    message: "Assigned leads retrieved successfully",
    data: assignedLeads,
    totalResult,
    totalPage,
  });
});