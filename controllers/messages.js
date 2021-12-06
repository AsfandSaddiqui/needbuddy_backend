const express = require("express");
const { validate, Message } = require("../models/message");
const router = express.Router();

//create a message
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //validaing if seller already existed

  //creating new message
  const message = new Message({
    senderId: req.body.senderId,
    conversationId: req.body.conversationId,
    text: req.body.text,
  });

  //saving in database
  try {
    const result = await message.save();
    res.status(201).send("Message added Successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get all messages of conversation
router.get("/find/:conversationId/", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).populate("senderId", "avatar _id ");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
