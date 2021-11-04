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
import FlightCard from "./FlightCard/FlightCard";

export default function FlightContainer() {
  const flight1 = {
    flightNumber: 1,
    departureTime: "23-12-2000",
    arrivalTime: "23-12-2001",
    economySeats: 21,
    businessSeats: 12,
    arrivalTerminal: "CAI",
    departureTerminal: "RYD",
  };

  const flight2 = {
    flightNumber: 2,
    departureTime: "23-12-2000",
    arrivalTime: "23-12-2001",
    economySeats: 21,
    businessSeats: 12,
    arrivalTerminal: "CAI",
    departureTerminal: "BUX",
  };

  const flights = [flight1, flight2];
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 380,
        maxHeight: 500,
        overflow: "auto",
        bgcolor: "black",
      }}
    >
      <nav aria-label="main mailbox folders">
        <List>
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
                  />
                </ListItem>
              </div>
            );
          })}
        </List>
      </nav>
    </Box>
  );
}
