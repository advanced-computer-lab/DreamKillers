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

router.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const passportNumber = req.body.passportNumber;
  const age = req.body.age;
  const phoneNumber = req.body.phoneNumber;

  if (!name || !email || !password || !passportNumber || !age || !phoneNumber) {
    return res.status(400).send("Missing parameter");
  }

  const userDuplicate = await User.findOne({
    $or: [
      { email: email },
      { passportNumber: passportNumber },
      { phoneNumber: phoneNumber },
    ],
  });

  if (userDuplicate) {
    return res.status(409).send();
  }

  const user = new User({
    name: name,
    email: email,
    password: password,
    passportNumber: passportNumber,
    age: age,
    phoneNumber: phoneNumber,
  });

  try {
    const response = await user.save();
    return res.status(201).send(response);
  } catch (e) {
    return res.status(400).send();
  }
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

router.patch("/editPassword", async (req, res) => {
  const oldPass = req.body.oldPassword;
  const newPass = req.body.newPassword;
  const user = await User.findOne({ _id: "617dbe3c2f88f3eba1dd02bb" });

  if (user != null) {
    if (oldPass === user.password) {
      user.password = newPass;
      const response = await user.save();
      return res.status(200).send(response);
    } else {
      return res.status(401).send();
    }
  } else {
    return res.status(401).send();
  }
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
