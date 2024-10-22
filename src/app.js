const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const cron = require("node-cron");

const { appRoutes } = require("./routes/appRoutes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");
const assignVendor = require("./controllers/assign/assignVendor");
const verificationSchedule = require("./controllers/assign/verificationSchedule");
const leadShuffleing = require("./controllers/assign/leadShuffleing");

const app = express();

//body parser middleware
app.use(express.json());

//cors middleware
app.use(cors());
app.use(morgan("dev"));

cron.schedule(
  "0 11 * * *",
  async () => {
    try {
      console.log("Verification funciton executed....");
      await verificationSchedule();
      console.log("Verification funciton close....");

      console.log("Assign funciton executed....");
      await assignVendor();
      console.log("Assign funciton close....");

      console.log("Lead Shuffeling funciton executed....");
      await leadShuffleing();
      console.log("Lead Shuffeling funciton close....");
    } catch (error) {
      console.error("Error executing assign function:", error);
    }
  },
  {
    timezone: "Asia/Kolkata", // Setting time zone to IST
  }
);

cron.schedule(
  "0 7 * * *",
  async () => {
    try {
      // await verificationSchedule();
      await leadShuffleing();
      console.log("lead shuffleing lead shuffleing function executed");
    } catch (error) {
      console.error("Error executing assign function:", error);
    }
  },
  {
    timezone: "Asia/Kolkata", // Setting time zone to IST
  }
);

cron.schedule(
  "0 8 * * *",
  async () => {
    try {
      await verificationSchedule();
      console.log("verificationSchedule function executed");
    } catch (error) {
      console.error("Error executing verificationSchedule function:", error);
    }
  },
  {
    timezone: "Asia/Kolkata", // Setting time zone to IST
  }
);

//cookie parser middleware
app.use(cookieParser());

// testing middleware
app.use("/", (req, res, next) => {
  // console.log(req.body);
  next();
});

//routes
appRoutes(app);

// unhandle route middleware
app.all("*", (req, res, next) => {
  return next(
    new AppError(`The route ${req.originalUrl} not run on this server.`, 404)
  );
});

// global error middleware
app.use(globalErrorHandler);

module.exports = app;
