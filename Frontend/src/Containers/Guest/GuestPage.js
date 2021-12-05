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
import BookedFlightCard from "../../Components/BookedFlightCard/BookedFlightCard";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";
import { Table, TableCell, TableRow } from "@mui/material";
import Footer from "../../Components/Footer/Footer";

const GuestPage = () => {
  const [flights, setFlights] = useState([]);
  const [departureFlight, setDepartureFlight] = useState({});
  const [returnFlights, setReturnFlights] = useState([]);
  const [returnFlight, setReturnFlight] = useState({});
  const [bookedDep, setBookedDep] = useState(false);
  const [bookedReturn, setBookedReturn] = useState(false);
  const [passengerNum, setPassengerNum] = useState(0);
  const [childrenNum, setChildrenNum] = useState(0);
  const [cabinClass, setCabinClass] = useState(0);

  const search = (data, num, children, cabin) => {
    setFlights(data);
    setPassengerNum(num);
    setChildrenNum(children);
    setCabinClass(cabin);
    setBookedDep(false);
    setBookedReturn(false);
    console.log(flights);
  };

  const reset = () => {
    setFlights([]);
    setDepartureFlight({});
    setReturnFlight({});
    setBookedReturn(false);
    setBookedDep(false);
  };

  const bookDeparture = (flight) => {
    setDepartureFlight(flight);
    setBookedDep(true);
    console.log("depart", departureFlight);
    axios
      .post("http://localhost:8000/userFlights/searchOnReturn", {
        flight: flight,
        noOfPassengers: passengerNum,
        cabinClass: cabinClass,
      })
      .then((res) => {
        setReturnFlights(res.data);
        console.log(res.data);
      });
  };

  const bookReturn = (flight) => {
    setReturnFlight(flight);
    setBookedReturn(true);
    console.log(departureFlight);
  };

  return (
    <div className={Styles.mainDiv}>
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
        {!bookedDep ? (
          <div className={Styles.Flights}>
            <Table>
              {flights
                .reduce(function (
                  accumulator,
                  currentValue,
                  currentIndex,
                  array
                ) {
                  if (currentIndex % 2 === 0)
                    accumulator.push(
                      array.slice(currentIndex, currentIndex + 2)
                    );
                  return accumulator;
                },
                [])
                .map((doubleFlight) => {
                  return (
                    <TableRow>
                      {doubleFlight.map((flight) => {
                        return (
                          <TableCell>
                            <FlightCardTwo
                              flight={flight}
                              button={
                                <ButtonDK
                                  buttonText="Book"
                                  color="#1976D2"
                                  textColor="white"
                                  hoverColor="#1564b3"
                                  onClick={() => {
                                    bookDeparture(flight);
                                  }}
                                />
                              }
                              width={345}
                            />
                          </TableCell>
                        );
                      })}{" "}
                    </TableRow>
                  );
                })}
            </Table>
          </div>
        ) : null}
        {bookedDep && departureFlight != {} ? (
          <div>
            <BookedFlightCard
              flight={departureFlight}
              width={800}
              icon={<AirplaneTicketOutlinedIcon className={Styles.icon} />}
            />
          </div>
        ) : null}
        <div>
          {bookedDep && !bookedReturn ? (
            <div className={Styles.Flights}>
              <Table>
                {returnFlights
                  .reduce(function (
                    accumulator,
                    currentValue,
                    currentIndex,
                    array
                  ) {
                    if (currentIndex % 2 === 0)
                      accumulator.push(
                        array.slice(currentIndex, currentIndex + 2)
                      );
                    return accumulator;
                  },
                  [])
                  .map((doubleFlight) => {
                    return (
                      <TableRow>
                        {doubleFlight.map((flight) => {
                          return (
                            <TableCell>
                              <FlightCardTwo
                                flight={flight}
                                button={
                                  <ButtonDK
                                    buttonText="Book"
                                    color="#1976D2"
                                    textColor="white"
                                    hoverColor="#1564b3"
                                    onClick={() => {
                                      bookReturn(flight);
                                    }}
                                  />
                                }
                                width={345}
                              />
                            </TableCell>
                          );
                        })}{" "}
                      </TableRow>
                    );
                  })}
              </Table>
            </div>
          ) : null}
        </div>

        <div>
          {bookedReturn && returnFlight != {} ? (
            <div>
              <BookedFlightCard
                flight={returnFlight}
                width={800}
                icon={<AirplaneTicketOutlinedIcon className={Styles.icon} />}
              />
              <div className={Styles.loginButton}>
                <ButtonDK
                  buttonText="Login to Confirm"
                  color="#1976D2"
                  textColor="white"
                  hoverColor="#1564b3"
                  onClick={() => {
                    window.location.href =
                      "http://localhost:3000/user/dashboard";
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer className="site-footer" />
    </div>
  );
};

export default GuestPage;
