const express = require("express");
const app = express();
require("dotenv").config();
require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();

module.exports = app;
