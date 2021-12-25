import * as React from "react";
import Typography from "@mui/material/Typography";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import Styles from "./BookedFlightCard.module.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function BookedFlightCard({
  flight,
  cabinClass,
  button,
  width,
  icon,
  seats,
  price,
  seatsButton,
}) {
  const getDuration = (date1, date2) => {
    var difference = Math.abs(new Date(date1) - new Date(date2));
    let hours = difference / (1000 * 3600);
    let min = (hours % 1) * 60;
    hours = Math.floor(hours);
    min = Math.floor(min);
    return hours + "h " + min + "m";
  };

  const getSeats = () => {
    let res = "";

    seats.sort().forEach((seat) => {
      res += seat + ",";
    });
    return res.substring(0, res.length - 1);
  };

  return (
    <div className={Styles.FlightCardContainer}>
      {icon}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Flight Number & Cabin Class</TableCell>
              <TableCell align="center">Trip Duration</TableCell>
              <TableCell align="center">Departure Time</TableCell>
              <TableCell align="center">Arrival Time</TableCell>
              <TableCell align="center">Baggage Allowance</TableCell>
              {seats != null ? (
                <TableCell align="center">Seats</TableCell>
              ) : null}
              <TableCell align="center">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={flight.flightNumber}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center" component="th" scope="row">
                {flight.flightNumber +
                  (cabinClass == "Bussiness" ? " B" : " E")}
              </TableCell>
              <TableCell align="center">
                {getDuration(flight.arrivalTime, flight.departureTime)}
              </TableCell>
              <TableCell align="center">
                {new Date(flight.departureTime).toDateString() +
                  " " +
                  new Date(flight.departureTime).toLocaleTimeString()}
              </TableCell>
              <TableCell align="center">
                {"\n" +
                  new Date(flight.arrivalTime).toDateString() +
                  " " +
                  new Date(flight.arrivalTime).toLocaleTimeString()}
              </TableCell>
              <TableCell align="center">{flight.baggageAllowance}</TableCell>
              {seats != null ? (
                <TableCell align="center">{getSeats()}</TableCell>
              ) : null}

              <TableCell align="center">{flight.price}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div className={Styles.ButtonsContainer}>
        {button}
        <div className={Styles.Button2}>{seatsButton}</div>
      </div>
    </div>
  );
}
