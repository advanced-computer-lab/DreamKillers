import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import ButtonDK from "../ButtonDK/ButtonDK";
import Styles from "./FlightCardTwo.module.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

export default function FlightCardTwo({ flight, button, width, icon }) {
  return (
    <div>
      <div className={Styles.FlightCardContainer}>
        <Card sx={{ maxWidth: width, borderRadius: 3, border: 1 }}>
          <CardContent>
            <Typography className={Styles.FlightCardDescription}>
              {icon}
              <div style={{ fontSize: 25 }}>
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
              <div>Baggage Allowanace {" " + flight.baggageAllowance}</div>
              <br></br>
              <div className={Styles.ButtonsContainer}></div>
            </Typography>
          </CardContent>
          <CardActions style={{ backgroundColor: "orange" }}>
            {button}
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
