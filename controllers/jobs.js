//users routes defined here
const express = require("express");
const { validate, Job } = require("../models/job");
const { User } = require("../models/user");
const router = express.Router();

//get all users
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("userId");
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find all jobs of user
router.get("/:id", async (req, res) => {
  try {
    const jobs = await Job.findOne({ userId: req.params.id }).populate(
      "userId"
    );
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find and update a job
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    if (!job) return res.status(404).send("No Job Exist with this ID!");

    res.status(200).send("job updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete a job
router.delete("/:id", async (req, res) => {
  try {
    //checking if job exist
    const result = await User.findOne({ _id: req.params.id });
    if (!result) return res.status(404).send("No Job Exist with this Id!");

    //delete job from database
    try {
      const result = await User.deleteOne({ _id: req.params.id });
      return res.status(200).send("Job deleted Successfully");
    } catch (e) {
      console.log(e.message);
    }
  } catch (e) {
    console.log(e.message);
  }
});

const createJob = async (req) => {
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
    return true;
  } catch (err) {
    return err.message;
  }
};

//create a job
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //creating a job
  const result = createJob(req);
  if (result) return res.status(201).send("job created Successfully!");

  res.status(500).send(result);
});

//create a job
router.post("/steps", async (req, res) => {
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
  const result = createJob(req);

  if (result) return res.status(201).send("job created Successfully!");

  res.status(500).send(result);
});

module.exports = router;
