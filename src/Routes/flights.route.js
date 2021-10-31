const express = require("express");
const router = express.Router();
const Flight = require("../Models/flight.model");

router.patch("/:flightId", async (req, res) => {
  const departureTime = req.body.departureTime;
  const arrivalTime = req.body.arrivalTime;
  const airportTerminal = req.body.airportTerminal;

  const flight = await Flight.findById(req.params.flightId);

  if (!flight) throw new Exception("Flight Not Found");

  flight.departureTime = departureTime;
  flight.arrivalTime = arrivalTime;
  flight.airportTerminal = airportTerminal;

  const response = await flight.save();

  res.status(200).send(response);
});

router.delete("/:flightId", async (req, res) => {
  const flight = await Flight.findById(req.params.flightId);
  if (!flight) throw new Exception("Flight Not Found");

  const response = await Flight.findOneAndDelete({_id:flightId});
});

router.post("/", async (req, res) => {
  const flightNumber = req.body.flightNumber;
  const departureTime = req.body.departureTime;
  const arrivalTime = req.body.arrivalTime;
  const economySeats = req.body.economySeats;
  const businessSeats = req.body.businessSeats;
  const airportTerminal = req.body.airportTerminal;

  const flight = new Flight({
    flightNumber: flightNumber,
    departureTime: departureTime,
    arrivalTime: arrivalTime,
    economySeats: economySeats,
    businessSeats: businessSeats,
    airportTerminal: airportTerminal,
  });

  const result = await flight.save();
  res.status(201).send(result);
});

router.get("/", async (req, res) => {
  const flights = await Flight.find({});

  res.status(200).send(flights);
});

module.exports = router;
