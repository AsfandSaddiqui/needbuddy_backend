const express = require("express");
const { validate, Ticket } = require("../models/ticket");
const router = express.Router();

//create a ticket
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //creating new message
  const ticket = new Ticket({
    userId: req.body.userId,
    description: req.body.description,
    category: req.body.category,
  });

  //saving in database
  try {
    const result = await ticket.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// update ticket status
router.put("/status/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, {
      $set: {
        status: req.body.status,
      },
    });
    if (!ticket) return res.status(404).send("ticket doesn't exist");
    return res.status(200).send("ticket updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find all tickets who is filter
router.get("/find", async (req, res) => {
  let pageNumber = 1;
  const pageSize = 10;
  if (req.query.pageNumber) pageNumber = req.query.pageNumber;

  try {
    const ticket = await Ticket.find({ status: "pending" })
      .skip((pageNumber - 1) * pageSize)
      .limit(10)
      .sort({ $natural: -1 });

    res.status(200).send(ticket);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
