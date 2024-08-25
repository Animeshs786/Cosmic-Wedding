const Assign = require("../../models/assign");
const Customer = require("../../models/customer");
const User = require("../../models/user");

async function testVendro(req, res) {
  try {
    const unassignedCustomers = await Customer.find({
      _id: { $nin: await Assign.distinct("customer") },
    }).populate("budgetRange"); // Populate customer's budget range

    const assignments = [];

    for (const customer of unassignedCustomers) {
      const vendors = await User.find({
        location: { $in: [customer.weedingLocation] },
        role: "Vendor",
        verify: "Verified", // Verification condition
        //packageExpiry: { $gt: new Date() }, // Package expiry check
      })
        .populate({
          path: "package",
          populate: { path: "budgetRange" }, // Populate vendor's package and its budget range
        })
        .sort("lastAssignedAt"); // Sort vendors by last assigned time

      for (const vendor of vendors) {
        // Check if vendor's package budget range matches the customer's budget range
        if (
          vendor.assignCustomerNumber < vendor.package.assignLeadValue && // Check vendor's lead capacity
          vendor.package.budgetRange.equals(customer.budgetRange._id) // Check budget range match
        ) {
          assignments.push({
            customer: customer._id,
            vendor: vendor._id,
          });

          vendor.lastAssignedAt = new Date(); // Update last assigned time
          vendor.assignCustomerNumber += 1; // Increment assigned customer number
          await vendor.save(); // Save vendor data

          console.log(
            `Assigned customer ${customer.name} to vendor ${vendor.userName}`
          );

          break; // Break loop once a vendor is assigned
        }
      }
    }

    if (assignments.length > 0) {
      await Assign.insertMany(assignments); // Insert assignments in bulk
      res.status(200).json({
        message: `Assigned ${assignments.length} customers to vendors.`,
      });
    } else {
      res.status(200).json({
        message:
          "No unassigned customers found or all vendors have reached their lead limit.",
      });
    }
  } catch (error) {
    console.error("Error assigning customers to vendors:", error);
    res.status(500).json({
      message: "Error assigning customers to vendors.",
      error: error.message,
    });
  }
}

module.exports = testVendro;
