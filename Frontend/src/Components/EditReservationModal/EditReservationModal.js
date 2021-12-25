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
import PaymentModal from "../../Containers/Payment/PaymentModal";

export default function EditReservationModal({
  reservationID,
  refreshFunc,
  userName,
  dfseats,
  rfseats,
  previouseDeparture,
  previousReturn,
  email,
  originalPrice,
}) {
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
  const [reservedDepSeats, setReservedDepSeats] = useState([]);
  const [reservedReturnSeats, setReservedReturnSeats] = useState([]);

  const search = (data, num, children, cabin) => {
    setFlights(data);
    setPassengerNum(num);
    setChildrenNum(children);
    setCabinClass(cabin);
    setBookedDep(false);
    setBookedReturn(false);
    console.log(flights);
  };

  const removeBookedSeats = (onFlightSeats, bookedSeats) => {
    let seatsArr = bookedSeats.split(",");

    console.log("HERE");
    seatsArr.forEach((seat) => {
      let row = seat.substr(0, 1).charCodeAt(0) - 65;
      let col = parseInt(seat.substring(1));

      switch (col) {
        case 1:
          col = 0;
          break;
        case 2:
          col = 1;
          break;
        case 3:
          col = 3;
          break;
        case 4:
          col = 4;
          break;
        case 5:
          col = 6;
          break;
        case 6:
          col = 7;
          break;
      }
      console.log(onFlightSeats[row][col]);
      let newToolTip = onFlightSeats[row][col]["tooltip"].split(" ");

      onFlightSeats[row][col].isReserved = false;
      onFlightSeats[row][col]["occupied"] = false;
      onFlightSeats[row][col]["tooltip"] =
        row >= 2 ? "Economy Class" : "Bussiness Class";
    });

    return onFlightSeats;
  };

  const computeSeats = (seats, reservedSeats) => {
    seats.forEach((seat) => {
      let row = seat.substr(0, 1).charCodeAt(0) - 65;
      let col = parseInt(seat.substring(1));

      switch (col) {
        case 1:
          col = 0;
          break;
        case 2:
          col = 1;
          break;
        case 3:
          col = 3;
          break;
        case 4:
          col = 4;
          break;
        case 5:
          col = 6;
          break;
        case 6:
          col = 7;
          break;
      }

      console.log(row, reservedSeats);

      reservedSeats[row][col].isReserved = true;
      reservedSeats[row][col]["occupied"] = true;
      reservedSeats[row][col]["tooltip"] = "Reserved";
    });
    return reservedSeats;
  };

  const updateSeats = (flightId, seats, newPasseneger) => {
    axios.patch(`http://localhost:8000/flights//updateSeats/${flightId}`, {
      newSeats: seats,
      cabinClass: cabinClass,
      passengerNum: newPasseneger,
    });
  };

  const getPrice = () => {
    return (
      passengerNum * departureFlight.price +
      childrenNum * 0.25 * departureFlight.price +
      (passengerNum * returnFlight.price +
        childrenNum * 0.25 * returnFlight.price)
    );
  };

  const reserve = (invoice) => {
    const token = localStorage.getItem("user-token");

    axios
      .patch(
        `http://localhost:8000/flights/editReservation/${reservationID}`,
        {
          departureFlight: departureFlight,
          returnFlight: returnFlight,
          cabinClass: cabinClass,
          passengersNumber: passengerNum,
          price: getPrice(),
          depSeats: depSeats.sort().toString(),
          returnSeats: returnSeats.sort().toString(),
        },
        {
          headers: {
            "user-token": token,
          },
        }
      )
      .then((res) => {
        openInvoice(invoice);
        updateSeats(
          departureFlight._id,
          computeSeats(depSeats.sort(), reservedDepSeats),
          dfseats.split(",").lengh - passengerNum
        );
        console.log(reservedDepSeats, reservedReturnSeats);
        updateSeats(
          returnFlight._id,
          computeSeats(returnSeats.sort(), reservedReturnSeats),
          rfseats.split(",").lengh - passengerNum
        );
        if (previouseDeparture._id != departureFlight._id)
          updateSeats(
            previouseDeparture._id,
            removeBookedSeats(previouseDeparture.reservedSeats, dfseats),
            -1 * passengerNum
          );
        if (previousReturn._id != returnFlight._id)
          updateSeats(
            previousReturn._id,
            removeBookedSeats(previousReturn.reservedSeats, rfseats),
            -1 * passengerNum
          );

        console.log(res.status);
        if (res.status == 201)
          displaySnackBar("Your flight is successfully Edited");
        refreshFunc();
      });
    reset();
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

  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoice, setInvoice] = useState("");

  const CloseInvoice = () => {
    setInvoiceOpen(false);
  };

  const openInvoice = (msg) => {
    setInvoiceOpen(true);
    setInvoice(msg);
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
                                {console.log(
                                  "condition",
                                  flight._id == previouseDeparture._id,
                                  flight,
                                  previouseDeparture
                                )}
                                <FlightCardTwo
                                  flight={flight}
                                  button={
                                    flight._id == previouseDeparture._id ? (
                                      <SeatsModal
                                        seatNumber={passengerNum}
                                        cabinClass={cabinClass}
                                        returnSeatsFunc={(seats) => {
                                          setDepSeats(seats);
                                          bookDeparture(flight);
                                        }}
                                        rowProp={removeBookedSeats(
                                          flight.reservedSeats,
                                          dfseats
                                        )}
                                        setSeatRows={setReservedReturnSeats}
                                      />
                                    ) : (
                                      <SeatsModal
                                        seatNumber={passengerNum}
                                        cabinClass={cabinClass}
                                        returnSeatsFunc={(seats) => {
                                          setDepSeats(seats);
                                          bookDeparture(flight);
                                        }}
                                        rowProp={flight.reservedSeats}
                                        setSeatRows={setReservedReturnSeats}
                                      />
                                    )
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
                      rowProp={departureFlight.reservedSeats}
                      setSeatRows={setReservedDepSeats}
                    />
                  }
                />
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
                                    flight._id == previousReturn._id ? (
                                      <SeatsModal
                                        seatNumber={passengerNum}
                                        cabinClass={cabinClass}
                                        returnSeatsFunc={(seats) => {
                                          setReturnSeats(seats);
                                          bookReturn(flight);
                                        }}
                                        rowProp={removeBookedSeats(
                                          flight.reservedSeats,
                                          rfseats
                                        )}
                                        setSeatRows={setReservedDepSeats}
                                      />
                                    ) : (
                                      <SeatsModal
                                        seatNumber={passengerNum}
                                        cabinClass={cabinClass}
                                        returnSeatsFunc={(seats) => {
                                          setReturnSeats(seats);
                                          bookReturn(flight);
                                        }}
                                        rowProp={flight.reservedSeats}
                                        setSeatRows={setReservedDepSeats}
                                      />
                                    )
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
                        rowProp={returnFlight.reservedSeats}
                        setSeatRows={setReservedReturnSeats}
                      />
                    }
                  />
                  <div className={Styles.loginButton}>
                    <PaymentModal
                      email={email}
                      price={Math.abs(originalPrice - getPrice())}
                      reserveFunc={reserve}
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
      <Dialog
        open={invoiceOpen}
        onClose={CloseInvoice}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <a href={invoice}>Your Payment Invoice</a>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Snackbar open={openSnack} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {snackBarText}
        </Alert>
      </Snackbar>
    </div>
  );
}
