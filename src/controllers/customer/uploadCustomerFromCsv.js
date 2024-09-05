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
            console.log(row["Event Date"]);

            // Create new customer entry
            const newCustomer = new Customer({
              name: row.Name,
              mobile: row.Mobile,
              location: location._id,
              weedingLocation: weddingLocation._id,
              eventDate: row["Event Date"],
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
