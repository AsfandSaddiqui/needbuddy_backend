const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  //find user in database
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //validaing if user already existed
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("Invalid Username or Password");

    //validating password using bcrypt
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(404).send("Invalid Username or Password");

    const token = jwt.sign(
      { _id: user._id, user_type: user.accountType },
      process.env.JWT_KEY
    );
    res.status(200).send(token);
  } catch (e) {
    console.log(e.message);
  }
  //if exist return jwt token and status 200
});

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().email().max(64).required(),
    password: Joi.string().min(10).max(255),
  });
  return schema.validate(req);
};

module.exports = router;
