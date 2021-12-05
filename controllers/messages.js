const express = require("express");
const { validate, Message } = require("../models/message");
const router = express.Router();

//create a conversation
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

module.exports = router;
