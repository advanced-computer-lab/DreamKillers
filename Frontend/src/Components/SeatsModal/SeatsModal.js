import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonDK from "../ButtonDK/ButtonDK";
import FlightSeatsPicker from "../../Components/FlightSeatsPicker/FlightSeatsPicker";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

const SeatsModal = ({
  seatNumber,
  cabinClass,
  returnSeatsFunc,
  modifiedButton,
  rowProp,
  setSeatRows,
}) => {
  const [open, setOpen] = React.useState(false);
  const [seatsSelected, setSeatsSelected] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const [rows, setRows] = React.useState(rowProp);

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
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = true;
    });
    rows[3].map((seat) => {
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = true;
    });
    rows[4].map((seat) => {
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = true;
    });
  };

  const lockBussiness = () => {
    rows[0].map((seat) => {
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = true;
    });
    rows[1].map((seat) => {
      if (seat != null && seat["occupied"] != true) seat["isReserved"] = true;
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

  return (
    <div>
      {modifiedButton == null ? (
        <ButtonDK
          buttonText={"Book"}
          textColor="white"
          hoverColor="#545454"
          color="black"
          onClick={handleClickOpen}
        />
      ) : (
        <ButtonDK
          textColor={modifiedButton.textColor}
          hoverColor={modifiedButton.hoverColor}
          color={modifiedButton.color}
          onClick={handleClickOpen}
          icon={<EventSeatIcon />}
        />
      )}
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
                setSeatRows(rowProp);
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
