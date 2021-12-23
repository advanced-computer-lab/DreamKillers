const { query } = require("express");
const express = require("express");
const router = express.Router();
const Flight = require("../Models/flight.model");
const FlightReservation = require("../Models/flightReservation.model");
const User = require("../Models/user.model");
const fs = require("fs");
const nodemailer = require("nodemailer");
const userAuth = require("../Middleware/userAuth");

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

router.patch("/updateSeats/:flightId", async (req, res) => {
  const flight = await Flight.findById(req.params.flightId);
  const newSeats = req.body.newSeats;
  const cabinClass = req.body.cabinClass;
  const passengerNum = req.body.passengerNum;

  flight.reservedSeats = newSeats;
  if (cabinClass == "Economy") flight.economySeats -= passengerNum;
  else flight.businessSeats -= passengerNum;

  const response = await flight.save();

  res.status(200).send(response);
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

const getDuration = (date1, date2) => {
  var difference = Math.abs(new Date(date1) - new Date(date2));
  let hours = difference / (1000 * 3600);
  let min = (hours % 1) * 60;
  hours = Math.floor(hours);
  min = Math.floor(min);
  return hours + "h " + min + "m";
};

router.post("/reserve", userAuth, async (req, res) => {
  const depFlight = req.body.departureFlight;
  const retFlight = req.body.returnFlight;
  const cabinClass = req.body.cabinClass;
  const passengersNumber = req.body.passengersNumber;
  const price = req.body.price;
  const userID = req.user._id;
  const depSeats = req.body.depSeats;
  const returnSeats = req.body.returnSeats;
  const flightReservation = new FlightReservation({
    departureFlight: depFlight._id,
    returnFlight: retFlight._id,
    user: userID,
    cabinClass: cabinClass,
    passengersNumber: passengersNumber,
    price: price,
    returnSeats: returnSeats,
    departureSeats: depSeats,
  });
  await flightReservation.save();

  const user = await User.findById({ _id: userID });

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
    subject: "Reservation Invoice",
    html: `<!DOCTYPE html>
    <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
       <head>
          <title></title>
          <meta charset="utf-8"/>
          <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
          <!--[if mso]>
          <xml>
             <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                <o:AllowPNG/>
             </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <style>
             * {
             box-sizing: border-box;
             }
             body {
             margin: 0;
             padding: 0;
             }
             a[x-apple-data-detectors] {
             color: inherit !important;
             text-decoration: inherit !important;
             }
             #MessageViewBody a {
             color: inherit;
             text-decoration: none;
             }
             p {
             line-height: inherit
             }
             @media (max-width:720px) {
             .icons-inner {
             text-align: center;
             }
             .icons-inner td {
             margin: 0 auto;
             }
             .row-content {
             width: 100% !important;
             }
             .image_block img.big {
             width: auto !important;
             }
             .mobile_hide {
             display: none;
             }
             .stack .column {
             width: 100%;
             display: block;
             }
             .mobile_hide {
             min-height: 0;
             max-height: 0;
             max-width: 0;
             overflow: hidden;
             font-size: 0px;
             }
             }
          </style>
       </head>
       <body style="background-color: #f9f9f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
          <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f9f9f9;" width="100%">
          <tbody>
             <tr>
                <td>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="width:100%;padding-right:0px;padding-left:0px;">
                                                    <div align="center" style="line-height:10px"><img alt="Alternate text" class="big" src="cid:top" style="display: block; height: auto; border: 0; width: 700px; max-width: 100%;" title="Alternate text" width="700"/></div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:25px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #0b1560; line-height: 1.2;">
                                                          <p style="margin: 0; font-size: 16px; text-align: center;"><span style="font-size:42px;"><strong>HI ${
                                                            user.name
                                                          }</strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:25px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Your trip to <span style="color:#0b1560;"><strong>${
                                                            depFlight.departureTerminal
                                                          }</strong></span> starts on <span style="color:#0b1560;"><strong><span style="">${new Date(
      depFlight.departureTime
    ).toDateString()}</span></strong></span>. Make your trip easier, and check in online now for yourself and your travel companions. </span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:45px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #0b1560; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:24px;"><strong>YOUR TRIP</strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:55px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Your first flight from <span style="color:#800080;"><strong>${
                                                            depFlight.departureTerminal
                                                          }</strong></span> to <span style="color:#0b1560;"><strong>${
      depFlight.arrivalTerminal
    }</strong></span> departs at <span style="color:#0b1560;"><strong>${new Date(
      depFlight.departureTime
    ).toLocaleTimeString()}</strong></span></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:16px;">From</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-left:10px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            depFlight.departureTime
                                                          ).toLocaleTimeString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            depFlight.departureTime
                                                          ).toDateString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;font-size:16px;"><strong><span style="">${
                                                            depFlight.departureTerminal
                                                          }</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <div class="spacer_block" style="height:35px;line-height:30px;font-size:1px;"> </div>
                                           <div class="spacer_block mobile_hide" style="height:35px;line-height:35px;font-size:1px;"> </div>
                                           <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="width:100%;padding-right:0px;padding-left:0px;padding-bottom:40px;">
                                                    <div align="center" style="line-height:10px"><img alt="Alternate text" src="cid:plane" style="display: block; height: auto; border: 0; width: 50px; max-width: 100%;" title="Alternate text" width="50"/></div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:16px;">To</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-left:10px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            depFlight.arrivalTime
                                                          ).toLocaleTimeString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            depFlight.arrivalTime
                                                          ).toDateString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;font-size:16px;"><strong><span style="">${
                                                            depFlight.arrivalTerminal
                                                          }</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">

                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Trip Duration: ${getDuration(
                                                            depFlight.arrivalTime,
                                                            depFlight.departureTime
                                                          )}</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:40px;padding-left:30px;padding-right:30px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Travel Category: ${cabinClass}</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:16px;">From</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-left:10px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            retFlight.departureTime
                                                          ).toLocaleTimeString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            retFlight.departureTime
                                                          ).toDateString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;font-size:16px;"><strong><span style="">${
                                                            retFlight.departureTerminal
                                                          }</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <div class="spacer_block" style="height:35px;line-height:30px;font-size:1px;"> </div>
                                           <div class="spacer_block mobile_hide" style="height:35px;line-height:35px;font-size:1px;"> </div>
                                           <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="width:100%;padding-right:0px;padding-left:0px;padding-bottom:40px;">
                                                    <div align="center" style="line-height:10px"><img alt="Alternate text" src="cid:plane" style="display: block; height: auto; border: 0; width: 50px; max-width: 100%;" title="Alternate text" width="50"/></div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:16px;">To</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-left:10px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            retFlight.arrivalTime
                                                          ).toLocaleTimeString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            retFlight.arrivalTime
                                                          ).toDateString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;font-size:16px;"><strong><span style="">${
                                                            retFlight.arrivalTerminal
                                                          }</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">

                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Trip Duration: ${getDuration(
                                                            retFlight.arrivalTime,
                                                            retFlight.departureTime
                                                          )}</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:40px;padding-left:30px;padding-right:30px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Travel Category: ${cabinClass}</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="10" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td>
                                                    <div align="center">
                                                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="95%">
                                                          <tr>
                                                             <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DDE3E8;"><span> </span></td>
                                                          </tr>
                                                       </table>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:25px;padding-left:10px;padding-right:10px;padding-top:25px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #0b1560; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:24px;"><strong>Invoice</strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:25px;padding-right:10px;padding-top:20px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: left;"><span style="color:#000000;"><strong><span style="font-size:18px;">Total Price</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="color:#000000;text-align:center;font-family:inherit;font-size:14px;padding-bottom:5px;">
                                                    <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                       <tr>
                                                          <td style="text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;"><img align="center" class="icon" height="32" src="cid:depart" style="display: block; height: auto; border: 0;" width="32"/></td>
                                                       </tr>
                                                    </table>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:15px;padding-left:30px;padding-right:30px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;">
                                                          <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 27px;"><span style="font-size:15px;">${price} USD</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <div class="spacer_block" style="height:10px;line-height:10px;font-size:1px;"> </div>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <div class="spacer_block" style="height:10px;line-height:10px;font-size:1px;"> </div>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #0b1560; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <div class="spacer_block" style="height:25px;line-height:25px;font-size:1px;"> </div>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #0b1560; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
                                                          <p style="margin: 0; font-size: 18px; text-align: left;"><strong><span style="color:#ffffff;">Info</span></strong></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #C0C0C0; line-height: 1.2;">
                                                          <p style="margin: 0; mso-line-height-alt: 14.399999999999999px;"></p>
                                                          <p style="margin: 0; font-size: 14px; text-align: left;"><span style="color:#C0C0C0;font-size:12px;">Stay up-to-date with current activities and future events by following us on your favorite social media channels.</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="html_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td>
                                                    <div align="center" style="font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;text-align:center;">
                                                       <div style="height:20px;"> </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="social_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="padding-left:20px;text-align:left;padding-right:0px;">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="188px">
                                                       <tr>
                                                          <td style="padding:0 15px 0 0;"><a href="https://www.facebook.com/" target="_blank"><img alt="Facebook" height="32" src="cid:facebook" style="display: block; height: auto; border: 0;" title="Facebook" width="32"/></a></td>
                                                          <td style="padding:0 15px 0 0;"><a href="https://twitter.com/" target="_blank"><img alt="Twitter" height="32" src="cid:twitter" style="display: block; height: auto; border: 0;" title="Twitter" width="32"/></a></td>
                                                          <td style="padding:0 15px 0 0;"><a href="https://plus.google.com/" target="_blank"><img alt="Google+" height="32" src="cid:googleplus" style="display: block; height: auto; border: 0;" title="Google+" width="32"/></a></td>
                                                          <td style="padding:0 15px 0 0;"><a href="https://instagram.com/" target="_blank"><img alt="Instagram" height="32" src="cid:instagram" style="display: block; height: auto; border: 0;" title="Instagram" width="32"/></a></td>
                                                       </tr>
                                                    </table>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
                                                          <p style="margin: 0; font-size: 18px; text-align: left;"><strong><span style="color:#ffffff;">Contact Us</span></strong></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 18px; color: #C0C0C0; line-height: 1.5; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; mso-line-height-alt: 18px;"><span style="color:#C0C0C0;font-size:12px;">Company address here<br/>+1 123 123 123</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #C0C0C0; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0;"><span style="color:#C0C0C0;font-size:12px;">Changed your mind? <a href="{{ unsubscribe_link }}" style="color:#ffffff;" target="_blank">Unsubscribe</a> </span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #0b1560; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <div class="spacer_block" style="height:25px;line-height:25px;font-size:1px;"> </div>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-16" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="color:#9d9d9d;font-family:inherit;font-size:15px;padding-bottom:5px;padding-top:5px;text-align:center;">
                                                    <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                       <tr>
                                                          <td style="text-align:center;">
                                                             <!--[if vml]>
                                                             <table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                                                                <![endif]-->
                                                                <!--[if !vml]><!-->
                                                                <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                                                                   <!--<![endif]-->
                                                                   <tr>
                                                                      <td style="text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:6px;"><a href="https://www.designedwithbee.com/"><img align="center" alt="Designed with BEE" class="icon" height="32" src="cid:bee" style="display: block; height: auto; border: 0;" width="34"/></a></td>
                                                                      <td style="font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:15px;color:#9d9d9d;vertical-align:middle;letter-spacing:undefined;text-align:center;"><a href="https://www.designedwithbee.com/" style="color:#9d9d9d;text-decoration:none;">Designed with BEE</a></td>
                                                                   </tr>
                                                                </table>
                                                                </td>
                                                                </tr>
                                                             </table>
                                                          </td>
                                                       </tr>
                                                    </table>
                                                 </td>
                                              </tr>
                                              </tbody>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <!-- End -->
       </body>
    </html>`, //get from template
    attachments: [
      {
        filename: "bee.png",
        path: __dirname + "/images/bee.png",
        cid: "bee",
      },
      {
        filename: "depart.png",
        path: __dirname + "/images/depart.png",
        cid: "depart",
      },
      {
        filename: "facebook.png",
        path: __dirname + "/images/facebook.png",
        cid: "facebook",
      },
      {
        filename: "googleplus.png",
        path: __dirname + "/images/googleplus.png",
        cid: "googleplus",
      },
      {
        filename: "instagram.png",
        path: __dirname + "/images/instagram.png",
        cid: "instagram",
      },
      {
        filename: "plane.png",
        path: __dirname + "/images/plane.png",
        cid: "plane",
      },
      {
        filename: "top.png",
        path: __dirname + "/images/top.png",
        cid: "top",
      },
      {
        filename: "twitter.png",
        path: __dirname + "/images/twitter.png",
        cid: "twitter",
      },
    ],
  };

  //   await transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log("Email sent: " + info.response);
  //     }
  //   });

  return res.status(201).send(flightReservation);
});

router.patch("/editReservation/:reservationNumber", async (req, res) => {
  const reservation = await FlightReservation.findOne({
    _id: req.params.reservationNumber,
  });

  const depFlight = req.body.departureFlight;
  const retFlight = req.body.returnFlight;
  const cabinClass = req.body.cabinClass;
  const passengersNumber = req.body.passengersNumber;
  const price = req.body.price;
  const depSeats = req.body.depSeats;
  const returnSeats = req.body.returnSeats;

  reservation.departureFlight = depFlight._id;
  reservation.returnFlight = retFlight._id;
  reservation.cabinClass = cabinClass;
  reservation.passengersNumber = passengersNumber;
  reservation.price = price;
  reservation.returnSeats = returnSeats;
  reservation.departureSeats = depSeats;

  const response = await reservation.save();

  const user = await User.findById({ _id: reservation.user });

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
    subject: "Reservation Invoice",
    html: `<!DOCTYPE html>
    <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
       <head>
          <title></title>
          <meta charset="utf-8"/>
          <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
          <!--[if mso]>
          <xml>
             <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                <o:AllowPNG/>
             </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <style>
             * {
             box-sizing: border-box;
             }
             body {
             margin: 0;
             padding: 0;
             }
             a[x-apple-data-detectors] {
             color: inherit !important;
             text-decoration: inherit !important;
             }
             #MessageViewBody a {
             color: inherit;
             text-decoration: none;
             }
             p {
             line-height: inherit
             }
             @media (max-width:720px) {
             .icons-inner {
             text-align: center;
             }
             .icons-inner td {
             margin: 0 auto;
             }
             .row-content {
             width: 100% !important;
             }
             .image_block img.big {
             width: auto !important;
             }
             .mobile_hide {
             display: none;
             }
             .stack .column {
             width: 100%;
             display: block;
             }
             .mobile_hide {
             min-height: 0;
             max-height: 0;
             max-width: 0;
             overflow: hidden;
             font-size: 0px;
             }
             }
          </style>
       </head>
       <body style="background-color: #f9f9f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
          <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f9f9f9;" width="100%">
          <tbody>
             <tr>
                <td>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="width:100%;padding-right:0px;padding-left:0px;">
                                                    <div align="center" style="line-height:10px"><img alt="Alternate text" class="big" src="cid:top" style="display: block; height: auto; border: 0; width: 700px; max-width: 100%;" title="Alternate text" width="700"/></div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:25px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #0b1560; line-height: 1.2;">
                                                          <p style="margin: 0; font-size: 16px; text-align: center;"><span style="font-size:42px;"><strong>HI ${
                                                            user.name
                                                          }</strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:25px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Your trip to <span style="color:#0b1560;"><strong>${
                                                            depFlight.departureTerminal
                                                          }</strong></span> starts on <span style="color:#0b1560;"><strong><span style="">${new Date(
      depFlight.departureTime
    ).toDateString()}</span></strong></span>. Make your trip easier, and check in online now for yourself and your travel companions. </span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:45px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #0b1560; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:24px;"><strong>YOUR TRIP</strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:55px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Your first flight from <span style="color:#800080;"><strong>${
                                                            depFlight.departureTerminal
                                                          }</strong></span> to <span style="color:#0b1560;"><strong>${
      depFlight.arrivalTerminal
    }</strong></span> departs at <span style="color:#0b1560;"><strong>${new Date(
      depFlight.departureTime
    ).toLocaleTimeString()}</strong></span></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:16px;">From</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-left:10px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            depFlight.departureTime
                                                          ).toLocaleTimeString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            depFlight.departureTime
                                                          ).toDateString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;font-size:16px;"><strong><span style="">${
                                                            depFlight.departureTerminal
                                                          }</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <div class="spacer_block" style="height:35px;line-height:30px;font-size:1px;"> </div>
                                           <div class="spacer_block mobile_hide" style="height:35px;line-height:35px;font-size:1px;"> </div>
                                           <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="width:100%;padding-right:0px;padding-left:0px;padding-bottom:40px;">
                                                    <div align="center" style="line-height:10px"><img alt="Alternate text" src="cid:plane" style="display: block; height: auto; border: 0; width: 50px; max-width: 100%;" title="Alternate text" width="50"/></div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:16px;">To</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-left:10px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            depFlight.arrivalTime
                                                          ).toLocaleTimeString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            depFlight.arrivalTime
                                                          ).toDateString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;font-size:16px;"><strong><span style="">${
                                                            depFlight.arrivalTerminal
                                                          }</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">

                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Trip Duration: ${getDuration(
                                                            depFlight.arrivalTime,
                                                            depFlight.departureTime
                                                          )}</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:40px;padding-left:30px;padding-right:30px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Travel Category: ${cabinClass}</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:16px;">From</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-left:10px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            retFlight.departureTime
                                                          ).toLocaleTimeString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            retFlight.departureTime
                                                          ).toDateString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;font-size:16px;"><strong><span style="">${
                                                            retFlight.departureTerminal
                                                          }</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <div class="spacer_block" style="height:35px;line-height:30px;font-size:1px;"> </div>
                                           <div class="spacer_block mobile_hide" style="height:35px;line-height:35px;font-size:1px;"> </div>
                                           <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="width:100%;padding-right:0px;padding-left:0px;padding-bottom:40px;">
                                                    <div align="center" style="line-height:10px"><img alt="Alternate text" src="cid:plane" style="display: block; height: auto; border: 0; width: 50px; max-width: 100%;" title="Alternate text" width="50"/></div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:16px;">To</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-left:10px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            retFlight.arrivalTime
                                                          ).toLocaleTimeString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;"><strong><span style="font-size:18px;">${new Date(
                                                            retFlight.arrivalTime
                                                          ).toDateString()}</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="color:#000000;font-size:16px;"><strong><span style="">${
                                                            retFlight.arrivalTerminal
                                                          }</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">

                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Trip Duration: ${getDuration(
                                                            retFlight.arrivalTime,
                                                            retFlight.departureTime
                                                          )}</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:40px;padding-left:30px;padding-right:30px;padding-top:5px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">Travel Category: ${cabinClass}</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="10" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td>
                                                    <div align="center">
                                                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="95%">
                                                          <tr>
                                                             <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DDE3E8;"><span> </span></td>
                                                          </tr>
                                                       </table>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:25px;padding-left:10px;padding-right:10px;padding-top:25px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #0b1560; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:24px;"><strong>Invoice</strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:5px;padding-left:25px;padding-right:10px;padding-top:20px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: left;"><span style="color:#000000;"><strong><span style="font-size:18px;">Total Price</span></strong></span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="color:#000000;text-align:center;font-family:inherit;font-size:14px;padding-bottom:5px;">
                                                    <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                       <tr>
                                                          <td style="text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;"><img align="center" class="icon" height="32" src="cid:depart" style="display: block; height: auto; border: 0;" width="32"/></td>
                                                       </tr>
                                                    </table>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:15px;padding-left:30px;padding-right:30px;padding-top:15px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;">
                                                          <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 27px;"><span style="font-size:15px;">${price} USD</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <div class="spacer_block" style="height:10px;line-height:10px;font-size:1px;"> </div>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebedff; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <div class="spacer_block" style="height:10px;line-height:10px;font-size:1px;"> </div>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #0b1560; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <div class="spacer_block" style="height:25px;line-height:25px;font-size:1px;"> </div>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #0b1560; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
                                                          <p style="margin: 0; font-size: 18px; text-align: left;"><strong><span style="color:#ffffff;">Info</span></strong></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #C0C0C0; line-height: 1.2;">
                                                          <p style="margin: 0; mso-line-height-alt: 14.399999999999999px;"></p>
                                                          <p style="margin: 0; font-size: 14px; text-align: left;"><span style="color:#C0C0C0;font-size:12px;">Stay up-to-date with current activities and future events by following us on your favorite social media channels.</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="html_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td>
                                                    <div align="center" style="font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;text-align:center;">
                                                       <div style="height:20px;"> </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="social_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="padding-left:20px;text-align:left;padding-right:0px;">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="188px">
                                                       <tr>
                                                          <td style="padding:0 15px 0 0;"><a href="https://www.facebook.com/" target="_blank"><img alt="Facebook" height="32" src="cid:facebook" style="display: block; height: auto; border: 0;" title="Facebook" width="32"/></a></td>
                                                          <td style="padding:0 15px 0 0;"><a href="https://twitter.com/" target="_blank"><img alt="Twitter" height="32" src="cid:twitter" style="display: block; height: auto; border: 0;" title="Twitter" width="32"/></a></td>
                                                          <td style="padding:0 15px 0 0;"><a href="https://plus.google.com/" target="_blank"><img alt="Google+" height="32" src="cid:googleplus" style="display: block; height: auto; border: 0;" title="Google+" width="32"/></a></td>
                                                          <td style="padding:0 15px 0 0;"><a href="https://instagram.com/" target="_blank"><img alt="Instagram" height="32" src="cid:instagram" style="display: block; height: auto; border: 0;" title="Instagram" width="32"/></a></td>
                                                       </tr>
                                                    </table>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
                                                          <p style="margin: 0; font-size: 18px; text-align: left;"><strong><span style="color:#ffffff;">Contact Us</span></strong></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 18px; color: #C0C0C0; line-height: 1.5; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0; mso-line-height-alt: 18px;"><span style="color:#C0C0C0;font-size:12px;">Company address here<br/>+1 123 123 123</span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                           <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                              <tr>
                                                 <td style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
                                                    <div style="font-family: sans-serif">
                                                       <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #C0C0C0; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">
                                                          <p style="margin: 0;"><span style="color:#C0C0C0;font-size:12px;">Changed your mind? <a href="{{ unsubscribe_link }}" style="color:#ffffff;" target="_blank">Unsubscribe</a> </span></p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #0b1560; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <div class="spacer_block" style="height:25px;line-height:25px;font-size:1px;"> </div>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-16" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                         <tr>
                            <td>
                               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
                                  <tbody>
                                     <tr>
                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                           <table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                              <tr>
                                                 <td style="color:#9d9d9d;font-family:inherit;font-size:15px;padding-bottom:5px;padding-top:5px;text-align:center;">
                                                    <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                       <tr>
                                                          <td style="text-align:center;">
                                                             <!--[if vml]>
                                                             <table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                                                                <![endif]-->
                                                                <!--[if !vml]><!-->
                                                                <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                                                                   <!--<![endif]-->
                                                                   <tr>
                                                                      <td style="text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:6px;"><a href="https://www.designedwithbee.com/"><img align="center" alt="Designed with BEE" class="icon" height="32" src="cid:bee" style="display: block; height: auto; border: 0;" width="34"/></a></td>
                                                                      <td style="font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:15px;color:#9d9d9d;vertical-align:middle;letter-spacing:undefined;text-align:center;"><a href="https://www.designedwithbee.com/" style="color:#9d9d9d;text-decoration:none;">Designed with BEE</a></td>
                                                                   </tr>
                                                                </table>
                                                                </td>
                                                                </tr>
                                                             </table>
                                                          </td>
                                                       </tr>
                                                    </table>
                                                 </td>
                                              </tr>
                                              </tbody>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                   <!-- End -->
       </body>
    </html>`, //get from template
    attachments: [
      {
        filename: "bee.png",
        path: __dirname + "/images/bee.png",
        cid: "bee",
      },
      {
        filename: "depart.png",
        path: __dirname + "/images/depart.png",
        cid: "depart",
      },
      {
        filename: "facebook.png",
        path: __dirname + "/images/facebook.png",
        cid: "facebook",
      },
      {
        filename: "googleplus.png",
        path: __dirname + "/images/googleplus.png",
        cid: "googleplus",
      },
      {
        filename: "instagram.png",
        path: __dirname + "/images/instagram.png",
        cid: "instagram",
      },
      {
        filename: "plane.png",
        path: __dirname + "/images/plane.png",
        cid: "plane",
      },
      {
        filename: "top.png",
        path: __dirname + "/images/top.png",
        cid: "top",
      },
      {
        filename: "twitter.png",
        path: __dirname + "/images/twitter.png",
        cid: "twitter",
      },
    ],
  };

  //   await transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log("Email sent: " + info.response);
  //     }
  //   });

  return res.status(201).send(response);
});

const removeBookedSeats = (onFlightSeats, bookedSeats) => {
  let seatsArr = bookedSeats.split(",");

  seatsArr.forEach((seat) => {
    let row = seat.substr(0, 1).charCodeAt(0) - 65;
    let col = parseInt(seat.substring(1));

    switch (col) {
      case 1:
        col = 0;
        break;
      case 2:
        col = 1;
        break;
      case 3:
        col = 3;
        break;
      case 4:
        col = 4;
        break;
      case 5:
        col = 6;
        break;
      case 6:
        col = 7;
        break;
    }

    onFlightSeats[row][col].isReserved = false;
    onFlightSeats[row][col]["occupied"] = false;
    onFlightSeats[row][col]["tooltip"] =
      row >= 2 ? "Economy Class" : "Bussiness Class";
  });

  return onFlightSeats;
};

router.delete(
  "/reservations/:reservationNumber",
  userAuth,
  async (req, res) => {
    const userID = req.user._id;
    const reservation = await FlightReservation.findOne({
      _id: req.params.reservationNumber,
    }).populate("departureFlight returnFlight");

    if (!reservation) return res.status(400).send("Reservation not found");

    const departurePrice = reservation.departureFlight.price;
    const returnPrice = reservation.returnFlight.price;

    const departureFlight = await Flight.findById(
      reservation.departureFlight._id
    );
    const returnFlight = await Flight.findById(reservation.returnFlight._id);

    departureFlight.reservedSeats = removeBookedSeats(
      departureFlight.reservedSeats,
      reservation.departureSeats
    );

    returnFlight.reservedSeats = removeBookedSeats(
      returnFlight.reservedSeats,
      reservation.returnSeats
    );

    if (reservation.cabinClass == "Economy") {
      departureFlight.economySeats +=
        reservation.departureSeats.split(",").length;
      returnFlight.economySeats += reservation.departureSeats.split(",").length;
    } else {
      departureFlight.businessSeats +=
        reservation.departureSeats.split(",").length;
      returnFlight.businessSeats +=
        reservation.departureSeats.split(",").length;
    }

    await departureFlight.save();
    await returnFlight.save();

    const totalPrice = reservation.price;

    const response = await FlightReservation.findOneAndDelete({
      _id: req.params.reservationNumber,
    });

    const user = await User.findById({ _id: userID });

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

    //  await transporter.sendMail(mailOptions, function (error, info) {
    //    if (error) {
    //      console.log(error);
    //    } else {
    //      console.log("Email sent: " + info.response);
    //    }
    //  });

    return res.status(202).send(response);
  }
);

module.exports = router;
