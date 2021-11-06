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

export default function FlightContainer({ flights }) {
  const [flights, setFlights] = React.useState([]);
  const [loadPage, setLoadPage] = React.useState(false);

  React.useEffect(() => {
    axios
      .get("http://localhost:8000/flights")
      .then((res) => {
        setFlights(res.data);
      })
      .catch((e) => console.log(e));
  }, [loadPage]);

  const deleteButtonOnClickHandler = (flightID) => {
    axios.delete(`http://localhost:8000/flights/${flightID}`).then((res) => {
      if (res.status == 202) {
        console.log("Deleted");
        setLoadPage(!loadPage);
      } else console.log("Not deleted");
    });
  };
  
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
                  departureTerminal={flight.departureTerminal
                  deleteButtonOnClick={deleteButtonOnClickHandler}}
                />
              </ListItem>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
