const express = require("express");

const userRoutes = require("./userRoutes");

exports.appRoutes = (app) => {
  app.use("/public", express.static("public"));
  app.use("/api/user", userRoutes);
};
