const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const error = require("../middlewares/error");
const users = require("../controllers/users");
const sellers = require("../controllers/sellers");
const jobs = require("../controllers/jobs");
const proposals = require("../controllers/proposals");
const projects = require("../controllers/projects");
const conversation = require("../controllers/conversations");
const message = require("../controllers/messages");
const catalogue = require("../controllers/catalogues");
const catalogueOrders = require("../controllers/catalogueOrders");
const tickets = require("../controllers/tickets");
const register = require("../auth/register");
const login = require("../auth/login");
const emailVerify = require("../controllers/emailVerify");

module.exports = function (app, server) {
  app.use(helmet()); // it encrypt my headers which helps in preventing attacks
  app.use(cors()); // it allows external origins to make request to my api
  app.use(express.json()); //return middleware function which check if there is any json object inside req body

  app.use("/api/user", users);
  app.use("/api/seller", sellers);
  app.use("/api/job", jobs);
  app.use("/api/proposal", proposals);
  app.use("/api/project", projects);
  app.use("/api/catalogue", catalogue);
  app.use("/api/catalogue-orders", catalogueOrders);
  app.use("/api/conversation", conversation);
  app.use("/api/message", message);
  app.use("/api/ticket", tickets);
  app.use("/auth/register", register);
  app.use("/auth/login", login);
  app.use("/verify", emailVerify);

  //if no middleware works it works
  app.use(error);
};
