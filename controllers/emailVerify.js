const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

//verify token
router.get("/:token", async (req, res) => {
  //verify the token
  const { username } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
  try {
    //searching for user and update its email verified status
    const users = await User.updateOne(
      { username: username },
      {
        $set: {
          isEmailVerified: true,
        },
      }
    );

    res.redirect("https://needbuddy.herokuapp.com/email-verified");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
