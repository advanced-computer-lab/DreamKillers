const { query } = require("express");
const express = require("express");
const router = express.Router();
const Flight = require("../Models/flight.model");

router.patch("/:flightId", async (req, res) => {
  const flightNumber = req.body.flightNumber;
  const businessSeats = req.body.businessSeats;
  const economySeats = req.body.economySeats;
  const departureTime = req.body.departureTime;
  const arrivalTime = req.body.arrivalTime;
  const arrivalTerminal = req.body.arrivalTerminal;
  const departureTerminal = req.body.departureTerminal;
  const baggageAllowance = req.body.baggageAllowance;

  const flight = await Flight.findById(req.params.flightId);

  if (!flight) throw new Exception("Flight Not Found");

  if (flight.departureTime) flight.departureTime = departureTime;
  if (flight.arrivalTime) flight.arrivalTime = arrivalTime;
  if (flight.arrivalTerminal) flight.arrivalTerminal = arrivalTerminal;
  if (flight.departureTerminal) flight.departureTerminal = departureTerminal;
  if (flight.flightNumber) flight.flightNumber = flightNumber;
  if (flight.businessSeats) flight.businessSeats = businessSeats;
  if (flight.economySeats) flight.economySeats = economySeats;
  if (flight.baggageAllowance) flight.baggageAllowance = baggageAllowance;

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
  const baggageAllowance = req.body.baggageAllowance;

  const flight = new Flight({
    flightNumber: flightNumber,
    departureTime: departureTime,
    arrivalTime: arrivalTime,
    economySeats: economySeats,
    businessSeats: businessSeats,
    arrivalTerminal: arrivalTerminal,
    departureTerminal: departureTerminal,
    baggageAllowance: baggageAllowance,
  });

  const result = await flight.save();
  if (result) res.status(201).send(result);
  else res.status(400).send();
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
  let baggageAllowance = req.body.baggageAllowance;
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

  if(
    baggageAllowance != "" && 
    baggageAllowance!= undefined && 
    baggageAllowance!= "__"
  )
  queryObj["baggageAllowance"] = baggageAllowance;

  const result = await Flight.find(queryObj);

  res.send(result);
});

module.exports = router;
