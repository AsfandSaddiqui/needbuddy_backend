const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
require("dotenv").config();
require("./startup/logging");
require("./startup/routes")(app);
require("./startup/socket")(io);
require("./startup/db")(server);

module.exports = server;
