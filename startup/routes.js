const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const error = require("../middlewares/error");
const users = require("../apis/users");

module.exports = function (app) {
  app.use(helmet()); // it encrypt my headers which helps in preventing attacks
  app.use(cors()); // it allows external origins to make request to my APIs
  app.use(express.json()); //return middleware function which check if there is any json object inside req body

  app.use("/api/user", users);

  //if no middleware works it works
  app.use(error);
};
