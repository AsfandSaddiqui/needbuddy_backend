module.export = function (error, req, res, next) {
  //log the exception
  res.status(500).send("something failed");
};
