//users routes defined here
const express = require("express");
const { validate, ProjectCatalogue } = require("../models/ProjectCatalogue");
const router = express.Router();

//create a catalogue
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //creating new job
  const catalogue = new ProjectCatalogue({
    headline: req.body.headline,
    description: req.body.description,
    category: req.body.category,
    daysRequired: req.body.daysRequired,
    specifications: req.body.specifications,
    attachments: req.body.attachments,
    isActive: req.body.isActive,
    budget: req.body.budget,
    userId: req.body.userId,
  });

  //saving in database
  try {
    const result = await catalogue.save();
    if (result) return res.status(201).send("Cataegory Created Successfully!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//find all catalogues who is active
router.get("/find", async (req, res) => {
  let pageNumber = 1;
  const pageSize = 20;
  if (req.query.pageNumber) pageNumber = req.query.pageNumber;

  try {
    const catalogues = await ProjectCatalogue.find({ isActive: true })
      .skip((pageNumber - 1) * pageSize)
      .limit(10)
      .sort({ $natural: -1 });

    res.status(200).send(catalogues);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find  job by ID
router.get("/find/:id", async (req, res) => {
  try {
    const catalogue = await ProjectCatalogue.findById(req.params.id).populate(
      "userId"
    );
    res.status(200).send(catalogue);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
