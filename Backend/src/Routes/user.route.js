const express = require("express");
const FlightReservation = require("../Models/flightReservation.model");
const RevokedUserToken = require("../Models/revokedUserToken.model");
const router = express.Router();

const User = require("../Models/user.model");
const userAuth = require("../Middleware/userAuth");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const userEmail = req.body.email;
  const userPass = req.body.password;
  const user = await User.findOne({ email: userEmail });

  const hashedPassword = user.password;
  const passwordMatch = bcrypt.compareSync(userPass, hashedPassword);

  if (user != null) {
    if (passwordMatch) {
      const token = user.generateAuthToken();
      res.header("user-token", token);
      res.status(200).send();
    } else res.status(401).send("Error");
  } else res.status(401).send("Error");
});

router.post("/logout", userAuth, async (req, res) => {
  const revokedToken = new RevokedUserToken({
    token: req.header("user-token"),
  });
  const result = await revokedToken.save();

  if (!result) return res.status(400).send();

  return res.status(200).send();
});

router.get("/", userAuth, async (req, res) => {
  const userID = req.user._id;
  const user = await User.findOne({ _id: userID });
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
  const homeAddress = req.body.homeAddress;
  const countryCode = req.body.countryCode;

  if (
    !name ||
    !email ||
    !password ||
    !passportNumber ||
    !age ||
    !phoneNumber ||
    !homeAddress ||
    !countryCode
  ) {
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

  const salt = bcrypt.genSaltSync(10);
  hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    passportNumber: passportNumber,
    age: age,
    phoneNumber: phoneNumber,
    homeAddress: homeAddress,
    countryCode: countryCode,
  });

  try {
    const response = await user.save();
    return res.status(201).send(response);
  } catch (e) {
    return res.status(400).send();
  }
});

router.patch("/edit", userAuth, async (req, res) => {
  const userID = req.user._id;
  const userName = req.body.name;

  const userNewEmail = req.body.newEmail;

  const userNewPassportNumber = req.body.newPassportNumber;

  const userNewPhoneNumber = req.body.newPhoneNumber;

  const userAge = req.body.userAge;
  const user = await User.findOne({ _id: userID });

  const userDuplicate = await User.findOne({
    $or: [
      { email: userNewEmail },
      { passportNumber: userNewPassportNumber },
      { phoneNumber: userNewPhoneNumber },
    ],
  });

  if (userDuplicate) return res.status(409).send();
  if (userName) user.name = userName;
  if (userNewEmail) user.email = userNewEmail;
  if (userNewPassportNumber) user.passportNumber = userNewPassportNumber;
  if (userNewPhoneNumber) user.phoneNumber = userNewPhoneNumber;
  if (userAge) user.age = userAge;

  const response = await user.save();
  res.status(200).send(response);
});

router.patch("/editPassword", userAuth, async (req, res) => {
  const oldPass = req.body.oldPassword;
  const newPass = req.body.newPassword;
  const userID = req.user._id;
  const user = await User.findOne({ _id: userID });

  const oldHashedPassword = user.password;
  const passwordMatch = bcrypt.compareSync(oldPass, oldHashedPassword);

  if (user != null) {
    if (passwordMatch) {
      const salt = bcrypt.genSaltSync(10);
      newHashedPassword = await bcrypt.hash(newPass, salt);
      user.password = newHashedPassword;
      const response = await user.save();
      return res.status(200).send(response);
    } else {
      return res.status(401).send();
    }
  } else {
    return res.status(401).send();
  }
});

router.get("/reservations", userAuth, async (req, res) => {
  const userID = req.user._id;
  const reservations = await FlightReservation.find({ user: userID }).populate(
    "departureFlight returnFlight"
  );

  if (!reservations) return res.status(404).send();

  return res.status(200).send(reservations);
});

module.exports = router;
