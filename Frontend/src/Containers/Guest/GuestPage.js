import * as React from "react";
import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import FlightContainer from "../../Components/FlightContainer/FlightContainer";
import Styles from "./GuestPage.module.css";
import FlightEditModal from "../../Components/FlightEditModal/FlightEditModal";
import ToolBarDK from "../../Components/ToolBarDK/ToolBarDK";
import FlightSearchModal from "../../Components/FlightSearchModal/FlightSearchModal";
import UserFlightSearch from "../../Components/UserFlightSearch/UserFlightSearch";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import DashboardListItemDK from "../../Components/DashBoardListItemDK/DashboardListItemDK";
import axios from "axios";
import { useEffect, useState } from "react";
import FlightCard from "../../Components/FlightCard/FlightCard";
import FlightCardTwo from "../../Components/FlightCardTwo/FlightCardTwo";

const GuestPage = () => {
  const [flights, setFlights] = useState([]);

  const search = (data) => {
    setFlights(data);
    console.log(flights);
  };

  const reset = () => {
    setFlights([]);
  };

  return (
    <div>
      <ToolBarDK>
        <DashboardListItemDK
          listItemText="Flights"
          listItemIcon={<FontAwesomeIcon icon={faPlane} color={"white"} />}
          INDEX={0}
        />
        <DashboardListItemDK
          listItemText="Profile"
          listItemIcon={<FontAwesomeIcon icon={faPlane} color={"white"} />}
          INDEX={2}
        />
      </ToolBarDK>
      <br></br>
      <div className={Styles.Container}>
        <div className={Styles.ButtonsContainer}>
          <UserFlightSearch search={search} reset={reset} />
          <br></br>
        </div>
        <div className={Styles.Flights}>
          {flights.map((flight) => {
            return (
              <FlightCardTwo
                flightNumber={flight.flightNumber}
                departureTime={flight.departureTime}
                arrivalTime={flight.arrivalTime}
                economySeats={flight.economySeats}
                businessSeats={flight.businessSeats}
                arrivalTerminal={flight.arrivalTerminal}
                departureTerminal={flight.departureTerminal}
                flightID={flight._id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GuestPage;
