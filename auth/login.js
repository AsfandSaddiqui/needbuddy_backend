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
    if (user) {
      if (user.isActive === false)
        res.status(404).send("User Account Doesn't Exist contact Admin");
    } else {
      return res.status(404).send("Invalid Username or Password");
    }

    //validating password using bcrypt
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(404).send("Invalid Username or Password");

    let isStepsComplete = false;

    //checking if address is empty or not
    if (user.address) isStepsComplete = true;

    const token = jwt.sign(
      {
        _id: user._id,
        user_type: user.accountType,
        firstName: user.firstName,
        isStepsComplete: isStepsComplete,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
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
