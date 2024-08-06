const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const cron = require("node-cron");

const { appRoutes } = require("./routes/appRoutes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");
const assignVendor = require("./controllers/assign/assignVendor");

const app = express();

//body parser middleware
app.use(express.json());

//cors middleware
app.use(cors());
app.use(morgan("dev"));

// Schedule the cron job to run the testVendro function every minute
cron.schedule("* * * * *", async () => {
  try {
    await assignVendor();
    console.log("assign function executed");
  } catch (error) {
    console.error("Error executing assign function:", error);
  }
});

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
