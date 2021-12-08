//users routes defined here
const express = require("express");
const { validate, Job, validateStep } = require("../models/job");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

//get all jobs
router.get("/", async (req, res) => {
  let pageNumber = 1;
  const pageSize = 10;
  if (req.query.pageNumber) pageNumber = req.query.pageNumber;
  try {
    const jobs = await Job.find()
      .populate("userId")
      .skip((pageNumber - 1) * pageSize)
      .limit(10);
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find all jobs of user
router.get("/:id", async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.params.id });
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
    const result = await Job.findOne({ _id: req.params.id });
    if (!result) return res.status(404).send("No Job Exist with this Id!");

    //delete job from database
    try {
      const result = await Job.deleteOne({ _id: req.params.id });
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
    if (result) return res.status(201).send("Job Added Successfully!");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//create buyer steps
router.post("/steps", async (req, res) => {
  //validating body
  const { error } = validateStep(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { avatar, phoneNumber, zipCode, address, city } = req.body;
  //validates and update user record if  exist
  let user;
  try {
    user = await User.findByIdAndUpdate(req.body.userId, {
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

  const token = jwt.sign(
    {
      _id: user._id,
      user_type: user.accountType,
      firstName: user.firstName,
      isStepsComplete: true,
      email: user.email,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
    },
    process.env.JWT_KEY
  );

  //saving in database
  try {
    const result = await job.save();
    if (result)
      return res
        .status(201)
        .json({ token, Message: "Steps Completed Successfully" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
