const mongoose = require("mongoose");
const flightModel = require("../Models/flight.model.js");
const express = require('express'),
    router = express.Router();

router.get('/',async (req,res)=>{
    let flightNumber = req.body.flightNumber;
    let departure = req.body.departure;
    let arrivalTime = req.body.arrivalTime; 
    let dates = req.body.dates;
    let economySeats = req.body.economySeats;
    let businessSeats = req.body.businessSeats;
    let airport = req.body.airport
    let queryObj = {};

    
    if(flightNumber != '' && flightNumber != undefined )
        queryObj['flightNumber'] = flightNumber
    if(departure != '' && departure != undefined)
        queryObj['departureTime'] = departure
    if(arrivalTime != '' && arrivalTime != undefined)
        queryObj['arrivalTime'] = arrivalTime
    if(dates != '' && dates != undefined)
        queryObj[''] = dates
    if(economySeats != '' && economySeats != undefined)
        queryObj['economySeats'] = economySeats
    if(businessSeats != '' && businessSeats != undefined)
        queryObj['businessSeats'] = businessSeats
    if(airport != '' && airport != undefined)
        queryObj['airportTerminal'] = airport

    const query =await flightModel.find(queryObj);
    
      console.log(queryObj);
      console.log(query);
      res.send(query);


       
  })


module.exports = router;