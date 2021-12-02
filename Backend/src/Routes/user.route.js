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
  const userEmail = req.body.email;
  const userPass = req.body.password;
  const userPassportNumber = req.body.passportNumber;
  const userPhoneNumber = req.body.phoneNumber;
  const userAge = req.body.userAge;
  const user = await User.findOne({email: userEmail});

  const userDuplicate = await User.find({
    $or: [
      { 'email': req.body.email },
      { 'passportNumber': req.body.passportNumber },
      { 'phoneNumber': req.body.phoneNumber }
    ]
  });

  if (userDuplicate) return res.status(409).send();

  user.userEmail = userEmail;
  user.userPass = userPass;
  user.passportNumber = passportNumber;
  user.phoneNumber = phoneNumber;
  user.userAge = userAge;

  const response = await user.save();
  res.status(200).send(response);
});

module.exports = router;
