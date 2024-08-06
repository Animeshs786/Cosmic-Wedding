const Assign = require("../../models/assign");
const Customer = require("../../models/customer");
const User = require("../../models/user");

async function testVendro(req, res) {
  try {
    const unassignedCustomers = await Customer.find({
      _id: { $nin: await Assign.distinct("customer") },
    });

    const assignments = [];

    for (const customer of unassignedCustomers) {
      const vendors = await User.find({
        location: customer.location,
        role: "Vendor",
        packageExpiry: { $gt: new Date() },
      }).sort("lastAssignedAt");

      for (const vendor of vendors) {
        if (vendor.assignCustomerNumber < vendor.package.assignLeadValue) {
          assignments.push({
            customer: customer._id,
            vendor: vendor._id,
          });

          vendor.lastAssignedAt = new Date();
          vendor.assignCustomerNumber += 1;
          await vendor.save();

          console.log(
            `Assigned customer ${customer.name} to vendor ${vendor.userName}`
          );

          break;
        }
      }
    }

    if (assignments.length > 0) {
      await Assign.insertMany(assignments);
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
