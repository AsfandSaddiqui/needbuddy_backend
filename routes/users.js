//users routes defined here
const express = require("express");
const { validate, User } = require("../models/user");
const { validateUserTeaser, UserTeaser } = require("../models/userTeaser");
const router = express.Router();

//get all users
router.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

//find a user
router.get("/:id", (req, res) => {
  res.status(200).send(req.params.id);
});

//validate a username
router.get("/validate/:username", (req, res) => {
  //match username from db
  res.status(200).send(true);
});

//update a user
router.put("/update/:id", (req, res) => {
  res.status(200).send(req.params.id);
});

//delete a user
router.post("/delete/:id", (req, res) => {
  res.status(200).send(req.params.id);
});

//create a user
router.post("/create", (req, res) => {
  res.status(200).send(req.params.id);
});

module.exports = router;
