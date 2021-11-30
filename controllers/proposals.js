//users routes defined here
const express = require("express");
const { validate, Proposal } = require("../models/proposal");
const { User } = require("../models/user");
const router = express.Router();

//get all proposals
router.get("/", async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("jobId")
      .populate("sellerId");
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find a proposal
router.get("/:id", async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id })
      .populate("userId")
      .populate("sellerId");
    res.status(200).send(proposal);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find and update a job
router.put("/:id", async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    res.status(200).send("Proposal updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete a proposal
router.delete("/:id", async (req, res) => {
  try {
    //checking if proposal exist
    const result = await User.findById(req.params.id);
    if (!result) return res.status(404).send("No Proposal Exist with this Id!");

    //delete proposal from database
    try {
      const result = await User.deleteOne({ _id: req.params.id });
      return res.status(200).send("Proposal deleted Successfully");
    } catch (e) {
      console.log(e.message);
    }
  } catch (e) {
    console.log(e.message);
  }
});

//create a proposal
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  
    if (!user) return res.status(404).send("No User Exist!");
  } catch (error) {
    res.status(500).send(error.message);
  }

  //creating new job
  const job = new Job({
    headline: req.body.headline,
    description: req.body.description,
    expertiseRequired: req.body.expertiseRequired,
    timeRequired: req.body.timeRequired,
    skillsRequired: req.body.skillsRequired,
    attachments: req.body.attachments,
    isActive: req.body.isActive,
    budget: req.body.budget,
    userId: req.body.userId,
  });

  //saving in database
  try {
    const result = await job.save();
    res.status(201).send("job created Successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
