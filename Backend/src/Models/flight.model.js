const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  economySeats: { type: Number, required: true },
  businessSeats: { type: Number, required: true },
  arrivalTerminal: { type: String, required: true },
  departureTerminal: { type: String, required: true },
  baggageAllowance: { type: String, default:"40" },
});

const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight;
