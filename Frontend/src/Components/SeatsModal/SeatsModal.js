import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonDK from "../ButtonDK/ButtonDK";
import FlightSeatsPicker from "../../Components/FlightSeatsPicker/FlightSeatsPicker";
import { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

const SeatsModal = ({ seatNumber, cabinClass, returnSeatsFunc }) => {
  const [open, setOpen] = React.useState(false);
  const [seatsSelected, setSeatsSelected] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const incrementSeats = (seatNumber) => {
    seatsSelected.push(seatNumber);
  };

  const deccrementSeats = (seatNumber) => {
    // seatsSelected.remove(seatNumber);
    setSeatsSelected(seatsSelected.filter((item) => item !== seatNumber));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSeatsSelected([]);
    setOpen(false);
  };

  const handleCloseBar = () => {
    setOpenSnack(false);
  };

  const sendSeatsString = () => {
    console.log(seatsSelected);
  };

  const lockEconomy = () => {
    rows[0].map((seat) => {
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = false;
    });
    rows[1].map((seat) => {
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = false;
    });
    rows[2].map((seat) => {
      if (seat != null) seat["isReserved"] = true;
    });
    rows[3].map((seat) => {
      if (seat != null) seat["isReserved"] = true;
    });
    rows[4].map((seat) => {
      if (seat != null) seat["isReserved"] = true;
    });
  };

  const lockBussiness = () => {
    rows[0].map((seat) => {
      if (seat != null) seat["isReserved"] = true;
    });
    rows[1].map((seat) => {
      if (seat != null) seat["isReserved"] = true;
    });
    rows[2].map((seat) => {
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = false;
    });
    rows[3].map((seat) => {
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = false;
    });
    rows[4].map((seat) => {
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = false;
    });
  };

  useEffect(() => {
    if (cabinClass == "Economy") lockBussiness();
    else lockEconomy();
  });

  const [rows, setRows] = React.useState([
    [
      {
        id: 1,
        number: 1,
        tooltip: "Business Class",
      },
      { id: 2, number: 2, tooltip: "Business Class" },
      null,
      {
        id: 3,
        number: "3",
        isReserved: true,
        occupied: true,
        orientation: "east",
        tooltip: "Business Class: Reserved",
      },
      {
        id: 4,
        number: "4",
        orientation: "west",
        tooltip: "Business Class",
      },
      null,
      { id: 5, number: 5, tooltip: "Business Class" },
      { id: 6, number: 6, tooltip: "Business Class" },
    ],
    [
      {
        id: 7,
        number: 1,
        isReserved: true,
        occupied: true,
        tooltip: "Business Class: Reserved",
      },
      {
        id: 8,
        number: 2,
        isReserved: true,
        occupied: true,
        tooltip: "Business Class: Reserved",
      },
      null,
      {
        id: 9,
        number: "3",
        isReserved: true,
        occupied: true,
        orientation: "east",
        tooltip: "Business Class: Reserved",
      },
      {
        id: 10,
        number: "4",
        orientation: "west",
        tooltip: "Business Class",
      },
      null,
      { id: 11, number: 5, tooltip: "Business Class" },
      { id: 12, number: 6, tooltip: "Business Class" },
    ],
    [
      { id: 13, number: 1, tooltip: "Economy Class" },
      { id: 14, number: 2, tooltip: "Economy Class" },
      null,
      {
        id: 15,
        number: 3,
        isReserved: true,
        occupied: true,
        orientation: "east",
        tooltip: "Economy Class, Reserved",
      },
      {
        id: 16,
        number: "4",
        orientation: "west",
        tooltip: "Economy Class, cost: 13$",
      },
      null,
      { id: 17, number: 5, tooltip: "Economy Class" },
      { id: 18, number: 6, tooltip: "Economy Class" },
    ],
    [
      { id: 19, number: 1, tooltip: "Economy Class" },
      { id: 20, number: 2, tooltip: "Economy Class" },
      null,
      {
        id: 21,
        number: 3,
        orientation: "east",
        tooltip: "Economy Class",
      },
      {
        id: 22,
        number: "4",
        orientation: "west",
        tooltip: "Economy Class",
      },
      null,
      { id: 23, number: 5, tooltip: "Economy Class" },
      { id: 24, number: 6, tooltip: "Economy Class" },
    ],
    [
      {
        id: 25,
        number: 1,
        isReserved: true,
        occupied: true,
        tooltip: "Economy Class, Reserved",
      },
      {
        id: 26,
        number: 2,
        orientation: "east",
        tooltip: "Economy Class",
      },
      null,
      {
        id: 27,
        number: "3",
        isReserved: true,
        occupied: true,
        tooltip: "Economy Class: Reserved",
      },
      {
        id: 28,
        number: "4",
        orientation: "west",
        tooltip: "Economy Class",
      },
      null,
      { id: 29, number: 5, tooltip: "Economy Class" },
      {
        id: 30,
        number: 6,
        isReserved: true,
        occupied: true,
        tooltip: "Economy Class: Reserved",
      },
    ],
  ]);

  return (
    <div>
      <ButtonDK
        buttonText={"Book"}
        textColor="white"
        hoverColor="#545454"
        color="black"
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Seat Chart</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Choose your seats
          </DialogContentText>
          <FlightSeatsPicker
            seatNumber={seatNumber}
            cabinClass={cabinClass}
            rows={rows}
            incrementSeats={incrementSeats}
            deccrementSeats={deccrementSeats}
          />
        </DialogContent>
        <DialogActions>
          <ButtonDK
            textColor="white"
            buttonText="cancel"
            hoverColor="#d42c2c"
            color="red"
            onClick={handleClose}
          />
          <ButtonDK
            buttonText="Confirm"
            color="#1976D2"
            textColor="white"
            hoverColor="#1564b3"
            onClick={() => {
              if (seatsSelected.length != seatNumber) setOpenSnack(true);
              else {
                returnSeatsFunc(seatsSelected);
                handleClose();
              }
            }}
          />
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleCloseBar}
      >
        <Alert
          onClose={handleCloseBar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Reserve the same amount of seats as your search
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SeatsModal;
