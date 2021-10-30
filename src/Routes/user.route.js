const express = require("express");
const router = express.Router();

const User = require("../Models/user.model");

router.post("/Login", async (req, res) => {
  const userEmail = req.body.email;
  const userPass = req.body.password;
  const user = await User.findOne({ email: userEmail });

  if (user != null) {
    if (userPass === user.password) {
      const token = user.generateAuthToken();
      user.authTokens.push(token);
      res.header("x-user-auth-token", token);
      res.status(200).send();
    } else res.send("Error");
  } else res.send("Error");
});
module.exports = router;
