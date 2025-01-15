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

//   // Sort by createdAt in descending order
//   pipeline.push({
//     $sort: { createdAt: -1 },
//   });

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

//   // Apply startDate and endDate filters on createdAt in the Assign schema
//   if (startDate || endDate) {
//     if (startDate && !endDate) {
//       // Only startDate provided: fetch records for that specific day
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0); // Start of the day
//       const end = new Date(startDate);
//       end.setHours(23, 59, 59, 999); // End of the day
//       matchStage.createdAt = { $gte: start, $lte: end };
//     } else if (startDate && endDate) {
//       // Both startDate and endDate provided: fetch records between these dates
//       matchStage.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
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
//   if (search || serviceId || status || location) {
//     const customerMatch = {};

//     if (search) {
//       customerMatch["customer.name"] = { $regex: search, $options: "i" };
//     }
//     if (serviceId) {
//       customerMatch["customer.services"] = new mongoose.Types.ObjectId(serviceId);
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

//   // Sort by createdAt in descending order
//   pipeline.push({
//     $sort: { createdAt: -1 },
//   });

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

//   // Apply startDate and endDate filters on createdAt in the Assign schema
//   if (startDate || endDate) {
//     if (startDate && !endDate) {
//       // Only startDate provided: fetch records for that specific day
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0); // Start of the day
//       const end = new Date(startDate);
//       end.setHours(23, 59, 59, 999); // End of the day
//       matchStage.createdAt = { $gte: start, $lte: end };
//     } else if (startDate && endDate) {
//       // Both startDate and endDate provided: fetch records between these dates
//       matchStage.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
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
//   if (search || serviceId || status || location) {
//     const customerMatch = {};

//     if (search) {
//       customerMatch["customer.name"] = { $regex: search, $options: "i" };
//     }
//     if (serviceId) {
//       customerMatch["customer.services"] = new mongoose.Types.ObjectId(serviceId);
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

//   // Sort by createdAt in descending order
//   pipeline.push({
//     $sort: { createdAt: -1 },
//   });

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

// const mongoose = require("mongoose");
// const Assign = require("../../../models/assign");
// const LeadStatus = require("../../../models/leadStatus");
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

//   // Apply startDate and endDate filters on createdAt in the Assign schema
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
//         from: "leadstatuses",
//         localField: "_id",
//         foreignField: "assign",
//         as: "leadStatus",
//       },
//     },
//     {
//       $unwind: "$leadStatus",
//     },
//     {
//       $match: {
//         "leadStatus.vendor": new mongoose.Types.ObjectId(vendorId),
//         "leadStatus.status": { $ne: "Reject" }, // Exclude "Reject" statuses
//       },
//     },
//     {
//       $lookup: {
//         from: "customers",
//         localField: "leadStatus.customer",
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
//         "customer.status": "$leadStatus.status", // Vendor-specific status
//       },
//     },
//   ];

//   // Search Filters
//   if (search || serviceId || status || location) {
//     const customerMatch = {};

//     if (search) {
//       customerMatch["customer.name"] = { $regex: search, $options: "i" };
//     }
//     if (serviceId) {
//       customerMatch["customer.services"] = new mongoose.Types.ObjectId(
//         serviceId
//       );
//     }
//     if (status) {
//       customerMatch["customer.status"] = status;
//     }
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

//   pipeline.push(
//     {
//       $sort: { createdAt: -1 },
//     },
//     {
//       $skip: (pageNumber - 1) * limitNumber,
//     },
//     {
//       $limit: limitNumber,
//     },
//     {
//       $project: {
//         _id: 0,
//         customer: 1,
//       },
//     }
//   );

//   const countPipeline = [...pipeline, { $count: "totalResult" }];
//   const countResult = await Assign.aggregate(countPipeline);
//   const totalResult = countResult[0]?.totalResult || 0;


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
const LeadStatus = require("../../../models/leadStatus");
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

  // Apply startDate and endDate filters on createdAt in the Assign schema
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
        from: "leadstatuses",
        localField: "_id",
        foreignField: "assign",
        as: "leadStatus",
      },
    },
    {
      $unwind: "$leadStatus",
    },
    {
      $match: {
        "leadStatus.vendor": new mongoose.Types.ObjectId(vendorId),
        "leadStatus.status": { $ne: "Reject" }, // Exclude "Reject" statuses
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "leadStatus.customer",
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
        "customer.status": "$leadStatus.status", // Vendor-specific status
      },
    },
  ];

  // Search Filters
  if (search || serviceId || status || location) {
    const customerMatch = {};

    if (search) {
      customerMatch["customer.name"] = { $regex: search, $options: "i" };
    }
    if (serviceId) {
      customerMatch["customer.services"] = new mongoose.Types.ObjectId(
        serviceId
      );
    }
    if (status) {
      customerMatch["customer.status"] = status;
    }
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

  // Clone the pipeline to create a countPipeline
  const countPipeline = [...pipeline];

  // Remove $skip and $limit stages from countPipeline for counting purposes
  const countPipelineFiltered = countPipeline.filter(
    (stage) => !("$skip" in stage || "$limit" in stage)
  );

  // Add $count to calculate total results
  countPipelineFiltered.push({ $count: "totalResult" });

  // Execute countPipeline to calculate totalResult
  const countResult = await Assign.aggregate(countPipelineFiltered);
  const totalResult = countResult[0]?.totalResult || 0;

  // Calculate totalPage
  const totalPage = Math.ceil(totalResult / limitNumber);

  // Add pagination stages to the main pipeline
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
        _id: 0,
        customer: 1,
      },
    }
  );

  // Execute the main pipeline
  const assignments = await Assign.aggregate(pipeline);
  const customers = assignments.map((assignment) => assignment.customer);

  res.status(200).json({
    status: true,
    message: "Assigned customers retrieved successfully",
    data: customers,
    totalResult,
    totalPage,
  });
});
