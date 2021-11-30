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

//find a job
router.get("/:id", async (req, res) => {
  try {
    const jobs = await Job.findOne({ _id: req.params.id }).populate("userId");
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find and update a job
router.put("/:id", async (req, res) => {
  try {
    const jobs = await Job.updateOne(
      { _id: req.params.id },
      {
        $set: {
          headline: req.body.headline,
          description: req.body.description,
          expertiseRequired: req.body.expertiseRequired,
          timeRequired: req.body.timeRequired,
          skillsRequired: req.body.skillsRequired,
          images: req.body.images,
          isActive: req.body.isActive,
          budget: req.body.budget,
        },
      }
    );
    res.status(201).send("job updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete a job
router.delete("/:id", async (req, res) => {
  try {
    //checking if job exist
    const result = await User.findOne({ username: req.params.id });
    if (!result) return res.status(404).send("No Job Exist with this Id!");

    //delete job from database
    try {
      const result = await User.deleteOne({ username: req.params.id });
      return res.status(200).send("Job deleted Successfully");
    } catch (e) {
      console.log(e.message);
    }
  } catch (e) {
    console.log(e.message);
  }
});

//create a job
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { avatar, phoneNumber, zipCode, address, city } = req.body;
  //validates and update user record if  exist
  try {
    const user = await User.findByIdAndUpdate(req.body.userId, {
      $set: {
        avatar,
        phoneNumber,
        zipCode,
        address,
        city,
      },
    });
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
