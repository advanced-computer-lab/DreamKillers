const express = require("express");
const router = express.Router();
const Flight = require("../Models/flight.model");

router.post("/searchOnDepart", async (req, res) => {
  let noOfPassengers = req.body.noOfPassengers; //needs to be required from front end
  let dateOne = req.body.dateOne;
  let dateTwo = req.body.dateTwo;
  let cabinClass = req.body.cabinClass; //1 => econ, 2 => bussiness, 0 => not selected
  let arrivalTerminal = req.body.arrivalTerminal;
  let departureTerminal = req.body.departureTerminal;
  let queryObj = {};

  //0 option could be removed from front end (requiring cabin class)
  if (cabinClass == 1) {
    //economy
    if (noOfPassengers != "" && noOfPassengers != undefined)
      queryObj["economySeats"] = { $gte: noOfPassengers };
  } else if (cabinClass == 2) {
    //bussiness
    if (noOfPassengers != "" && noOfPassengers != undefined)
      queryObj["businessSeats"] = { $gte: noOfPassengers };
  } else {
    //if undecided look for either
    if (noOfPassengers != "" && noOfPassengers != undefined) {
      queryObj["$or"] = [
        { economySeats: { $gte: noOfPassengers } },
        { businessSeats: { $gte: noOfPassengers } },
      ];
    }
  }

  let dateOneObj = {};
  let dateTwoObj = {};
  console.log(dateOne);
  if (dateOne != "" && dateOne != undefined) {
    dateOne = new Date(dateOne);
    dateOneObj = { $gte: dateOne };
  }
  if (dateTwo != "" && dateTwo != undefined) {
    dateTwo = new Date(dateTwo);
    dateTwoObj = { $lte: dateTwo };
  }

  if (dateOneObj != {} || dateTwoObj != {})
    queryObj["departureTime"] = Object.assign(dateOneObj, dateTwoObj);

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

router.post("/searchOnReturn", async (req, res) => {
  let flight = req.body.flight;
  let noOfPassengers = req.body.noOfPassengers;
  let dateOne = flight.arrivalTime;
  let cabinClass = req.body.cabinClass; //1 => econ, 2 => bussiness, 0 => not selected
  let arrivalTerminal = flight.departureTerminal;
  let departureTerminal = flight.arrivalTerminal;
  let queryObj = {};

  //0 option could be removed from front end (requiring cabin class)
  if (cabinClass == 1) {
    //economy
    if (noOfPassengers != "" && noOfPassengers != undefined)
      queryObj["economySeats"] = { $gte: noOfPassengers };
  } else if (cabinClass == 2) {
    //bussiness
    if (noOfPassengers != "" && noOfPassengers != undefined)
      queryObj["businessSeats"] = { $gte: noOfPassengers };
  } else {
    //if undecided look for either
    if (noOfPassengers != "" && noOfPassengers != undefined) {
      queryObj["$or"] = [
        { economySeats: { $gte: noOfPassengers } },
        { businessSeats: { $gte: noOfPassengers } },
      ];
    }
  }

  if (dateOne != "" && dateOne != undefined) {
    dateOne = new Date(dateOne);
    queryObj["departureTime"] = { $gt: dateOne };
  }

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

router.get("/:flightId", async (req, res) => {
  const flight = await Flight.findById(req.params.flightId);

  if (!flight) throw new Exception("Flight Not Found");

  res.status(200).send(flight);
});

module.exports = router;
