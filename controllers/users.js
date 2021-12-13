//users routes defined here
const express = require("express");
const jwt = require("jsonwebtoken");
const { validate, User } = require("../models/user");
const { verifyEmail, passwordReset } = require("../utils/sendEmail");
const router = express.Router();
const bcrypt = require("bcrypt");

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).send("No User Exist with this ID!");
    //sendig user back
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find a user
router.get("/validate-steps/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).send("No User Exist with this ID!");
    //sendig user back
    if (!user.address) return res.status(200).send(false);

    res.status(200).send(true);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//update a user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    if (!user) return res.status(404).send("No User Exist with this ID!");
    //sendig user back
    res.status(200).send("User Updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//generating token and URL for password
const generatePasswordToken = (id) => {
  const token = jwt.sign({ id }, process.env.EMAIL_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

router.get("/reset-password/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send("No User Exist with this Email!");

    const token = generatePasswordToken(user._id);
    //closed for testing purpose
    const url = `https://needbuddy.herokuapp.com/reset-password`;
    passwordReset(user.email, url);
    //sendig response back
    return res.status(200).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//update Password
router.put("/update-password/:id", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);

  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        password,
      },
    });
    if (!user) return res.status(404).send("No User Exist with this ID!");

    //sendig response back
    res.status(200).send("Password Updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete a user
router.delete("/:id", async (req, res) => {
  try {
    //checking if user exist
    const result = await User.findOne({ _id: req.params.id });
    if (!result) return res.status(404).send("No User Exist with this ID!");

    //delete user from database
    try {
      const result = await User.deleteOne({ _id: req.params.id });
      return res.status(200).send("User deleted Successfully");
    } catch (e) {
      console.log(e.message);
    }
  } catch (e) {
    console.log(e.message);
  }
});

const generateToken = (username) => {
  const token = jwt.sign({ username }, process.env.EMAIL_SECRET, {
    expiresIn: "1h",
  });
  const url = `http://localhost:5000/verify/${token}`;
  return url;
};

//create a user
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //validaing if user already existed
  try {
    let result = await User.findOne({ email: req.body.email });
    if (result) return res.status(400).send("Email Already Exist!");

    result = await User.findOne({ username: req.body.username });
    if (result) return res.status(400).send("Username Already Exist!");
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

    const url = generateToken(user.username);

    if (result) verifyEmail(user.email, url);

    res
      .status(201)
      .send(
        "User created Successfully, Verify your Email for using our application "
      );
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
