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
//     location,
//   } = req.query;
//   const obj = {};

//   if (search) {
//     obj.name = { $regex: search, $options: "i" };
//   }
//   if (location) {
//     obj.location = location;
//   }
//   if (startDate && endDate) {
//     obj.eventDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
//   }

//   const {
//     limit,
//     skip,
//     totalResult,
//     toatalPage: totalPage,
//   } = await pagination(page, currentLimit, Customer, null, obj);

//   const customers = await Customer.find(obj)
//     .populate("budgetRange")
//     .populate("services")
//     .skip(skip)
//     .limit(limit);

//   // Fetch assigned vendors for each customer
//   const customerIds = customers.map((customer) => customer._id);
//   const assignments = await Assign.find({
//     customer: { $in: customerIds },
//   }).populate("vendor", "userName");

//   // Map assignments to customers
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
  } = req.query;

  const obj = {};

  if (search) {
    obj.$or = [
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  if (startDate && endDate) {
    obj.eventDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  if (budgetRange) {
    obj.budgetRange = budgetRange;
  }

  const {
    limit,
    skip,
    totalResult,
    toatalPage: totalPage,
  } = await pagination(page, currentLimit, Customer, null, obj);

  const customers = await Customer.find(obj)
    .populate("budgetRange")
    .populate("services")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  const customerIds = customers.map((customer) => customer._id);
  const assignments = await Assign.find({
    customer: { $in: customerIds },
  }).populate("vendor", "userName");

  const customersWithVendors = customers.map((customer) => {
    const assignment = assignments.find(
      (assign) => String(assign.customer) === String(customer._id)
    );
    return {
      ...customer._doc,
      vendor: assignment ? assignment.vendor : null,
      isAssigned: !!assignment,
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
