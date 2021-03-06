//users routes defined here
const express = require("express");
const { validate, Seller } = require("../models/seller");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

//get all users
router.get("/", async (req, res) => {
  try {
    const sellers = await Seller.find().populate("userId");
    res.status(200).send(sellers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete a seller
router.delete("/:id", async (req, res) => {
  try {
    //checking if seller exist
    const result = await Seller.findOne({ _id: req.params.id });
    if (!result) return res.status(404).send("No Seller Exist with this ID!");

    //delete user from database
    try {
      const result = await Seller.deleteOne({ _id: req.params.id });
      return res.status(200).send("Seller deleted Successfully");
    } catch (e) {
      console.log(e.message);
    }
  } catch (e) {
    console.log(e.message);
  }
});

//find a seller
router.get("/:id", async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).populate("userId");
    res.status(200).send(seller);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find a seller by userID
router.get("/find/:id", async (req, res) => {
  try {
    const seller = await Seller.findOne({userId:req.params.id}).populate("userId");
    res.status(200).send(seller);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//update a seller
router.put("/:id", async (req, res) => {
  try {
    const seller = await Seller.findOneAndUpdate({userId:req.params.id}, {
      $set: req.body,
    });
    if (!seller) return res.status(404).send("No Seller Exist with this ID!");
    //sendig user back
    res.status(200).send("Seller Details Updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//update seller profile
router.put("/:id/setting", async (req, res) => {
  try {
    const seller = await Seller.findOneAndUpdate({userId:req.params.id}, {
      $set: req.body,
    });
    if (!seller) return res.status(404).send("No Seller Exist with this ID!");
    //sendig user back
    res.status(200).send("Seller Details Updated Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


//delete  seller profile page
router.delete("/:id", async (req, res) => {
  try {
    //checking if selller exist
    const result = await Seller.findById(req.params.id);
    if (!result) return res.status(404).send("No Seller Exist with this ID!");

    //delete seller profile details from database
    try {
      const result = await User.deleteOne({ _id: req.params.id });
      return res.status(200).send("Seller details deleted Successfully");
    } catch (e) {
      console.log(e.message);
    }
  } catch (e) {
    console.log(e.message);
  }
});

//create a seller
router.post("/", async (req, res) => {
  //validating body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //validaing if seller already existed
  try {
    const result = await Seller.findOne({ userId: req.body.userId });
    if (result) return res.status(400).send("Seller Already Exist");
  } catch (e) {
    console.log(e.message);
  }

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

  //creating new seller
  const seller = new Seller({
    headline: req.body.headline,
    description: req.body.description,
    expertise: req.body.expertise,
    expertiseLevel: req.body.expertiseLevel,
    skills: req.body.skills,
    badge: req.body.badge,
    totalJobs: req.body.totalJobs,
    totalEarning: req.body.totalEarning,
    userId: req.body.userId,
  });

  //updating Token
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
    const result = await seller.save();
    res
      .status(201)
      .json({ token, message: "seller Steps Completed Successfully!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
