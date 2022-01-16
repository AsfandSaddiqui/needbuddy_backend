const express = require("express");
const { validate, CatalogueOrders } = require("../models/catalogueOrders");
const router = express.Router();

//create a catalogue order
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //creating new catalogue order
  const order = new CatalogueOrders({
    amount: req.body.amount,
    catalogueId: req.body.catalogueId,
    specifications: req.body.specifications,
    buyerId: req.body.buyerId,
  });

  //saving in database
  try {
    const result = await order.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get all order of particular catalogue
router.get("/find/:catalogueId", async (req, res) => {
  try {
    const orders = await CatalogueOrders.find({
      catalogueId: req.params.catalogueId,
    });
    if (!orders)
      return res.status(404).send("No Catalogue Exist with this ID!");
    //sendig user back
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// update order status
router.put("/:id", async (req, res) => {
  try {
    const order = await CatalogueOrders.findByIdAndUpdate(req.params.id, {
      $set: {
        status: req.body.status,
      },
    });
    if (!order)
      return res.status(404).send("No Catalogue Order Exist with this ID!");
    //sendig user back
    res.status(200).send("Order Status Updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// add order reviews
router.put("/order/:orderId/review", async (req, res) => {
  try {
    const order = await CatalogueOrders.findByIdAndUpdate(req.params.orderId, {
      $set: {
        buyerReview: req.body.buyerReview,
      },
    });
    if (!order) return res.status(404).send("No Order Exist with this ID!");
    //sendig user back
    res.status(200).send("Buyer Reviews Added Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get all review of buyers on particular catalogue
router.get("/catalogue/:id/reviews", async (req, res) => {
  catalogueStatus = req.query.status;
  try {
    const orders = await CatalogueOrders.find({
      catalogueId: req.params.id,
      status: catalogueStatus,
    }).populate("buyerId");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
