const RejectedLead = require("../../models/rejectedLead");
const User = require("../../models/user");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.verifyRejectLead = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const rejectLead = await RejectedLead.findById(req.params.id);

  if (!rejectLead) {
    return next(new AppError("Lead not found.", 404));
  }

  if (status && status === "Success") {
    const vendorData = await User.findById(rejectLead.rejectedBy);
    vendorData.assignCustomerNumber -= 1;
    await vendorData.save();
  }

  rejectLead.status = status;
  await rejectLead.save();

  res.status(200).json({
    status: true,
    message: "Status Update Successfully.",
  });
});
