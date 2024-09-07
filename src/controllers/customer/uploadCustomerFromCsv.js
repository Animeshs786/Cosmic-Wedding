const fs = require("fs");
const csv = require("csv-parser");
const Customer = require("../../models/customer");
const BudgetRange = require("../../models/budgetRange");
const Location = require("../../models/location");
const Service = require("../../models/service");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.uploadCustomerFromCsv = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.csvFile) {
    return next(new AppError("No file uploaded", 400));
  }

  const filePath = `${req.files.csvFile[0].destination}/${req.files.csvFile[0].filename}`;

  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(results);

        for (const row of results) {
          const existingCustomer = await Customer.findOne({
            name: row.Name,
            mobile: row.Mobile,
            email: row.Email,
            createdAt: { $gte: today },
          });

          if (!existingCustomer) {
            const budgetRange = await BudgetRange.findOne({
              name: { $regex: row["Budget Range"], $options: "i" },
            });
            const location = await Location.findOne({
              location: { $regex: row.Location, $options: "i" },
            });
            const weddingLocation = await Location.findOne({
              location: { $regex: row["Wedding Location"], $options: "i" },
            });

            const service = await Service.findOne({
              name: { $regex: row.Services, $options: "i" },
            });

            if (!budgetRange) {
              return next(new AppError("Budget Range not found", 404));
            }

            if (!location) {
              return next(new AppError("Location not found", 404));
            }

            if (!service) {
              return next(new AppError("Service not found", 404));
            }
            if (!weddingLocation) {
              return next(new AppError("Wedding Location not found", 404));
            }

            let dateFormat = row["Event Date"]?.split("-");
            const eventDate = row["Event Date"]
              ? `${dateFormat[2]}-${dateFormat[1]}-${dateFormat[0]}`
              : Date.now();

            // Create new customer entry
            const newCustomer = new Customer({
              name: row.Name,
              mobile: row.Mobile,
              location: location._id,
              weedingLocation: weddingLocation._id,
              eventDate: eventDate,
              email: row.Email,
              budgetRange: budgetRange._id,
              guest: row.Guest === "Null" ? 0 : row.Guest,
              services: [service._id],
              status: row.Status === "Null" ? "Pending" : row.Status,
            });

            await newCustomer.save();
            console.log(`Customer ${row.Name} added successfully.`);
          } else {
            console.log(
              `Customer ${row.Name} already registered today. Skipping...`
            );
          }
        }

        res.status(201).json({
          status: true,
          message: "Customers uploaded successfully",
        });
      } catch (err) {
        console.error(`Error processing rows, error: ${err}`);
        return next(new AppError("Error processing the CSV file", 500));
      }
    })
    .on("error", (err) => {
      return next(
        new AppError(`Error reading the CSV file: ${err.message}`, 500)
      );
    });
});

// const fs = require("fs");
// const csv = require("csv-parser");
// const Customer = require("../../models/customer");
// const BudgetRange = require("../../models/budgetRange");
// const Location = require("../../models/location");
// const Service = require("../../models/service");
// const AppError = require("../../utils/AppError");
// const catchAsync = require("../../utils/catchAsync");

// function convertDateFormat(dateStr) {
//   const [dd, mm, yyyy] = dateStr.split("-");
//   return `${yyyy}-${mm}-${dd}`;
// }

// exports.uploadCustomerFromCsv = catchAsync(async (req, res, next) => {
//   if (!req.files || !req.files.csvFile) {
//     return next(new AppError("No file uploaded", 400));
//   }

//   const filePath = `${req.files.csvFile[0].destination}/${req.files.csvFile[0].filename}`;
//   const results = [];

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", async () => {
//       try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         // Collect all unique queries
//         const budgetRanges = new Set();
//         const locations = new Set();
//         const services = new Set();
//         const weddingLocations = new Set();

//         results.forEach(row => {
//           budgetRanges.add(row["Budget Range"]);
//           locations.add(row.Location);
//           services.add(row.Services);
//           weddingLocations.add(row["Wedding Location"]);
//         });

//         // Fetch all budget ranges, locations, services, and wedding locations
//         const [budgetRangeDocs, locationDocs, serviceDocs, weddingLocationDocs] = await Promise.all([
//           BudgetRange.find({ name: { $in: Array.from(budgetRanges) } }),
//           Location.find({ location: { $in: Array.from(locations) } }),
//           Service.find({ name: { $in: Array.from(services) } }),
//           Location.find({ location: { $in: Array.from(weddingLocations) } })
//         ]);

//         // Create maps for quick lookup
//         const budgetRangeMap = new Map(budgetRangeDocs.map(b => [b.name.toLowerCase(), b._id]));
//         const locationMap = new Map(locationDocs.map(l => [l.location.toLowerCase(), l._id]));
//         const serviceMap = new Map(serviceDocs.map(s => [s.name.toLowerCase(), s._id]));
//         const weddingLocationMap = new Map(weddingLocationDocs.map(wl => [wl.location.toLowerCase(), wl._id]));

//         const customersToInsert = [];

//         for (const row of results) {
//           const existingCustomer = await Customer.findOne({
//             name: row.Name,
//             mobile: row.Mobile,
//             email: row.Email,
//             createdAt: { $gte: today },
//           });

//           if (!existingCustomer) {
//             const budgetRangeId = budgetRangeMap.get(row["Budget Range"].toLowerCase());
//             const locationId = locationMap.get(row.Location.toLowerCase());
//             const weddingLocationId = weddingLocationMap.get(row["Wedding Location"].toLowerCase());
//             const serviceId = serviceMap.get(row.Services.toLowerCase());

//             if (!budgetRangeId || !locationId || !serviceId || !weddingLocationId) {
//               continue; // Skip if any required data is not found
//             }

//             const eventDate = row["Event Date"] ? convertDateFormat(row["Event Date"]) : Date.now();

//             customersToInsert.push({
//               name: row.Name,
//               mobile: row.Mobile,
//               location: locationId,
//               weedingLocation: weddingLocationId,
//               eventDate: eventDate,
//               email: row.Email,
//               budgetRange: budgetRangeId,
//               guest: row.Guest === "Null" ? 0 : row.Guest,
//               services: [serviceId],
//               status: row.Status === "Null" ? "Pending" : row.Status,
//             });
//           }
//         }

//         // Bulk insert customers
//         if (customersToInsert.length > 0) {
//           await Customer.insertMany(customersToInsert);
//           console.log(`${customersToInsert.length} customers added successfully.`);
//         }

//         res.status(201).json({
//           status: true,
//           message: "Customers uploaded successfully",
//         });
//       } catch (err) {
//         console.error(`Error processing rows, error: ${err}`);
//         return next(new AppError("Error processing the CSV file", 500));
//       }
//     })
//     .on("error", (err) => {
//       return next(
//         new AppError(`Error reading the CSV file: ${err.message}`, 500)
//       );
//     });
// });
