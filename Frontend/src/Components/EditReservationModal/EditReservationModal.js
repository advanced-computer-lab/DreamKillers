import React from "react";
import FlightSearchModal from "../FlightSearchModal/FlightSearchModal";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonDK from "../ButtonDK/ButtonDK";
import DeleteIcon from "@mui/icons-material/Delete";
import UserFlightSearch from "../UserFlightSearch/UserFlightSearch";
import { useEffect, useState } from "react";
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
import { Alert, Table, TableCell, TableRow } from "@mui/material";
import FlightCardTwo from "../../Components/FlightCardTwo/FlightCardTwo";
import SeatsModal from "../../Components/SeatsModal/SeatsModal";
import Footer from "../../Components/Footer/Footer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import Styles from "./EditReservationModal.module.css";

export default function EditReservationModal({ reservationID, refreshFunc }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleTotalClose = () => {
    setOpen(false);
    reset();
  };

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
      .patch(`http://localhost:8000/flights/editReservation/${reservationID}`, {
        departureFlight: departureFlight,
        returnFlight: returnFlight,
        cabinClass: cabinClass,
        passengersNumber: passengerNum,
        price:
          passengerNum * departureFlight.price +
          childrenNum * 0.25 * departureFlight.price +
          (passengerNum * returnFlight.price +
            childrenNum * 0.25 * returnFlight.price),
        user: "617dbe3c2f88f3eba1dd02bb",
        depSeats: depSeats.sort().toString(),
        returnSeats: returnSeats.sort().toString(),
      })
      .then((res) => {
        console.log(res.status);
        if (res.status == 201)
          displaySnackBar("Your flight is successfully Edited");
      });
    reset();
    refreshFunc();
    handleTotalClose();
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

  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackBarText, setSnackBarText] = React.useState();

  const handleClose = () => {
    setOpenSnack(false);
  };

  const displaySnackBar = (message) => {
    setSnackBarText(message);
    setOpenSnack(true);
  };

  return (
    <div>
      <ButtonDK
        buttonText={"Edit"}
        textColor="white"
        icon={<EditIcon />}
        hoverColor="darkOrange"
        color="orange"
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleTotalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">{"Title"}</DialogTitle>
        <DialogContent sx={{ width: 750 }}>
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
        </DialogContent>
        <DialogActions>
          <ButtonDK
            buttonText="Cancel"
            textColor="white"
            color="red"
            hoverColor="black"
            onClick={handleTotalClose}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
