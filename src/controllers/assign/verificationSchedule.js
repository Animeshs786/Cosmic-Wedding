const User = require("../../models/user");

const verificationSchedule = async () => {
  try {
    console.log("Running scheduled task at 8 AM");

    const vendors = await User.find({ verify: "Verified" }).populate("package");

    for (let vendor of vendors) {
      if (+vendor.assignCustomerNumber >= +vendor.package.assignLeadValue) {
        vendor.verify = "Unverified";
        await vendor.save();
        console.log(`Vendor ${vendor.userName} is now Unverified`);
      }
    }
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
};

module.exports = verificationSchedule;
