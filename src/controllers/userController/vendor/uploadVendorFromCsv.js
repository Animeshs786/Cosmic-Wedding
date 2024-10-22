const fs = require("fs");
const csv = require("csv-parser");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const User = require("../../../models/user");


exports.uploadVendorFromCsv = catchAsync(async (req, res, next) => {
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
        const vendorsToInsert = [];

        for (const row of results) {
          const existingVendor = await User.findOne({
            $or: [{ email: row.Email }, { mobile: row.Mobile }],
          });

          if (!existingVendor) {
            // Split location IDs if there are multiple IDs in the CSV
            // const locationIds = row.Location.split(",").map((id) => id.trim());

            vendorsToInsert.push({
              userName: row.Name,
              email: row.Email,
              mobile: row.Mobile,
              role: "Vendor",
              // location: locationIds,
            //   password: row.Password,
            });
          } else {
            console.log(`Vendor ${row.Name} already exists. Skipping...`);
          }
        }

        // Bulk insert vendors
        if (vendorsToInsert.length > 0) {
          await User.insertMany(vendorsToInsert);
          console.log(`${vendorsToInsert.length} vendors added successfully.`);
        }

        res.status(201).json({
          status: true,
          message: "Vendors uploaded successfully",
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
