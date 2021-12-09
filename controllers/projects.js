const express = require("express");
const { validate, Project,stringToObject } = require("../models/project");
const router = express.Router();

//create a projects
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //creating new projects
  const project = new Project({
    proposalId: req.body.proposalId,
    jobId: req.body.jobId,
    sellerId:req.body.sellerId,
    buyerId:req.body.buyerId
  });

  //saving in database
  try {
    const result = await project.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get all projects of sellers 
router.get("/seller/:userId", async (req, res) => {
   

      //converting string Id into objectID
  const id = stringToObject(req.params.userId);

  try {
    const projects = await Project.aggregate([{$match:{ sellerId: id }},
    
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
          as: "sellerDetail",
        },
      },

       {
        $lookup: {
          from: "users",
          localField: "buyerId",
          foreignField: "_id",
          as: "buyerDetail",
        },
      },
    
        {
        $lookup: {
          from: "proposals",
          localField: "proposalId",
          foreignField: "_id",
          as: "proposalDetail",
        },
      },
        {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetail",
        },
      },
    {
        $project: {
          "buyerDetail.password": 0,
          "buyerDetail.email": 0,
          "buyerDetail.address": 0,
          "buyerDetail.city": 0,
          "buyerDetail.zipCode": 0,
          "buyerDetail.accountType": 0,
          "buyerDetail.isActive": 0,
          "buyerDetail.phoneNumber": 0,
        },
      },

      {
        $project: {
          "sellerDetail.password": 0,
          "sellerDetail.email": 0,
          "sellerDetail.address": 0,
          "sellerDetail.city": 0,
          "sellerDetail.zipCode": 0,
          "sellerDetail.accountType": 0,
          "sellerDetail.isActive": 0,
          "sellerDetail.phoneNumber": 0,
        },
      },
    
    ])

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});


// get all projects of buyers 
router.get("/buyer/:userId", async (req, res) => {
   

      //converting string Id into objectID
  const id = stringToObject(req.params.userId);

  try {
    const projects = await Project.aggregate([{$match:{ buyerId: id }},
    
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
          as: "sellerDetail",
        },
      },

       {
        $lookup: {
          from: "users",
          localField: "buyerId",
          foreignField: "_id",
          as: "buyerDetail",
        },
      },
    
        {
        $lookup: {
          from: "proposals",
          localField: "proposalId",
          foreignField: "_id",
          as: "proposalDetail",
        },
      },
        {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetail",
        },
      },
    {
        $project: {
          "buyerDetail.password": 0,
          "buyerDetail.email": 0,
          "buyerDetail.address": 0,
          "buyerDetail.city": 0,
          "buyerDetail.zipCode": 0,
          "buyerDetail.accountType": 0,
          "buyerDetail.isActive": 0,
          "buyerDetail.phoneNumber": 0,
        },
      },

      {
        $project: {
          "sellerDetail.password": 0,
          "sellerDetail.email": 0,
          "sellerDetail.address": 0,
          "sellerDetail.city": 0,
          "sellerDetail.zipCode": 0,
          "sellerDetail.accountType": 0,
          "sellerDetail.isActive": 0,
          "sellerDetail.phoneNumber": 0,
        },
      },
    
    ])

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all projects 
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("jobId", "proposalId");

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
