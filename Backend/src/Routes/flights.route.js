const { query } = require("express");
const express = require("express");
const router = express.Router();
const Flight = require("../Models/flight.model");
const FlightReservation = require("../Models/flightReservation.model");
const User = require("../Models/user.model");
const nodemailer = require("nodemailer");

router.patch("/:flightId", async (req, res) => {
  const flightNumber = req.body.flightNumber;
  const businessSeats = req.body.businessSeats;
  const economySeats = req.body.economySeats;
  const departureTime = req.body.departureTime;
  const arrivalTime = req.body.arrivalTime;
  const arrivalTerminal = req.body.arrivalTerminal;
  const departureTerminal = req.body.departureTerminal;
  const baggageAllowance = req.body.baggageAllowance;

  const flight = await Flight.findById(req.params.flightId);

  if (!flight) throw new Exception("Flight Not Found");

  if (flight.departureTime) flight.departureTime = departureTime;
  if (flight.arrivalTime) flight.arrivalTime = arrivalTime;
  if (flight.arrivalTerminal) flight.arrivalTerminal = arrivalTerminal;
  if (flight.departureTerminal) flight.departureTerminal = departureTerminal;
  if (flight.flightNumber) flight.flightNumber = flightNumber;
  if (flight.businessSeats) flight.businessSeats = businessSeats;
  if (flight.economySeats) flight.economySeats = economySeats;
  if (flight.baggageAllowance) flight.baggageAllowance = baggageAllowance;

  const response = await flight.save();

  res.status(200).send(response);
});

router.delete("/:flightId", async (req, res) => {
  const flight = await Flight.findById(req.params.flightId);
  if (!flight) throw new Exception("Flight Not Found");

  const response = await Flight.findOneAndDelete({ _id: req.params.flightId });

  if (response) res.status(202).send();
});

router.post("/", async (req, res) => {
  const flightNumber = req.body.flightNumber;
  const departureTime = req.body.departureTime;
  const arrivalTime = req.body.arrivalTime;
  const economySeats = req.body.economySeats;
  const businessSeats = req.body.businessSeats;
  const arrivalTerminal = req.body.arrivalTerminal;
  const departureTerminal = req.body.departureTerminal;
  const baggageAllowance = req.body.baggageAllowance;

  const flight = new Flight({
    flightNumber: flightNumber,
    departureTime: departureTime,
    arrivalTime: arrivalTime,
    economySeats: economySeats,
    businessSeats: businessSeats,
    arrivalTerminal: arrivalTerminal,
    departureTerminal: departureTerminal,
    baggageAllowance: baggageAllowance,
  });

  const result = await flight.save();
  if (result) res.status(201).send(result);
  else res.status(400).send();
});

router.get("/", async (req, res) => {
  const flights = await Flight.find({});

  res.status(200).send(flights);
});

router.get("/getTerminals", async (req, res) => {
  const flights = await Flight.find({});
  let arrTerminals = [];
  let depTerminals = [];
  flights.filter((itm) => {
    arrTerminals.push(itm.arrivalTerminal);
    depTerminals.push(itm.departureTerminal);
  });
  arrTerminals = [...new Set(arrTerminals)];
  depTerminals = [...new Set(depTerminals)];
  arrTerminals.sort();
  depTerminals.sort();
  res.status(200).send({ arr: arrTerminals, dep: depTerminals });
});

router.post("/search", async (req, res) => {
  let flightNumber = req.body.flightNumber;
  let arrivalTime = req.body.arrivalTime;
  let departureTime = req.body.departureTime;
  let economySeats = req.body.economySeats;
  let businessSeats = req.body.businessSeats;
  let arrivalTerminal = req.body.arrivalTerminal;
  let departureTerminal = req.body.departureTerminal;

  let queryObj = {};

  if (flightNumber != "" && flightNumber != undefined)
    queryObj["flightNumber"] = flightNumber;
  if (departureTime != "" && departureTime != undefined)
    queryObj["departureTime"] = departureTime;
  if (arrivalTime != "" && arrivalTime != undefined)
    queryObj["arrivalTime"] = arrivalTime;
  if (economySeats != "" && economySeats != undefined)
    queryObj["economySeats"] = economySeats;
  if (businessSeats != "" && businessSeats != undefined)
    queryObj["businessSeats"] = businessSeats;
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

router.post("/reserve", async (req, res) => {
  const depFlight = req.body.departureFlight;
  const retFlight = req.body.returnFlight;
  const cabinClass = req.body.cabinClass;
  const passengersNumber = req.body.passengersNumber;
  const price = req.body.price;
  const userID = req.body.user;

  const flightReservation = new FlightReservation({
    departureFlight: depFlight,
    returnFlight: retFlight,
    user: userID,
    cabinClass: cabinClass,
    passengersNumber: passengersNumber,
    price: price,
  });
  await flightReservation.save();
  return res.status(201).send(flightReservation);
});

router.delete("/reservations/:reservationNumber", async (req, res) => {
  const reservation = await FlightReservation.findOne({
    _id: req.params.reservationNumber,
  }).populate("departureFlight returnFlight");

  if (!reservation) return res.status(400).send("Reservation not found");

  const departurePrice = reservation.departureFlight.price;
  const returnPrice = reservation.returnFlight.price;

  const totalPrice = reservation.price;

  const response = await FlightReservation.findOneAndDelete({
    _id: req.params.reservationNumber,
  });

  const user = await User.findById({ _id: "617dbe3c2f88f3eba1dd02bb" });

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dkairlinesguc@gmail.com", // MAIL REQUIRED
      pass: "DKairlines123", // PASS REQUIRED
    },
  });

  var mailOptions = {
    from: "dkairlinesguc@gmail.com",
    to: `${user.email}`,
    subject: "Reservation Cancel Invoice",
    html: `<div class="container bootdey">
    <div class="row invoice row-printable">
        <div class="col-md-10">
            <!-- col-lg-12 start here -->
            <div class="panel panel-default plain" id="dash_0">
                <!-- Start .panel -->
                <div class="panel-body p30">
                    <div class="row">
                        <!-- Start .row -->
                        <!-- col-lg-6 end here -->
                        <div class="col-lg-6">
                            <!-- col-lg-6 start here -->
                            <div class="invoice-from">
                                <ul class="list-unstyled text-right">
                                    <li>Dreamkillers Airlines</li>
                                    <li>2500 Ridgepoint Dr, Suite 105-C</li>
                                    <li>Austin TX 78754</li>
                                    <li>VAT Number EU826113958</li>
                                </ul>
                            </div>
                        </div>
                        <!-- col-lg-6 end here -->
                        <div class="col-lg-12">
                            <!-- col-lg-12 start here -->
                            <div class="invoice-details mt25">
                                <div class="well">
                                    <ul class="list-unstyled mb0">
                                        <li><strong>Invoice</strong> #936988</li>
                                        <li><strong>Invoice Date:</strong>${new Date()}</li>
                                        <li><strong>Status:</strong> <span class="label label-danger">CANCELED</span></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="invoice-to mt25">
                                <ul class="list-unstyled">
                                    <li><strong>Invoiced To</strong></li>
                                    <li>${user.name}</li>
                                    <li>${user.email}</li>
                                    <li>${user.passportNumber}</li>
                                </ul>
                            </div>
                            <div class="invoice-items">
                                <div class="table-responsive" style="overflow: hidden; outline: none;" tabindex="0">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th class="per70 text-center">Description</th>
                                                <th class="per5 text-center">Qty</th>
                                                <th class="per25 text-center">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Departure Flight</td>
                                                <td class="text-center">1</td>
                                                <td class="text-center">${departurePrice}</td>
                                            </tr>
                                            <tr>
                                                <td>Return Flight</td>
                                                <td class="text-center">1</td>
                                                <td class="text-center">${returnPrice}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colspan="2" class="text-right">Sub Total:</th>
                                                <th class="text-center">${totalPrice}</th>
                                            </tr>
                                            <tr>
                                                <th colspan="2" class="text-right">Credit:</th>
                                                <th class="text-center">$00.00 USD</th>
                                            </tr>
                                            <tr>
                                                <th colspan="2" class="text-right">Total:</th>
                                                <th class="text-center">${totalPrice}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div class="invoice-footer mt25">
                                <p class="text-center">Generated on ${new Date()}</p>
                            </div>
                        </div>
                        <!-- col-lg-12 end here -->
                    </div>
                    <!-- End .row -->
                </div>
            </div>
            <!-- End .panel -->
        </div>
        <!-- col-lg-12 end here -->
    </div>
    </div>`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return res.status(202).send(response);
});

module.exports = router;
