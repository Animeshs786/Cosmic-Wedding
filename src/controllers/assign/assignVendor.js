const Assign = require("../../models/assign");
const Customer = require("../../models/customer");
const User = require("../../models/user");

async function assignVendor() {
  try {
    const unassignedCustomers = await Customer.find({
      _id: { $nin: await Assign.distinct("customer") },
    });

    const assignments = [];

    for (const customer of unassignedCustomers) {
      const vendors = await User.find({
        location: customer.location,
        role: "Vendor",
        verify: true,
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
      console.log(`Assigned ${assignments.length} customers to vendors.`);
    } else {
      console.log(
        "No unassigned customers found or all vendors have reached their lead limit."
      );
    }
  } catch (error) {
    console.error("Error assigning customers to vendors:", error);
  }
}

module.exports = assignVendor;
