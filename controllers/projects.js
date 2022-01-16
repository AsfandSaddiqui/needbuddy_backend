const express = require("express");
const { validate, Project, stringToObject } = require("../models/project");
const { Seller } = require("../models/seller");
const { Job } = require("../models/job");
const router = express.Router();
const mongoose = require("mongoose");

//create a projects
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //creating new projects
  const project = new Project({
    proposalId: req.body.proposalId,
    jobId: req.body.jobId,
    sellerId: req.body.sellerId,
    buyerId: req.body.buyerId,
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
  //searching for seller against user Id
  let seller;
  try {
    seller = await Seller.findOne({ userId: req.params.userId });
    if (!seller)
      return res.status(404).send("No Seller Exist with this User ID!");
  } catch (error) {
    res.status(500).send(error.message);
  }

  try {
    const projects = await Project.aggregate([
      { $match: { sellerId: seller._id } },

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
    ]);

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get seller project income
router.get("/seller/income/:userId", async (req, res) => {
  //searching for seller against user Id
  let seller;
  try {
    seller = await Seller.findOne({ userId: req.params.userId });
    if (!seller)
      return res.status(404).send("No Seller Exist with this User ID!");
  } catch (error) {
    res.status(500).send(error.message);
  }
  //finding total orders
  try {
    const projects = await Project.aggregate([
      { $match: { $and: [{ sellerId: seller._id }, { status: "Completed" }] } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobs",
        },
      },
      {
        $unwind: "$jobs",
      },
      {
        $group: {
          _id: "$sellerId",
          totalOrders: { $sum: 1 },
          totalEarning: { $sum: "$jobs.budget" },
          avgRating: { $avg: "$buyerReview.rating" },
        },
      },
    ]);

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get buyer total spending income
router.get("/buyer/spending/:userId", async (req, res) => {
  //searching for seller against user Id
  let id = mongoose.Types.ObjectId(req.params.userId);
  //finding total orders
  try {
    const projects = await Project.aggregate([
      { $match: { $and: [{ buyerId: id }, { status: "Completed" }] } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobs",
        },
      },
      {
        $unwind: "$jobs",
      },
      {
        $group: {
          _id: "$sellerId",
          totalOrders: { $sum: 1 },
          toalEarning: { $sum: "$jobs.budget" },
          avgRating: { $avg: "$buyerReview.rating" },
        },
      },
    ]);

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
    const projects = await Project.aggregate([
      { $match: { buyerId: id } },

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
    ]);

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("jobId")
      .populate("proposalId");

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update  project status
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    if (!project) return res.status(404).send("No Project Exist with this ID!");
    //sendig user back
    res.status(200).send("Project Details Updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// add  project reviews
router.put("/:id/review", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    if (!project) return res.status(404).send("No Project Exist with this ID!");
    //sendig user back
    res.status(200).send("Project Details Updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get all reviews of buyer
router.get("/:id/reviews", async (req, res) => {
  try {
    const projects = await Project.find({
      buyerId: req.params.id,
      status: "Completed",
    }).populate("jobId", "headline budget ");

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all reviews of seller
router.get("/:id/reviews/seller", async (req, res) => {
  //searching for seller against user Id
  let seller;
  try {
    seller = await Seller.findOne({ userId: req.params.id });
    if (!seller)
      return res.status(200).send("No Seller Exist with this User ID!");
  } catch (error) {
    res.status(500).send(error.message);
  }

  try {
    const projects = await Project.find({
      sellerId: seller._id,
      status: "Completed",
    }).populate("jobId", "headline budget ");

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
