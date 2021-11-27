const mongoose = require("mongoose");
const winston = require("winston");
module.exports = function () {
  //database logic
  const DB =
    "mongodb+srv://asfand_saddiqui:asfand_saddiqui@cluster0.vnhgt.mongodb.net/need_buddy?retryWrites=true&w=majority";

  mongoose.connect(DB, () => {
    console.log("connected ");
  });
};
