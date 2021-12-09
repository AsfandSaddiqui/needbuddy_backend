const express = require("express");
const { validate, Project } = require("../models/project");
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
  });

  //saving in database
  try {
    const result = await project.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err.message);
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
