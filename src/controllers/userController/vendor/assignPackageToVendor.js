const Package = require("../../../models/package");
const User = require("../../../models/user");


// Function to assign package to vendor
async function assignPackageToVendor(req, res) {
  try {
    const { vendorId, packageId } = req.body;

    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.package = selectedPackage._id;
    vendor.packageExpiry = new Date(
      Date.now() + selectedPackage.validity * 30 * 24 * 60 * 60 * 1000
    );
    vendor.assignCustomerNumber = 0;
    await vendor.save();

    res
      .status(200)
      .json({ message: "Package assigned to vendor successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error assigning package to vendor",
        error: error.message,
      });
  }
}
module.exports = assignPackageToVendor;
