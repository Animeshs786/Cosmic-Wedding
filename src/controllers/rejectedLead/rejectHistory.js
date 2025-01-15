// const mongoose = require("mongoose");
// const catchAsync = require("../../utils/catchAsync");
// const RejectedLead = require("../../models/rejectedLead");

// exports.rejectHistory = catchAsync(async (req, res) => {
//   const {
//     vendorId,
//     search,
//     startDate,
//     endDate,
//     page = 1,
//     limit = 10,
//   } = req.query;

//   const pageNumber = parseInt(page, 10);
//   const limitNumber = parseInt(limit, 10);

//   const matchStage = {}; // Only rejected leads

//   // Filter by vendor ID
//   if (vendorId) {
//     matchStage.rejectedBy = new mongoose.Types.ObjectId(vendorId);
//   }

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
//         localField: "lead",
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
//         localField: "rejectedBy",
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
//       $sort: { createdAt: -1 }, // Sort by latest rejection
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
//         lead: 1,
//         reason: 1,
//         remark: 1,
//         status: 1,
//         createdAt: 1,
//         "customer.name": 1,
//         "vendor.userName": 1,
//       },
//     }
//   );

//   // Count total results for pagination
//   const countPipeline = [
//     ...pipeline.slice(0, pipeline.length - 3), // Exclude pagination stages
//     { $count: "totalResult" },
//   ];
//   const countResult = await RejectedLead.aggregate(countPipeline);
//   const totalResult = countResult[0]?.totalResult || 0;

//   const rejectedLeads = await RejectedLead.aggregate(pipeline);
//   const totalPage = Math.ceil(totalResult / limitNumber);

//   res.status(200).json({
//     status: true,
//     message: "Rejected leads retrieved successfully",
//     data: rejectedLeads,
//     totalResult,
//     totalPage,
//   });
// });



const mongoose = require("mongoose");
const catchAsync = require("../../utils/catchAsync");
const RejectedLead = require("../../models/rejectedLead");

exports.rejectHistory = catchAsync(async (req, res) => {
  const {
    vendorId,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const matchStage = {};

  // Filter by vendor ID
  if (vendorId) {
    matchStage.rejectedBy = new mongoose.Types.ObjectId(vendorId);
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
      matchStage.createdAt = { $gte: start, $lte: end };
    }
  }

  const pipeline = [
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "customers",
        localField: "lead",
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
        localField: "rejectedBy",
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
      $sort: { createdAt: -1 },
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
        lead: {
          _id: "$customer._id",
          name: "$customer.name",
          mobile: "$customer.mobile",
          location: "$customer.location",
          weedingLocation: "$customer.weedingLocation",
        },
        reason: 1,
        remark: 1,
        status: 1,
        createdAt: 1,
        rejectedBy: {
          _id: "$vendor._id",
          userName: "$vendor.userName",
          mobile: "$vendor.mobile",
        },
      },
    }
  );

  // Count total results for pagination
  const countPipeline = [
    ...pipeline.slice(0, pipeline.length - 3),
    { $count: "totalResult" },
  ];
  const countResult = await RejectedLead.aggregate(countPipeline);
  const totalResult = countResult[0]?.totalResult || 0;

  const rejectedLeads = await RejectedLead.aggregate(pipeline);
  const totalPage = Math.ceil(totalResult / limitNumber);

  res.status(200).json({
    status: true,
    message: "Rejected Lead retrieved successfully",
    totalResult,
    totalPage,
    data: { rejectLead: rejectedLeads },
  });
});
