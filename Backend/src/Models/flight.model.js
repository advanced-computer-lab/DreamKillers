const mongoose = require("mongoose"); //

// call DB and connect

const flightSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  economySeats: { type: Number, required: true },
  businessSeats: { type: Number, required: true },
  arrivalTerminal: { type: String, required: true },
  departureTerminal: { type: String, required: true },
  baggageAllowance: { type: String, required: true },
});

const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight;
