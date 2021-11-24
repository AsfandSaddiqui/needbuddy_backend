const winston = require("winston");

module.exports = function () {
  //add logging logic here

  winston.handleExceptions(
    //logging errors for development enviroment
    new winston.transports.Console({ corlorize: true, prettyPrint: true }),
    //logging errors for production enviroment
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandleRejection", (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
};
