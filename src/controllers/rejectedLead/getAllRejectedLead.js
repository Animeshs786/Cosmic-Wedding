const RejectedLead = require("../../models/rejectedLead");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

exports.getAllRejectedLead = catchAsync(async (req, res) => {
  const { page, limit: currentLimit, startDate, endDate } = req.query;

  const obj = {};

  if (startDate && endDate) {
    obj.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  if (req.user.role === "Vendor") {
    obj.rejectedBy = req.user._id;
  }

  console.log(req.user);

  const {
    limit,
    skip,
    totalResult,
    toatalPage: totalPage,
  } = await pagination(page, currentLimit, RejectedLead, null, obj);

  const lead = await RejectedLead.find(obj)
    .populate({
      path: "lead",
      select: "name mobile location weedingLocation",
      // populate: [
      //   { path: "location", select: "location" },
      //   { path: "weedingLocation", select: "location" },
      // ],
    })
    .populate("rejectedBy", "userName mobile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  console.log(lead);

  res.status(200).json({
    status: true,
    message: "Rejected Lead retrieved successfully",
    totalResult,
    totalPage,
    data: { rejectLead: lead },
  });
});
