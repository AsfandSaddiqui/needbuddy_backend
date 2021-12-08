//users routes defined here
const express = require("express");
const { validate, Proposal, stringToObject } = require("../models/proposal");
const { User } = require("../models/user");
const router = express.Router();

//get all proposals
router.get("/", async (req, res) => {
  let pageNumber = 1;
  const pageSize = 10;
  if (req.query.pageNumber) pageNumber = req.query.pageNumber;
  try {
    const proposals = await Proposal.find()
      .populate("jobId")
      .populate("sellerId")
      .skip((pageNumber - 1) * pageSize)
      .limit(10)
      .sort({ $natural: -1 });
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find a proposals using buyer ID
router.get("/buyer/:id", async (req, res) => {
  //converting string Id into objectID
  const id = stringToObject(req.params.id);

  try {
    const proposal = await Proposal.aggregate([
      { $match: { jobId: id } },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "seller.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          "user.password": 0,
          "user.email": 0,
          "user.address": 0,
          "user.city": 0,
          "user.zipCode": 0,
          "user.accountType": 0,
          "user.isActive": 0,
          "user.firstName": 0,
          "user.lastName": 0,
          "user.phoneNumber": 0,
        },
      },
    ]);

    if (proposal) {
      res.status(200).send({ proposal });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find a proposals using buyer ID
router.get("/seller/:id", async (req, res) => {
  //converting string Id into objectID
  const id = stringToObject(req.params.id);

  try {
    const proposal = await Proposal.aggregate([
      { $match: { sellerId: id } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "job.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          "user.password": 0,
          "user.email": 0,
          "user.address": 0,
          "user.city": 0,
          "user.zipCode": 0,
          "user.accountType": 0,
          "user.isActive": 0,
          "user.firstName": 0,
          "user.lastName": 0,
          "user.phoneNumber": 0,
        },
      },
    ]);

    if (proposal) {
      res.status(200).send({ proposal });
    }
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
    const result = await Proposal.findById(req.params.id);
    if (!result) return res.status(404).send("No Proposal Exist with this Id!");

    //delete proposal from database
    try {
      const result = await Proposal.deleteOne({ _id: req.params.id });
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

  try {
    const job = await Proposal.find({ jobId: req.params.id });
    if (!job) return res.status(404).send("No Job  Exist!");
  } catch (error) {
    res.status(500).send(error.message);
  }

  //creating new proposal
  const proposal = new Proposal({
    coverLetter: req.body.coverLetter,
    timeRequired: req.body.timeRequired,
    attachments: req.body.attachments,
    isActive: req.body.isActive,
    offer: req.body.offer,
    sellerId: req.body.sellerId,
    jobId: req.body.jobId,
  });

  //saving in database
  try {
    const result = await proposal.save();
    res.status(201).send("proposal created Successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
