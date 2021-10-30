const express = require("express");
const router = express.Router();
//const Flight = require("../Models/flight.model");

// router.get("/", async (req, res) => {
//   const flights = await Flight.find({});

//   res.status(200).send(flights);
// });

router.post("/", (req, res) => {
  const flightNumber = req.body.flightNumber;
  res.status(200).send(req.body);
});

module.exports = router;
