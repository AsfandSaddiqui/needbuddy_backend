const express = require("express");
const { validate, Conversation } = require("../models/Conversation");
const router = express.Router();

//create a conversation
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //validaing if seller already existed
  try {
    const result = await Conversation.findOne({
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
    });
    console.log(result);
    if (result) return res.status(400).send("Conversation Already Exist");
  } catch (e) {
    console.log(e.message);
  }

  //creating new seller
  const conversation = new Conversation({
    senderId: req.body.senderId,
    receiverId: req.body.senderId,
  });

  //saving in database
  try {
    const result = await conversation.save();
    res.status(201).send("conversation created Successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//get conversation of a user
router.get("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conversation includes two userId
router.get("/find/:senderId/:receiverId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      senderId: req.params.senderId,
      receiverId: req.params.receiverId,
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all conversation of sender
router.get("/find/:senderId/", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      senderId: req.params.senderId,
    }).populate("receiverId", "username avatar -_id ");

    // .select("email");
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all conversation
router.get("/", async function (req, res) {
  try {
    const result = await Conversation.find();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
