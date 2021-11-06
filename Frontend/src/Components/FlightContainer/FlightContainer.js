import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import FlightCard from "../FlightCard/FlightCard";
import Styles from "./FlightContainer.module.css";
import { margin } from "@mui/system";
const axios = require("axios");

export default function FlightContainer({ flights, deleteFlight }) {
  return (
    <div
      className={Styles.Container}
      style={{ maxHeight: 500, overflow: "auto" }}
    >
      <nav>
        {flights.map((flight) => {
          return (
            <div>
              <ListItem disablePadding>
                <FlightCard
                  flightNumber={flight.flightNumber}
                  departureTime={flight.departureTime}
                  arrivalTime={flight.arrivalTime}
                  economySeats={flight.economySeats}
                  businessSeats={flight.businessSeats}
                  arrivalTerminal={flight.arrivalTerminal}
                  departureTerminal={flight.departureTerminal}
                  flightID={flight._id}
                  deleteButtonOnClick={deleteFlight}
                />
              </ListItem>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
