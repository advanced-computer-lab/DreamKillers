import * as React from "react";
import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import FlightContainer from "../../Components/FlightContainer/FlightContainer";
import Styles from "./UserPage.module.css";
import FlightEditModal from "../../Components/FlightEditModal/FlightEditModal";
import ToolBarDK from "../../Components/ToolBarDK/ToolBarDK";
import FlightSearchModal from "../../Components/FlightSearchModal/FlightSearchModal";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useEffect, useState } from "react";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faUser, faBook } from "@fortawesome/free-solid-svg-icons";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import BadgeIcon from "@mui/icons-material/Badge";
import UserEditModal from "../../Components/UserEditModal/UserEditModal.js";
import BookedFlightCard from "../../Components/BookedFlightCard/BookedFlightCard";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ReservationSummary from "../../Components/ReservationSummary/ReservationSummary";
import UserFlightSearch from "../../Components/UserFlightSearch/UserFlightSearch";
import { Alert, Table, TableCell, TableRow } from "@mui/material";
import Modal from "../../Components/Modal/Modal";
import FlightCardTwo from "../../Components/FlightCardTwo/FlightCardTwo";
import SeatsModal from "../../Components/SeatsModal/SeatsModal";
import Footer from "../../Components/Footer/Footer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserPage = () => {
  const [editTriggered, setEditTriggered] = React.useState(false);

  const onClickCancelReservation = (reservationID) => {
    axios
      .delete(`http://localhost:8000/flights/reservations/${reservationID}`)
      .then((res) => {
        getReservations();
        displaySnackBar("Your reservation was successfully cancelled");
      })
      .catch((e) => console.log(e));
  };

  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackBarText, setSnackBarText] = React.useState();

  const handleClose = () => {
    setOpenSnack(false);
  };

  const onAcceptEditOnClickHandler = (
    userName,
    Email,
    Password,
    passportNumber,
    Age,
    phoneNumber
  ) => {
    axios
      .patch(`http://localhost:8000/user/edit`, {
        name: userName,
        oldEmail: currentUser.email,
        newEmail: Email,
        password: Password,
        newPassportNumber: passportNumber,
        newPhoneNumber: phoneNumber,
        userAge: Age,
      })
      .then((res) => {
        setEditTriggered(!editTriggered);
        displaySnackBar("User information edited successfully");
      })
      .catch((e) => console.log(e));
  };
  let currentUser = {};
  useEffect(() => {
    axios
      .get(`http://localhost:8000/user`)
      .then((res) => {
        currentUser = res.data;
        fillUser();
      })
      .catch((e) => console.log(e));
  }, [editTriggered]);
  const fillUser = () => {
    setUserName(currentUser.name);
    setOldEmail(currentUser.email);
    setPassword(currentUser.password);
    setOldPassportNumber(currentUser.passportNumber);
    setAge(currentUser.age);
    setOldPhoneNumber(currentUser.phoneNumber);
  };

  const [userName, setUserName] = React.useState("");
  const [oldEmail, setOldEmail] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [oldPassportNumber, setOldPassportNumber] = React.useState("");
  const [passportNumber, setPassportNumber] = React.useState("");
  const [Age, setAge] = React.useState("");
  const [oldPhoneNumber, setOldPhoneNumber] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [reservations, setReservations] = React.useState([]);

  const [flights, setFlights] = useState([]);
  const [departureFlight, setDepartureFlight] = useState({});
  const [returnFlights, setReturnFlights] = useState([]);
  const [returnFlight, setReturnFlight] = useState({});
  const [bookedDep, setBookedDep] = useState(false);
  const [bookedReturn, setBookedReturn] = useState(false);
  const [passengerNum, setPassengerNum] = useState(0);
  const [childrenNum, setChildrenNum] = useState(0);
  const [cabinClass, setCabinClass] = useState(0);
  const [depSeats, setDepSeats] = useState([]);
  const [returnSeats, setReturnSeats] = useState([]);

  const search = (data, num, children, cabin) => {
    setFlights(data);
    setPassengerNum(num);
    setChildrenNum(children);
    setCabinClass(cabin);
    setBookedDep(false);
    setBookedReturn(false);
    console.log(flights);
  };

  const reserve = () => {
    axios
      .post("http://localhost:8000/flights/reserve", {
        departureFlight: departureFlight._id,
        returnFlight: returnFlight._id,
        cabinClass: cabinClass,
        passengersNumber: passengerNum,
        price:
          passengerNum * departureFlight.price +
          childrenNum * 0.25 * departureFlight.price +
          (passengerNum * returnFlight.price +
            childrenNum * 0.25 * returnFlight.price),
        user: "617dbe3c2f88f3eba1dd02bb",
        depSeats: depSeats.toString(),
        returnSeats: returnSeats.toString(),
      })
      .then((res) => {
        console.log(res.status);
        if (res.status == 201)
          displaySnackBar("Your flight is successfully reserved");
      });
    reset();
  };

  const displaySnackBar = (message) => {
    setSnackBarText(message);
    setOpenSnack(true);
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
    console.log(flight);
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

  const returnBookedDep = () => {
    setBookedReturn(false);
    setBookedDep(false);
  };

  const returnBookedReturn = () => {
    setBookedDep(true);
    setBookedReturn(false);
  };

  const getReservations = () => {
    axios
      .get("http://localhost:8000/user/reservations")
      .then((res) => {
        setReservations(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getReservations();
  }, [selectedTab]);

  return (
    <div className={Styles.mainDiv}>
      <ToolBarDK
        dashboard={"user"}
        dashBoardItemOnClick={(index) => {
          console.log(index);
          setSelectedTab(index);
        }}
        selectedTab={selectedTab}
      ></ToolBarDK>
      <div className={Styles.Flights}>
        {selectedTab == 2 ? (
          <>
            <div className={Styles.UserDisplay}>
              <div className={Styles.UserDetailsContainer}>
                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <FontAwesomeIcon icon={faUser} color={"black"} size="2x" />
                  </div>
                  <p className={Styles.Text}> User Name:</p>
                  <p className={Styles.ParText}> {userName}</p>
                </div>

                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <EmailIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> E-mail:</p>
                  <p className={Styles.ParText}> {oldEmail}</p>
                </div>

                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <VpnKeyIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> Password:</p>
                  <p className={Styles.ParText}> {Password}</p>
                </div>
              </div>

              <div className={Styles.UserDetailsContainer}>
                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <AirplaneTicketIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> Passport Number:</p>
                  <p className={Styles.ParText}> {oldPassportNumber}</p>
                </div>

                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <BadgeIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> Age:</p>
                  <p className={Styles.ParText}> {Age}</p>
                </div>

                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <PhoneIphoneIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> Phone Number:</p>
                  <p className={Styles.ParText}> {oldPhoneNumber}</p>
                </div>
              </div>
            </div>
            <div className={Styles.Edit}>
              <UserEditModal
                mainButtonText={"Edit"}
                mainButtonColor={"orange"}
                mainButtonTextColor={"black"}
                mainButtonHoverColor={"orange"}
                icon={<EditIcon />}
                acceptButtonText={"Edit"}
                title={"Edit the attributes of profile you want to edit"}
                userName={currentUser.name}
                onAcceptOnClickHandler={onAcceptEditOnClickHandler}
                Email={currentUser.email}
                Password={currentUser.password}
                passportNumber={currentUser.passportNumber}
                Age={currentUser.age}
                phoneNumber={currentUser.phoneNumber}
              ></UserEditModal>
            </div>
          </>
        ) : selectedTab == 1 ? (
          <>
            {reservations.map((res, index) => {
              return (
                <ReservationSummary
                  key={index}
                  reservationID={res._id}
                  reservationNumber={index + 1}
                  resPrice={res.price}
                  dfNumber={
                    res.departureFlight.flightNumber +
                    ` (${res.departureFlight.departureTerminal} > ${res.departureFlight.arrivalTerminal})`
                  }
                  dfDateTime={res.departureFlight.departureTime}
                  dfPrice={res.departureFlight.price}
                  rfNumber={
                    res.returnFlight.flightNumber +
                    ` (${res.returnFlight.departureTerminal} > ${res.returnFlight.arrivalTerminal})`
                  }
                  rfDateTime={res.returnFlight.departureTime}
                  rfPrice={res.returnFlight.price}
                  cabin={res.cabinClass}
                  dfSeats={res.departureSeats}
                  rfSeats={res.returnSeats}
                  acceptOnClickHandler={onClickCancelReservation}
                ></ReservationSummary>
              );
            })}
          </>
        ) : (
          <div>
            <div className={Styles.ButtonsContainer}>
              <UserFlightSearch search={search} reset={reset} />
              <br></br>
            </div>
            {!bookedDep ? (
              <div className={Styles.flightCards}>
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
                                {console.log(passengerNum)}
                                <FlightCardTwo
                                  flight={flight}
                                  button={
                                    <SeatsModal
                                      seatNumber={passengerNum}
                                      cabinClass={cabinClass}
                                      returnSeatsFunc={(seats) => {
                                        setDepSeats(seats);
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
                  width={850}
                  cabinClass={cabinClass}
                  icon={<AirplaneTicketOutlinedIcon className={Styles.icon} />}
                  seats={depSeats}
                  price={
                    passengerNum * departureFlight.price +
                    childrenNum * 0.25 * departureFlight.price
                  }
                  button={
                    <ButtonDK
                      variant="contained"
                      textColor="White"
                      color="black"
                      hoverColor="#545454"
                      onClick={returnBookedDep}
                      icon={<ArrowBackIcon />}
                    />
                  }
                  seatsButton={
                    <SeatsModal
                      seatNumber={passengerNum}
                      cabinClass={cabinClass}
                      returnSeatsFunc={(seats) => {
                        setDepSeats(seats);
                      }}
                      selectedSeats={depSeats.toString()}
                      modifiedButton={{
                        variant: "contained",
                        textColor: "White",
                        color: "Green",
                        hoverColor: "#545454",
                      }}
                    />
                  }
                />
                {console.log(depSeats.toString())}
              </div>
            ) : null}
            {bookedDep && !bookedReturn ? (
              <div>
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
                                    <SeatsModal
                                      seatNumber={passengerNum}
                                      cabinClass={cabinClass}
                                      returnSeatsFunc={(seats) => {
                                        setReturnSeats(seats);
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
            <div>
              {bookedReturn && returnFlight != {} ? (
                <div>
                  <BookedFlightCard
                    flight={returnFlight}
                    width={850}
                    cabinClass={cabinClass}
                    icon={
                      <AirplaneTicketOutlinedIcon className={Styles.icon} />
                    }
                    seats={returnSeats}
                    price={
                      passengerNum * returnFlight.price +
                      childrenNum * 0.25 * returnFlight.price
                    }
                    button={
                      <ButtonDK
                        variant="contained"
                        textColor="White"
                        color="black"
                        hoverColor="#545454"
                        onClick={returnBookedReturn}
                        icon={<ArrowBackIcon />}
                      />
                    }
                    seatsButton={
                      <SeatsModal
                        seatNumber={passengerNum}
                        cabinClass={cabinClass}
                        returnSeatsFunc={(seats) => {
                          setReturnSeats(seats);
                        }}
                        selectedSeats={returnSeats}
                        modifiedButton={{
                          variant: "contained",
                          textColor: "White",
                          color: "Green",
                          hoverColor: "#545454",
                        }}
                      />
                    }
                  />
                  <div className={Styles.loginButton}>
                    <ButtonDK
                      buttonText="Reserve"
                      color="orange"
                      textColor="black"
                      hoverColor="orange"
                      onClick={reserve}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      <Snackbar open={openSnack} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {snackBarText}
        </Alert>
      </Snackbar>
      <Footer />
    </div>
  );
};

export default UserPage;
