const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  economySeats: { type: Number, required: true },
  businessSeats: { type: Number, required: true },
  arrivalTerminal: { type: String, required: true },
  departureTerminal: { type: String, required: true },
  baggageAllowance: { type: String, default: "40" },
  price: { type: String, default: "200" },
  reservedSeats: {
    type: Array,
    default: [
      [
        {
          id: 1,
          number: 1,
          tooltip: "Business Class",
        },
        { id: 2, number: 2, tooltip: "Business Class" },
        null,
        {
          id: 3,
          number: "3",
          isReserved: true,
          occupied: true,
          orientation: "east",
          tooltip: "Business Class: Reserved",
        },
        {
          id: 4,
          number: "4",
          orientation: "west",
          tooltip: "Business Class",
        },
        null,
        { id: 5, number: 5, tooltip: "Business Class" },
        { id: 6, number: 6, tooltip: "Business Class" },
      ],
      [
        {
          id: 7,
          number: 1,
          isReserved: true,
          occupied: true,
          tooltip: "Business Class: Reserved",
        },
        {
          id: 8,
          number: 2,
          isReserved: true,
          occupied: true,
          tooltip: "Business Class: Reserved",
        },
        null,
        {
          id: 9,
          number: "3",
          isReserved: true,
          occupied: true,
          orientation: "east",
          tooltip: "Business Class: Reserved",
        },
        {
          id: 10,
          number: "4",
          orientation: "west",
          tooltip: "Business Class",
        },
        null,
        { id: 11, number: 5, tooltip: "Business Class" },
        { id: 12, number: 6, tooltip: "Business Class" },
      ],
      [
        { id: 13, number: 1, tooltip: "Economy Class" },
        { id: 14, number: 2, tooltip: "Economy Class" },
        null,
        {
          id: 15,
          number: 3,
          isReserved: true,
          occupied: true,
          orientation: "east",
          tooltip: "Economy Class, Reserved",
        },
        {
          id: 16,
          number: "4",
          orientation: "west",
          tooltip: "Economy Class, cost: 13$",
        },
        null,
        { id: 17, number: 5, tooltip: "Economy Class" },
        { id: 18, number: 6, tooltip: "Economy Class" },
      ],
      [
        { id: 19, number: 1, tooltip: "Economy Class" },
        { id: 20, number: 2, tooltip: "Economy Class" },
        null,
        {
          id: 21,
          number: 3,
          orientation: "east",
          tooltip: "Economy Class",
        },
        {
          id: 22,
          number: "4",
          orientation: "west",
          tooltip: "Economy Class",
        },
        null,
        { id: 23, number: 5, tooltip: "Economy Class" },
        { id: 24, number: 6, tooltip: "Economy Class" },
      ],
      [
        {
          id: 25,
          number: 1,
          isReserved: true,
          occupied: true,
          tooltip: "Economy Class, Reserved",
        },
        {
          id: 26,
          number: 2,
          orientation: "east",
          tooltip: "Economy Class",
        },
        null,
        {
          id: 27,
          number: "3",
          isReserved: true,
          occupied: true,
          tooltip: "Economy Class: Reserved",
        },
        {
          id: 28,
          number: "4",
          orientation: "west",
          tooltip: "Economy Class",
        },
        null,
        { id: 29, number: 5, tooltip: "Economy Class" },
        {
          id: 30,
          number: 6,
          isReserved: true,
          occupied: true,
          tooltip: "Economy Class: Reserved",
        },
      ],
    ],
  },
});

const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight;
