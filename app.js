const express = require("express");

require("dotenv").config();

const app = express();
require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();

module.exports = app;
