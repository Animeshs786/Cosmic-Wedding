// const RejectedLead = require("../../models/rejectedLead");
// const User = require("../../models/user");
// const AppError = require("../../utils/AppError");
// const catchAsync = require("../../utils/catchAsync");

// exports.verifyRejectLead = catchAsync(async (req, res, next) => {
//   const { status, remark } = req.body;

//   const rejectLead = await RejectedLead.findById(req.params.id);

//   if (!rejectLead) {
//     return next(new AppError("Lead not found.", 404));
//   }

//   if (!remark) {
//     return next(new AppError("Please provide remark.", 404));
//   }

//   if (status && status === "Success") {
//     const vendorData = await User.findById(rejectLead.rejectedBy);
//     vendorData.assignCustomerNumber -= 1;
//     await vendorData.save();
//   }

//   rejectLead.status = status;
//   rejectLead.remark = remark;
//   await rejectLead.save();

//   res.status(200).json({
//     status: true,
//     message: "Status Update Successfully.",
//   });
// });

const RejectedLead = require("../../models/rejectedLead");
const User = require("../../models/user");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.verifyRejectLead = catchAsync(async (req, res, next) => {
  const { status, remark } = req.body;

  // Find the rejected lead by ID
  const rejectLead = await RejectedLead.findById(req.params.id);

  if (!rejectLead) {
    return next(new AppError("Lead not found.", 404));
  }

  if (!remark) {
    return next(new AppError("Please provide a remark.", 400));
  }

  // Only adjust the count if the status is being changed
  if (status && status !== rejectLead.status) {
    const vendorData = await User.findById(rejectLead.rejectedBy);

    if (!vendorData) {
      return next(new AppError("Vendor data not found.", 404));
    }

    console.log(status, "status", rejectLead.status, "rjec statu");

    // Handle transitions to and from "Success"
    if (status === "Success" && rejectLead.status !== "Success") {
      console.log("ing");
      vendorData.assignCustomerNumber -= 1; // Decrement on transition to "Success"
    } else if (rejectLead.status === "Success" && status !== "Success") {
      console.log("ing2");
      vendorData.assignCustomerNumber += 1; // Increment on transition away from "Success"
    }

    await vendorData.save();
  }

  // Update the rejected lead with new status and remark
  rejectLead.status = status || rejectLead.status; // Ensure it doesn't overwrite to undefined
  rejectLead.remark = remark;
  await rejectLead.save();

  res.status(200).json({
    status: true,
    message: "Status updated successfully.",
  });
});
