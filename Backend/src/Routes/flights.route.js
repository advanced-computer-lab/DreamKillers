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

  const response = await Flight.findOneAndDelete({ _id: flightId });
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

router.post("/search", async (req, res) => {
  let flightNumber = req.body.flightNumber;
  let departure = req.body.departure;
  let arrivalTime = req.body.arrivalTime;
  let dates = req.body.dates;
  let economySeats = req.body.economySeats;
  let businessSeats = req.body.businessSeats;
  let arrivalTerminal = req.body.arrivalTerminal;
  let departureTerminal = req.body.departureTerminal;
  let queryObj = {};

  if (flightNumber != "" && flightNumber != undefined)
    queryObj["flightNumber"] = flightNumber;
  if (departure != "" && departure != undefined)
    queryObj["departureTime"] = departure;
  if (arrivalTime != "" && arrivalTime != undefined)
    queryObj["arrivalTime"] = arrivalTime;
  if (dates != "" && dates != undefined) queryObj[""] = dates;
  if (economySeats != "" && economySeats != undefined)
    queryObj["economySeats"] = economySeats;
  if (businessSeats != "" && businessSeats != undefined)
    queryObj["businessSeats"] = businessSeats;
  if (departureTerminal != "" && departureTerminal != undefined)
    queryObj["departureTerminal"] = departureTerminal;
  if (arrivalTerminal != "" && arrivalTerminal != undefined)
    queryObj["arrivalTerminal"] = arrivalTerminal;  

  const result = await Flight.find(queryObj);

  res.send(result);
});

module.exports = router;
