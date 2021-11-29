const express = require("express");
const router = express.Router();

const User = require("../Models/user.model");

router.post("/login", async (req, res) => {
  const userEmail = req.body.email;
  const userPass = req.body.password;
  const user = await User.findOne({ email: userEmail });

  if (user != null) {
    if (userPass === user.password) {
      const token = user.generateAuthToken();
      user.authTokens.push(token);
      res.header("x-user-auth-token", token);
      res.status(200).send();
    } else res.status(401).send("Error");
  } else res.status(401).send("Error");
});

router.patch('/edit', async (req, res) => {
  const userEmail = req.body.Email;
  const userPass = req.body.password;
  const user = await User.findOne({email: userEmail});

  user.userEmail = userEmail;
  user.userPass = userPass;

  const response = await user.save();
  res.status(200).send(response);
});

module.exports = router;
