// const Assign = require("../../models/assign");
// const Customer = require("../../models/customer");
// const Setting = require("../../models/setting");
// const User = require("../../models/user");

// async function leadShuffleing() {
//   try {
//     const today = new Date();
//     // today.setHours(0, 0, 0, 0);

//     const setting = await Setting.findById("671209786e71f92bd39c21d6");

//     const validDate = setting.validDate || 6;

//     const sixDaysAgo = new Date(today);
//     sixDaysAgo.setDate(today.getDate() - validDate);

//     if (setting.numberOfAssign === 0) return;

//     const assignedCustomers = await Customer.find({
//       verify: true,
//       numberOfAssign: { $lt: setting.numberOfAssign || 4, $gt: 0 },
//       $or: [{ eventDate: { $gt: today } }, { eventDate: null }],
//       // guest: 23,
//       createdAt: { $gte: sixDaysAgo },
//     }).populate("budgetRange");

//     const assignments = [];

//     for (const customer of assignedCustomers) {
//       const vendors = await User.find({
//         location: { $in: [customer.weedingLocation] },
//         role: "Vendor",
//         verify: "Verified",
//       })
//         .populate({
//           path: "package",
//           populate: { path: "budgetRange" },
//         })
//         .sort("lastAssignedAt");

//       let assignedCount = customer.numberOfAssign;

//       for (const vendor of vendors) {
//         const alreadyAssigned = await Assign.findOne({
//           customer: customer._id,
//           vendor: vendor._id,
//         });

//         customer.lastAssign.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         if (
//           !alreadyAssigned &&
//           vendor.assignCustomerNumber < vendor.package.assignLeadValue &&
//           vendor.package &&
//           vendor.package.budgetRange.some((range) =>
//             range.equals(customer.budgetRange._id)
//           ) &&
//           (!customer.lastAssign ||
//             today - customer.lastAssign >=
//               setting.duration * 24 * 60 * 60 * 1000) &&
//           (!customer.eventDate || customer.eventDate > today)
//         ) {
//           assignments.push({
//             customer: customer._id,
//             vendor: vendor._id,
//           });

//           vendor.lastAssignedAt = new Date();
//           vendor.assignCustomerNumber += 1;
//           await vendor.save();

//           customer.numberOfAssign += 1;
//           customer.lastAssign = new Date();
//           await customer.save();

//           console.log(
//             `Assigned customer ${customer.name} to vendor ${vendor.userName}`
//           );

//           assignedCount++;

//           if (assignedCount >= 4) {
//             break;
//           }
//         }
//       }
//     }

//     if (assignments.length > 0) {
//       await Assign.insertMany(assignments);
//       console.log(`Assigned ${assignments.length} customers to vendors.`);
//     } else {
//       console.log(
//         "No eligible customers found or all vendors have reached their lead limit."
//       );
//     }
//   } catch (error) {
//     console.error("Error assigning customers to vendors:", error);
//   }
// }

// module.exports = leadShuffleing;

// const Assign = require("../../models/assign");
// const Customer = require("../../models/customer");
// const Setting = require("../../models/setting");
// const User = require("../../models/user");

// async function leadShuffleing() {
//   try {
//     const today = new Date();
//     const setting = await Setting.findById("671209786e71f92bd39c21d6");

//     const validDate = setting.validDate || 6;

//     const sixDaysAgo = new Date(today);
//     sixDaysAgo.setDate(today.getDate() - validDate);

//     if (setting.numberOfAssign === 0) return;

//     const assignedCustomers = await Customer.find({
//       verify: true,
//       numberOfAssign: { $lt: setting.numberOfAssign || 4, $gt: 0 },
//       $or: [{ eventDate: { $gt: today } }, { eventDate: null }],
//       createdAt: { $gte: sixDaysAgo },
//     }).populate("budgetRange services"); // Include 'services' field

//     const assignments = [];

//     for (const customer of assignedCustomers) {
//       const vendors = await User.find({
//         location: { $in: [customer.weedingLocation] },
//         role: "Vendor",
//         verify: "Verified",
//         service: customer.services[0], // Match vendor's service with customer services
//       })
//         .populate({
//           path: "package",
//           populate: { path: "budgetRange" },
//         })
//         .sort("lastAssignedAt");

//       let assignedCount = customer.numberOfAssign;

//       for (const vendor of vendors) {
//         const alreadyAssigned = await Assign.findOne({
//           customer: customer._id,
//           vendor: vendor._id,
//         });

//         customer.lastAssign.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         if (
//           !alreadyAssigned &&
//           vendor.assignCustomerNumber < vendor.package.assignLeadValue &&
//           vendor.package &&
//           vendor.package.budgetRange.some((range) =>
//             range.equals(customer.budgetRange._id)
//           ) &&
//           (!customer.lastAssign ||
//             today - customer.lastAssign >=
//               setting.duration * 24 * 60 * 60 * 1000) &&
//           (!customer.eventDate || customer.eventDate > today)
//         ) {
//           assignments.push({
//             customer: customer._id,
//             vendor: vendor._id,
//           });

//           vendor.lastAssignedAt = new Date();
//           vendor.assignCustomerNumber += 1;
//           await vendor.save();

//           customer.numberOfAssign += 1;
//           customer.lastAssign = new Date();
//           await customer.save();

//           console.log(
//             `Assigned customer ${customer.name} to vendor ${vendor.userName}`
//           );

//           assignedCount++;

//           if (assignedCount >= 4) {
//             break;
//           }
//         }
//       }
//     }

//     if (assignments.length > 0) {
//       await Assign.insertMany(assignments);
//       console.log(`Assigned ${assignments.length} customers to vendors.`);
//     } else {
//       console.log(
//         "No eligible customers found or all vendors have reached their lead limit."
//       );
//     }
//   } catch (error) {
//     console.error("Error assigning customers to vendors:", error);
//   }
// }

// module.exports = leadShuffleing;

const Assign = require("../../models/assign");
const Customer = require("../../models/customer");
const Setting = require("../../models/setting");
const User = require("../../models/user");
const LeadStatus = require("../../models/leadStatus");
const mongoose = require("mongoose");

async function leadShuffleing() {
  try {
    const today = new Date();
    const setting = await Setting.findById("671209786e71f92bd39c21d6");

    const validDate = setting.validDate || 6;
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - validDate);

    if (setting.numberOfAssign === 0) return;

    const assignedCustomers = await Customer.find({
      verify: true,
      numberOfAssign: { $lt: setting.numberOfAssign || 4, $gt: 0 },
      $or: [{ eventDate: { $gt: today } }, { eventDate: null }],
      createdAt: { $gte: sixDaysAgo },
    }).populate("budgetRange services");

    const assignments = [];
    const leadStatuses = []; // Array to store lead statuses

    for (const customer of assignedCustomers) {
      const vendors = await User.find({
        location: { $in: [customer.weedingLocation] },
        role: "Vendor",
        verify: "Verified",
        service: customer.services[0],
      })
        .populate({
          path: "package",
          populate: { path: "budgetRange" },
        })
        .sort("lastAssignedAt");

      let assignedCount = customer.numberOfAssign;

      for (const vendor of vendors) {
        const alreadyAssigned = await Assign.findOne({
          customer: customer._id,
          vendor: vendor._id,
        });

        customer.lastAssign.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (
          !alreadyAssigned &&
          vendor.assignCustomerNumber < vendor.package.assignLeadValue &&
          vendor.package &&
          vendor.package.budgetRange.some((range) =>
            range.equals(customer.budgetRange._id)
          ) &&
          (!customer.lastAssign ||
            today - customer.lastAssign >=
              setting.duration * 24 * 60 * 60 * 1000) &&
          (!customer.eventDate || customer.eventDate > today)
        ) {
          // Generate a manual _id for the assignment
          const assignmentId = new mongoose.Types.ObjectId();

          // Prepare the assignment document
          assignments.push({
            _id: assignmentId, // Use the manually generated _id
            customer: customer._id,
            vendor: vendor._id,
          });

          // Prepare the corresponding lead status document
          leadStatuses.push({
            assign: assignmentId, // Use the same _id as the assignment
            vendor: vendor._id,
            customer: customer._id,
            status: "Pending", // Default status
          });

          // Update vendor and customer details
          vendor.lastAssignedAt = new Date();
          vendor.assignCustomerNumber += 1;
          await vendor.save();

          customer.numberOfAssign += 1;
          customer.lastAssign = new Date();
          await customer.save();

          console.log(
            `Assigned customer ${customer.name} to vendor ${vendor.userName}`
          );

          assignedCount++;

          if (assignedCount >= 4) {
            break;
          }
        }
      }
    }

    if (assignments.length > 0) {
      // Insert all assignments in bulk
      await Assign.insertMany(assignments);

      // Insert all lead statuses in bulk
      await LeadStatus.insertMany(leadStatuses);

      console.log(
        `Assigned ${assignments.length} customers to vendors and created ${leadStatuses.length} lead statuses.`
      );
    } else {
      console.log(
        "No eligible customers found or all vendors have reached their lead limit."
      );
    }
  } catch (error) {
    console.error("Error assigning customers to vendors:", error);
  }
}

module.exports = leadShuffleing;
