//users routes defined here
const express = require("express");
const { validate, ProjectCatalogue } = require("../models/projectCatalogue");
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

//find catalogue by ID
router.get("/find/:id", async (req, res) => {
  try {
    const catalogue = await ProjectCatalogue.find({
      _id: req.params.id,
      isActive: true,
    }).populate("userId");
    if (!catalogue) return res.status(404).send("No Catalogue Existed!");
    res.status(200).send(catalogue);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Delete catalogue by ID
router.put("/deactive/:id", async (req, res) => {
  try {
    const catalogue = await ProjectCatalogue.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
      },
    });
    if (!catalogue) return res.status(404).send("catalogue doesn't exist");
    return res.status(200).send("catalogue Deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//search
router.get("/search", async (req, res) => {
  query = req.query.query;
  try {
    const result = await ProjectCatalogue.aggregate([
      {
        $search: {
          index: "catalogueSearch",
          text: {
            query: query,
            path: ["headline", "description", "category"],
            fuzzy: {},
          },
        },
      },
      { $match: { isActive: true } },
    ]);
    return res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//find catalogue by userID
router.get("/find/user-id/:id", async (req, res) => {
  try {
    const catalogue = await ProjectCatalogue.find({
      userId: req.params.id,
      isActive: true,
    });
    if (!catalogue) return res.status(404).send("No Catalogue Existed!");
    res.status(200).send(catalogue);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//update catalogue by ID
router.put("/update/:id", async (req, res) => {
  try {
    const catalogue = await ProjectCatalogue.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    if (!catalogue) return res.status(404).send("catalogue doesn't exist");
    return res.status(200).send("catalogue updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
