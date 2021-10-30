const express = require('express');
const router = express.Router() ;
const Flight = require('../Models/flight.model');


router.post ('/', async (req,res) => {
    const flightNumber = req.body.flightNumber;
    const departureTime = req.body.departureTime;
    const arrivalTime = req.body.arrivalTime ;
    const economySeats = req.body.economySeats;
    const businessSeats= req.body.businessSeats;
    const airportTerminal = req.body.airportTerminal;
    const flight = new Flight({
        flightNumber:flightNumber,
        departureTime:departureTime,
        arrivalTime:arrivalTime,
        economySeats:economySeats,
        businessSeats:businessSeats,
        airportTerminal:airportTerminal
    })

    const result = await flight.save();
    res.status(201).send(result);
} ) ;
