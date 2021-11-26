const express = require("express");
const router = express.Router();
const Flight = require("../Models/flight.model");

router.post("/search", async (req, res) => {
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

module.exports = router;
