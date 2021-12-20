const mongoose = require("mongoose");

const flightReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  departureFlight: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Flight",
  },
  returnFlight: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Flight",
  },
  cabinClass: {
    type: String,
    enum: ["Economy", "Bussiness"],
    required: true,
  },
  passengersNumber: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  returnSeats: {
    type: String,
    required: true,
  },
  departureSeats: {
    type: String,
    required: true,
  },
});

const FlightReservation = mongoose.model(
  "FlightReservation",
  flightReservationSchema
);
module.exports = FlightReservation;
