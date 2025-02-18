const Assign = require("../../models/assign");
const Customer = require("../../models/customer");
const User = require("../../models/user");

// async function testVendro(req, res) {
//   try {
//     const unassignedCustomers = await Customer.find({
//       _id: { $nin: await Assign.distinct("customer") },
//       verify: true,
//     }).populate("budgetRange"); // Populate customer's budget range

//     const assignments = [];

//     for (const customer of unassignedCustomers) {
//       const vendors = await User.find({
//         location: { $in: [customer.weedingLocation] },
//         role: "Vendor",
//         verify: "Verified", // Verification condition
//         //packageExpiry: { $gt: new Date() }, // Package expiry check
//       })
//         .populate({
//           path: "package",
//           populate: { path: "budgetRange" }, // Populate vendor's package and its budget range
//         })
//         .sort("lastAssignedAt"); // Sort vendors by last assigned time

//       for (const vendor of vendors) {
//         // Check if vendor's package budget range matches the customer's budget range
//         if (
//           vendor.assignCustomerNumber < vendor.package.assignLeadValue && // Check vendor's lead capacity
//           vendor.package.budgetRange.equals(customer.budgetRange._id) // Check budget range match
//         ) {
//           assignments.push({
//             customer: customer._id,
//             vendor: vendor._id,
//           });

//           vendor.lastAssignedAt = new Date(); // Update last assigned time
//           vendor.assignCustomerNumber += 1; // Increment assigned customer number
//           await vendor.save(); // Save vendor data

//           console.log(
//             `Assigned customer ${customer.name} to vendor ${vendor.userName}`
//           );

//           break; // Break loop once a vendor is assigned
//         }
//       }
//     }

//     if (assignments.length > 0) {
//       await Assign.insertMany(assignments); // Insert assignments in bulk
//       res.status(200).json({
//         message: `Assigned ${assignments.length} customers to vendors.`,
//       });
//     } else {
//       res.status(200).json({
//         message:
//           "No unassigned customers found or all vendors have reached their lead limit.",
//       });
//     }
//   } catch (error) {
//     console.error("Error assigning customers to vendors:", error);
//     res.status(500).json({
//       message: "Error assigning customers to vendors.",
//       error: error.message,
//     });
//   }
// }

// module.exports = testVendro;

const LeadStatus = require("../../models/leadStatus");
const mongoose = require("mongoose");

async function testVendro(req, res) {
  try {
    const unassignedCustomers = await Customer.find({
      _id: { $nin: await Assign.distinct("customer") },
      verify: true,
      services: { $exists: true, $ne: [] },
    }).populate("budgetRange services");

    const assignments = [];
    const leadStatuses = []; // Array to store lead statuses

    for (const customer of unassignedCustomers) {
      const vendors = await User.find({
        location: { $in: [customer.weedingLocation] },
        role: "Vendor",
        verify: "Verified", // Verification condition
        service: { $eq: customer.services[0] },
      })
        .populate({
          path: "package",
          populate: { path: "budgetRange" }, // Populate vendor's package and its budget range
        })
        .sort("lastAssignedAt"); // Sort vendors by last assigned time

      for (const vendor of vendors) {
        // Check if vendor has a package before proceeding
        if (
          vendor.package && // Ensure the package exists
          vendor.assignCustomerNumber < vendor.package.assignLeadValue && // Check vendor's lead capacity
          vendor.package.budgetRange && // Ensure the vendor's budget range exists
          vendor.package.budgetRange.some((range) =>
            range.equals(customer.budgetRange._id)
          ) // Check if any budget range matches
        ) {
          // Generate a manual _id for the assignment
          const assignmentId = new mongoose.Types.ObjectId();

          // Prepare an assignment
          assignments.push({
            _id: assignmentId, // Use the manually generated _id
            customer: customer._id,
            vendor: vendor._id,
          });

          // Prepare the corresponding lead status
          leadStatuses.push({
            assign: assignmentId, // Use the same _id as the assignment
            vendor: vendor._id,
            customer: customer._id,
            status: "Pending", // Default status
          });

          vendor.lastAssignedAt = new Date(); // Update last assigned time
          vendor.assignCustomerNumber += 1; // Increment assigned customer number
          await vendor.save(); // Save vendor data

          customer.numberOfAssign += 1;
          customer.lastAssign = new Date();
          await customer.save();

          console.log(
            `Assigned customer ${customer.name} to vendor ${vendor.userName}`
          );

          break; // Break loop once a vendor is assigned
        }
      }
    }

    if (assignments.length > 0) {
      // Insert assignments in bulk
      await Assign.insertMany(assignments);

      // Insert lead statuses in bulk
      await LeadStatus.insertMany(leadStatuses);

      res.status(200).json({
        message: `Assigned ${assignments.length} customers to vendors and created ${leadStatuses.length} lead statuses.`,
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
