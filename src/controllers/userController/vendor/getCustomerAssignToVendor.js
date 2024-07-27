const { default: mongoose } = require("mongoose");
const Assign = require("../../../models/assign");
const catchAsync = require("../../../utils/catchAsync");

exports.getCustomersAssignedToVendor = catchAsync(async (req, res) => {
  const vendorId = req.user._id;
  const { name, serviceId, eventDate, status, page = 1, limit = 10 } = req.query;

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
  ];

  // Conditionally add a $match stage if there are query parameters
  if (name || serviceId || eventDate || status) {
    const customerMatch = {};

    if (name) {
      customerMatch["customer.name"] = { $regex: name, $options: "i" };
    }
    if (serviceId) {
      customerMatch["customer.services"] = new mongoose.Types.ObjectId(serviceId);
    }
    if (eventDate) {
      customerMatch["customer.eventDate"] = new Date(eventDate);
    }
    if (status) {
      customerMatch["customer.status"] = status;
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
