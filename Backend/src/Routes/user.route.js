const express = require("express");
const FlightReservation = require("../Models/flightReservation.model");
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

router.get("/", async (req, res) => {
  const user = await User.findOne({ _id: "617dbe3c2f88f3eba1dd02bb" });
  if (!user) return res.status(401).send("User Not Found");
  res.status(200).send(user);
});

router.patch("/edit", async (req, res) => {
  const userName = req.body.name;
  //const userOldEmail = "jirhwg@hotmail.com";
  const userNewEmail = req.body.newEmail;

  const userPass = req.body.password;

  const userNewPassportNumber = req.body.newPassportNumber;

  const userNewPhoneNumber = req.body.newPhoneNumber;

  const userAge = req.body.userAge;
  const user = await User.findOne({ _id: "617dbe3c2f88f3eba1dd02bb" });

  const userDuplicate = await User.findOne({
    $or: [
      { email: userNewEmail },
      { passportNumber: userNewPassportNumber },
      { phoneNumber: userNewPhoneNumber },
    ],
  });

  console.log(userNewEmail);

  if (userDuplicate) return res.status(409).send();

  if (userName) user.name = userName;
  if (userNewEmail) user.email = userNewEmail;
  if (userPass) user.password = userPass;
  if (userNewPassportNumber) user.passportNumber = userNewPassportNumber;
  if (userNewPhoneNumber) user.phoneNumber = userNewPhoneNumber;
  if (userAge) user.age = userAge;

  const response = await user.save();
  res.status(200).send(response);
});

router.get("/reservations", async (req, res) => {
  const userID = "617dbe3c2f88f3eba1dd02bb";
  const reservations = await FlightReservation.find({ user: userID }).populate(
    "departureFlight returnFlight"
  );

  if (!reservations) return res.status(404).send();

  return res.status(200).send(reservations);
});

module.exports = router;
