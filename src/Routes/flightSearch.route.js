const mongoose = require("mongoose");
//const flightModel = require("../Models/flightModel.js");
const express = require('express'),
    router = express.Router();

router.get('/',async (req,res)=>{
    // let flightNumber = req.body.flightNumber;
    // let departure = req.body.departure;
    // let arrivalTime = req.body.arrivalTime; 
    // let dates = req.body.dates;
    // let economySeats = req.body.economySeats;
    // let businessSeats = req.body.businessSeats;
    // let airport = req.body.airport
    // let queryObj = {};

    
    // if(flightNumber != '')
    //     queryObj['flightNumber'] = flightNumber
    // if(departure != '')
    //     queryObj['departureTime'] = departure
    // if(arrivalTime != '')
    //     queryObj['arrivalTime'] = arrivalTime
    // if(dates != '')
    //     queryObj[''] = dates
    // if(economySeats != '')
    //     queryObj['economySeats'] = economySeats
    // if(businessSeats != '')
    //     queryObj['businessSeats'] = businessSeats
    // if(airport != '')
    //     queryObj['airportTerminal.33.'] = airport

    // const query = flightModel.findOne(queryObj);
    // query.exec(function (err, flight) {
    //     if (err) return handleError(err);

    //     console.log(flight);
    //     res.send(flight);
    //   });
    console.log(req.body);
    res.status(200).send(req.body);
  })


module.exports = router;