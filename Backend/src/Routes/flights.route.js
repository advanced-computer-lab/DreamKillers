const { query } = require("express");
const express = require("express");
const router = express.Router();
const Flight = require("../Models/flight.model");

router.patch("/:flightId", async (req, res) => {
  const departureTime = req.body.departureTime;
  const arrivalTime = req.body.arrivalTime;
  const arrivalTerminal = req.body.arrivalTerminal;
  const departureTerminal = req.body.departureTerminal;

  const flight = await Flight.findById(req.params.flightId);

  if (!flight) throw new Exception("Flight Not Found");

  flight.departureTime = departureTime;
  flight.arrivalTime = arrivalTime;
  flight.arrivalTerminal = arrivalTerminal;
  flight.departureTerminal = departureTerminal;

  const response = await flight.save();

  res.status(200).send(response);
});

router.delete("/:flightId", async (req, res) => {
  const flight = await Flight.findById(req.params.flightId);
  if (!flight) throw new Exception("Flight Not Found");

  const response = await Flight.findOneAndDelete({ _id: req.params.flightId });

  if (response) res.status(202).send();
});

router.post("/", async (req, res) => {
  const flightNumber = req.body.flightNumber;
  const departureTime = req.body.departureTime;
  const arrivalTime = req.body.arrivalTime;
  const economySeats = req.body.economySeats;
  const businessSeats = req.body.businessSeats;
  const arrivalTerminal = req.body.arrivalTerminal;
  const departureTerminal = req.body.departureTerminal;

  const flight = new Flight({
    flightNumber: flightNumber,
    departureTime: departureTime,
    arrivalTime: arrivalTime,
    economySeats: economySeats,
    businessSeats: businessSeats,
    arrivalTerminal: arrivalTerminal,
    departureTerminal: departureTerminal,
  });

  const result = await flight.save();
  res.status(201).send(result);
});

router.get("/", async (req, res) => {
  const flights = await Flight.find({});

  res.status(200).send(flights);
});

router.post("/search", async (req, res) => {
  let flightNumber = req.body.flightNumber;
  let arrivalTime = req.body.arrivalTime;
  let departureTime = req.body.departureTime;
  let economySeats = req.body.economySeats;
  let businessSeats = req.body.businessSeats;
  let arrivalTerminal = req.body.arrivalTerminal;
  let departureTerminal = req.body.departureTerminal;
  let queryObj = {};

  if (flightNumber != "" && flightNumber != undefined)
    queryObj["flightNumber"] = flightNumber;
  if (departureTime != "" && departureTime != undefined)
    queryObj["departureTime"] = departureTime;
  if (arrivalTime != "" && arrivalTime != undefined)
    queryObj["arrivalTime"] = arrivalTime;
  if (economySeats != "" && economySeats != undefined)
    queryObj["economySeats"] = economySeats;
  if (businessSeats != "" && businessSeats != undefined)
    queryObj["businessSeats"] = businessSeats;
  if (
    departureTerminal != "" &&
    departureTerminal != undefined &&
    departureTerminal != "___"
  )
    queryObj["departureTerminal"] = departureTerminal;
  if (
    arrivalTerminal != "" &&
    arrivalTerminal != undefined &&
    arrivalTerminal != "___"
  )

    queryObj["arrivalTerminal"] = arrivalTerminal;

  const result = await Flight.find(queryObj);

  res.send(result);
});

module.exports = router;
