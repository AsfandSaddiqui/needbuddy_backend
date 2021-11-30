const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

//get all users
router.get("/:token", async (req, res) => {
  try {
    //verify the token
    const { username } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);

    //searching for user
    const users = await User.updateOne(
      { username: username },
      {
        $set: {
          isEmailVerified: true,
        },
      }
    );

    res.status(200).send("Email verified!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
