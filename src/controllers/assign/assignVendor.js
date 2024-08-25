// const Assign = require("../../models/assign");
// const Customer = require("../../models/customer");
// const User = require("../../models/user");

// async function assignVendor() {
//   try {
//     const unassignedCustomers = await Customer.find({
//       _id: { $nin: await Assign.distinct("customer") },
//     });

//     const assignments = [];

//     for (const customer of unassignedCustomers) {
//       const vendors = await User.find({
//         location: customer.location,
//         role: "Vendor",
//         verify: true,
//         packageExpiry: { $gt: new Date() },
//       }).sort("lastAssignedAt");

//       for (const vendor of vendors) {
//         if (vendor.assignCustomerNumber < vendor.package.assignLeadValue) {
//           assignments.push({
//             customer: customer._id,
//             vendor: vendor._id,
//           });

//           vendor.lastAssignedAt = new Date();
//           vendor.assignCustomerNumber += 1;
//           await vendor.save();

//           console.log(
//             `Assigned customer ${customer.name} to vendor ${vendor.userName}`
//           );

//           break;
//         }
//       }
//     }

//     if (assignments.length > 0) {
//       await Assign.insertMany(assignments);
//       console.log(`Assigned ${assignments.length} customers to vendors.`);
//     } else {
//       console.log(
//         "No unassigned customers found or all vendors have reached their lead limit."
//       );
//     }
//   } catch (error) {
//     console.error("Error assigning customers to vendors:", error);
//   }
// }

// module.exports = assignVendor;

const Assign = require("../../models/assign");
const Customer = require("../../models/customer");
const User = require("../../models/user");

async function assignVendor() {
  try {
    // Find unassigned customers and populate their budget range
    const unassignedCustomers = await Customer.find({
      _id: { $nin: await Assign.distinct("customer") },
    }).populate("budgetRange");

    const assignments = [];

    for (const customer of unassignedCustomers) {
      const vendors = await User.find({
        location: { $in: [customer.weedingLocation] }, 
        role: "Vendor",
        verify: "Verified",
        // packageExpiry: { $gt: new Date() }, // Uncomment if you want to check for package expiry
      })
        .populate({
          path: "package",
          populate: { path: "budgetRange" },
        })
        .sort("lastAssignedAt");

      for (const vendor of vendors) {
        // Check if vendor's package budget range matches the customer's budget range
        if (
          vendor.assignCustomerNumber < vendor.package.assignLeadValue && // Check vendor's lead capacity
          vendor.package.budgetRange.equals(customer.budgetRange._id) // Ensure budget range match
        ) {
          // Assign the customer to the vendor
          assignments.push({
            customer: customer._id,
            vendor: vendor._id,
          });

          // Update vendor's last assigned time and increment their assigned customer number
          vendor.lastAssignedAt = new Date();
          vendor.assignCustomerNumber += 1;
          await vendor.save(); // Save vendor data

          console.log(
            `Assigned customer ${customer.name} to vendor ${vendor.userName}`
          );

          break; // Break loop once a vendor is assigned
        }
      }
    }

    if (assignments.length > 0) {
      // Insert all assignments in bulk
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
