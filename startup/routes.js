const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const error = require("../middlewares/error");
const users = require("../controllers/users");
const sellers = require("../controllers/sellers");
const jobs = require("../controllers/jobs");
const proposals = require("../controllers/proposals");
const register = require("../auth/register");
const login = require("../auth/login");
const emailVerify = require("../controllers/emailVerify");

module.exports = function (app) {
  app.use(helmet()); // it encrypt my headers which helps in preventing attacks
  app.use(cors()); // it allows external origins to make request to my api
  app.use(express.json()); //return middleware function which check if there is any json object inside req body

  app.use("/api/user", users);
  app.use("/api/seller", sellers);
  app.use("/api/job", jobs);
  app.use("/api/proposal", proposals);
  app.use("/auth/register", register);
  app.use("/auth/login", login);
  app.use("/verify", emailVerify);

  //if no middleware works it works
  app.use(error);
};
