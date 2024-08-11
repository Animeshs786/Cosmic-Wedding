// // const { default: mongoose } = require("mongoose");
// // const Assign = require("../../../models/assign");
// // const catchAsync = require("../../../utils/catchAsync");

// // exports.getCustomersAssignedToVendor = catchAsync(async (req, res) => {
// //   const vendorId = req.user._id;
// //   const { name, serviceId, eventDate,location, status, page = 1, limit = 10 } = req.query;

// //   // Convert page and limit to numbers
// //   const pageNumber = parseInt(page, 10);
// //   const limitNumber = parseInt(limit, 10);

// //   // Construct the match stage for the aggregation pipeline
// //   const matchStage = { vendor: vendorId };

// //   // Create the aggregation pipeline
// //   const pipeline = [
// //     {
// //       $match: matchStage,
// //     },
// //     {
// //       $lookup: {
// //         from: "customers", // Name of the Customer collection
// //         localField: "customer",
// //         foreignField: "_id",
// //         as: "customer",
// //       },
// //     },
// //     {
// //       $unwind: "$customer",
// //     },
// //   ];

// //   // Conditionally add a $match stage if there are query parameters
// //   if (name || serviceId || eventDate || status || location) {
// //     const customerMatch = {};

// //     if (name) {
// //       customerMatch["customer.name"] = { $regex: name, $options: "i" };
// //     }
// //     if (serviceId) {
// //       customerMatch["customer.services"] = new mongoose.Types.ObjectId(serviceId);
// //     }
// //     if (eventDate) {
// //       customerMatch["customer.eventDate"] = new Date(eventDate);
// //     }
// //     if (status) {
// //       customerMatch["customer.status"] = status;
// //     }
// //     if (location) {
// //       customerMatch["customer.location"] = location;
// //     }

// //     pipeline.push({
// //       $match: customerMatch,
// //     });
// //   }

// //   // Count total results
// //   const countPipeline = [...pipeline, { $count: "totalResult" }];
// //   const countResult = await Assign.aggregate(countPipeline);
// //   const totalResult = countResult[0]?.totalResult || 0;

// //   // Apply pagination
// //   pipeline.push(
// //     {
// //       $skip: (pageNumber - 1) * limitNumber,
// //     },
// //     {
// //       $limit: limitNumber,
// //     }
// //   );

// //   pipeline.push({
// //     $project: {
// //       _id: 0,
// //       customer: 1,
// //     },
// //   });

// //   const assignments = await Assign.aggregate(pipeline);
// //   const customers = assignments.map((assignment) => assignment.customer);

// //   const totalPage = Math.ceil(totalResult / limitNumber);

// //   res.status(200).json({
// //     status: true,
// //     message: "Assigned customers retrieved successfully",
// //     data: customers,
// //     totalResult,
// //     totalPage,
// //   });
// // });

// const mongoose = require("mongoose");
// const Assign = require("../../../models/assign");
// const catchAsync = require("../../../utils/catchAsync");

// exports.getCustomersAssignedToVendor = catchAsync(async (req, res) => {
//   const vendorId = req.user._id;
//   const { name, serviceId, startDate, endDate, location, status, page = 1, limit = 10 } = req.query;

//   // Convert page and limit to numbers
//   const pageNumber = parseInt(page, 10);
//   const limitNumber = parseInt(limit, 10);

//   // Construct the match stage for the aggregation pipeline
//   const matchStage = { vendor: vendorId };

//   // Create the aggregation pipeline
//   const pipeline = [
//     {
//       $match: matchStage,
//     },
//     {
//       $lookup: {
//         from: "customers", // Name of the Customer collection
//         localField: "customer",
//         foreignField: "_id",
//         as: "customer",
//       },
//     },
//     {
//       $unwind: "$customer",
//     },
//   ];

//   // Conditionally add a $match stage if there are query parameters
//   if (name || serviceId || startDate || endDate || status || location) {
//     const customerMatch = {};

//     if (name) {
//       customerMatch["customer.name"] = { $regex: name, $options: "i" };
//     }
//     if (serviceId) {
//       customerMatch["customer.services"] = new mongoose.Types.ObjectId(serviceId);
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
//     if (location) {
//       customerMatch["customer.location"] = location;
//     }

//     pipeline.push({
//       $match: customerMatch,
//     });
//   }

//   // Count total results
//   const countPipeline = [...pipeline, { $count: "totalResult" }];
//   const countResult = await Assign.aggregate(countPipeline);
//   const totalResult = countResult[0]?.totalResult || 0;

//   // Apply pagination
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
  const { name, serviceId, startDate, endDate, location, status, page = 1, limit = 10 } = req.query;

  // Convert page and limit to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Construct the match stage for the aggregation pipeline
  const matchStage = { vendor: vendorId };

  // Create the aggregation pipeline
  const pipeline = [
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "customers", // Name of the Customer collection
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
        from: "budgetranges", // Name of the BudgetRange collection
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
        "customer.budgetRangeName": "$budgetRange.name",
      },
    },
  ];

  // Conditionally add a $match stage if there are query parameters
  if (name || serviceId || startDate || endDate || status || location) {
    const customerMatch = {};

    if (name) {
      customerMatch["customer.name"] = { $regex: name, $options: "i" };
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
    if (location) {
      customerMatch["customer.location"] = location;
    }

    pipeline.push({
      $match: customerMatch,
    });
  }

  // Count total results
  const countPipeline = [...pipeline, { $count: "totalResult" }];
  const countResult = await Assign.aggregate(countPipeline);
  const totalResult = countResult[0]?.totalResult || 0;

  // Apply pagination
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
