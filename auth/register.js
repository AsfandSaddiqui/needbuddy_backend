const express = require("express");
const { validate, User } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

//create a user
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //validaing if user already existed
  try {
    const result = await User.findOne({ username: req.body.username });
    if (result) res.status(400).send("User Already Registerd");
  } catch (e) {
    console.log(e.message);
  }
  //creating new user
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    accountType: req.body.accountType,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  //saving in database
  try {
    const result = await user.save();
    res.status(201).send("user created Successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
