// const Customer = require("../../models/customer");
// const Assign = require("../../models/assign");
// const catchAsync = require("../../utils/catchAsync");
// const pagination = require("../../utils/pagination");

// exports.getAllCustomers = catchAsync(async (req, res) => {
//   const {
//     page,
//     limit: currentLimit,
//     search,
//     startDate,
//     endDate,
//     budgetRange,
//     location,
//     weedingLocation,
//     eventType = "create",
//     status,
//     verify,
//   } = req.query;

//   const obj = {};

//   if (search) {
//     obj.$or = [{ name: { $regex: search, $options: "i" } }];
//   }

//   if (location) {
//     obj.location = location;
//   }

//   if (verify) {
//     obj.verify = verify;
//   }

//   if (status) {
//     obj.status = status;
//   }

//   if (weedingLocation) {
//     obj.weedingLocation = weedingLocation;
//   }

//   const setStartOfDay = (date) => {
//     const start = new Date(date);
//     start.setHours(0, 0, 0, 0);
//     return start;
//   };

//   const setEndOfDay = (date) => {
//     const end = new Date(date);
//     end.setHours(23, 59, 59, 999);
//     return end;
//   };

//   if (startDate && !endDate) {
//     obj.createdAt = {
//       $gte: setStartOfDay(startDate),
//       $lte: setEndOfDay(startDate),
//     };
//   } else if (startDate && endDate) {
//     obj.createdAt = {
//       $gte: setStartOfDay(startDate),
//       $lte: setEndOfDay(endDate),
//     };
//   } else if (endDate) {
//     obj.createdAt = {
//       $lte: setEndOfDay(endDate),
//     };
//   }

//   if (budgetRange) {
//     obj.budgetRange = budgetRange;
//   }

// const {
//   limit,
//   skip,
//   totalResult,
//   toatalPage: totalPage,
// } = await pagination(page, currentLimit, Customer, null, obj);

//   const customers = await Customer.find(obj)
//     .populate("budgetRange")
//     .populate("services")
//     .populate("location", "location")
//     .populate("weedingLocation", "location")
//     .sort("-createdAt")
//     .skip(skip)
//     .limit(limit);

//   const customerIds = customers.map((customer) => customer._id);
//   const assignments = await Assign.find({
//     customer: { $in: customerIds },
//   }).populate("vendor", "userName");

//   const customersWithVendors = customers.map((customer) => {
//     const assignment = assignments.find(
//       (assign) => String(assign.customer) === String(customer._id)
//     );
//     return {
//       ...customer._doc,
//       vendor: assignment ? assignment.vendor : null,
//       isAssigned: !!assignment,
//     };
//   });

//   res.status(200).json({
//     status: true,
//     message: "Customers retrieved successfully",
//     totalResult,
//     totalPage,
//     data: { customers: customersWithVendors },
//   });
// });

const Customer = require("../../models/customer");
const Assign = require("../../models/assign");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

exports.getAllCustomers = catchAsync(async (req, res) => {
  const {
    page,
    limit: currentLimit,
    search,
    startDate,
    endDate,
    budgetRange,
    location,
    weedingLocation,
    status,
    verify,
  } = req.query;

  const obj = {};

  // Search filter
  if (search) {
    obj.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  // Additional filters
  if (location) {
    obj.location = location;
  }

  if (verify) {
    obj.verify = verify;
  }

  if (status) {
    obj.status = status;
  }

  if (weedingLocation) {
    obj.weedingLocation = weedingLocation;
  }

  // Date range filter
  const setStartOfDay = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const setEndOfDay = (date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  if (startDate && !endDate) {
    obj.createdAt = {
      $gte: setStartOfDay(startDate),
      $lte: setEndOfDay(startDate),
    };
  } else if (startDate && endDate) {
    obj.createdAt = {
      $gte: setStartOfDay(startDate),
      $lte: setEndOfDay(endDate),
    };
  } else if (endDate) {
    obj.createdAt = {
      $lte: setEndOfDay(endDate),
    };
  }

  // Budget Range filter
  if (budgetRange) {
    obj.budgetRange = budgetRange;
  }

  // Pagination logic
  const {
    limit,
    skip,
    totalResult,
    toatalPage: totalPage,
  } = await pagination(page, currentLimit, Customer, null, obj);

  console.log(skip, limit, "slfjslfj");

  const customers = await Customer.find(obj)
    .populate("budgetRange")
    .populate("services")
    .populate("location", "location")
    .populate("weedingLocation", "location")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  const customerIds = customers.map((customer) => customer._id);

  const assignments = await Assign.find({
    customer: { $in: customerIds },
  }).populate("vendor", "userName");

  const customersWithVendors = customers.map((customer) => {
    const customerAssignments = assignments.filter(
      (assign) => String(assign.customer) === String(customer._id)
    );

    return {
      ...customer._doc,
      vendors: customerAssignments.map((assign) => {
        return {
          userName: assign.vendor.userName,
          _id: assign.vendor._id,
          assignAt: assign.createdAt,
        };
      }),
      isAssigned: customerAssignments.length > 0,
    };
  });

  res.status(200).json({
    status: true,
    message: "Customers retrieved successfully",
    totalResult,
    totalPage,
    data: { customers: customersWithVendors },
  });
});
