import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import ButtonDK from "../ButtonDK/ButtonDK";
import Styles from "./BookedFlightCard.module.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

export default function FlightCardTwo({
  flight,
  button,
  width,
  icon,
  seats,
  price,
}) {
  return (
    <div>
      <div className={Styles.FlightCardContainer}>
        <Card sx={{ maxWidth: width, bgcolor: "snow" }}>
          <CardContent>
            {icon}
            <Typography className={Styles.FlightCardDescription}>
              <div style={{ fontSize: 20 }}>
                {flight.departureTerminal}
                <ArrowRightAltOutlinedIcon />
                {flight.arrivalTerminal}
              </div>
              <div>Economy Seats: {flight.economySeats}</div>
              <div>Bussiness Seats: {flight.businessSeats}</div>
              <div>
                Leaves On:{" "}
                {new Date(flight.departureTime).toDateString() +
                  " " +
                  new Date(flight.departureTime).toLocaleTimeString()}
              </div>
              <div>
                Arrives On:
                {"\n" +
                  new Date(flight.arrivalTime).toDateString() +
                  " " +
                  new Date(flight.arrivalTime).toLocaleTimeString()}
              </div>
              <br></br>
              {seats == null || price == null ? null : (
                <div>
                  {" "}
                  Seats:{seats.toString()} Price: ${price}
                </div>
              )}
              <div> </div>
            </Typography>
          </CardContent>
          <CardActions>{button}</CardActions>
        </Card>
      </div>
    </div>
  );
}
