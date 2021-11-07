import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import ButtonDK from "../ButtonDK/ButtonDK";
import TextBoxDK from "../TextBoxDK/TextBoxDK";
import DropDownDK from "../DropDownDK/DropDownDK";
import Styles from "./FlightSearchModal.module.css";
import DateTimePickerDK from "../DateTimePickerDK/DateTimePickerDK";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FlightSearchModal({
  mainButtonText,
  mainButtonTextColor,
  mainButtonColor,
  mainButtonHoverColor,

  title,
  description,

  arrterminals,
  depterminals,
  searchFunc,
}) {
  const [open, setOpen] = React.useState(false);

  const [flightNumber, setFlightNumber] = React.useState("");
  const [depTerminal, setDepTerminal] = React.useState("");
  const [arrTerminal, setArrTerminal] = React.useState("");
  const [depTime, setDepTime] = React.useState("");
  const [arrTime, setArrTime] = React.useState("");

  const clearFlight = () => {
    setFlightNumber("");
    setDepTerminal("");
    setArrTerminal("");
    setDepTime("");
    setArrTime("");
  };

  const flightNumberChange = (e) => {
    setFlightNumber(e.target.value);
  };

  const depTerminalChange = (e) => {
    setDepTerminal(e);
  };

  const arrTerminalChange = (e) => {
    setArrTerminal(e);
  };

  const depTimeChange = (e) => {
    setDepTime(e);
  };

  const arrTimeChange = (e) => {
    setArrTime(e);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    searchFunc({
      flightNumber: flightNumber,
      departureTime: depTime,
      arrivalTime: arrTime,
      departureTerminal: depTerminal,
      arrivalTerminal: arrTerminal,
    });
    handleClose();
  };

  return (
    <div>
      <ButtonDK
        buttonText={mainButtonText}
        color={mainButtonColor}
        textColor={mainButtonTextColor}
        hoverColor={mainButtonHoverColor}
        onClick={handleClickOpen}
      />
      <Dialog
        maxWidth={100}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {description}
          </DialogContentText>
          <div className={Styles.container} sx={{ color: "yellow" }}>
            <TextBoxDK
              text="Flight Number"
              onChange={flightNumberChange}
              value={flightNumber}
            />
            <DropDownDK
              dropItems={["___"].concat(depterminals)}
              helperText="Departure Terminal"
              value={depTerminal}
              onChange={depTerminalChange}
            />
            <DropDownDK
              dropItems={["___"].concat(arrterminals)}
              helperText="Arrival Terminal"
              value={arrTerminal}
              onChange={arrTerminalChange}
            />
          </div>
          <div className={Styles.container}>
            <DateTimePickerDK label="Departure Time" onChange={depTimeChange} />
            <DateTimePickerDK label="Arrival Time" onChange={arrTimeChange} />
          </div>
        </DialogContent>
        <DialogActions>
          <ButtonDK
            buttonText="Cancel"
            onClick={() => {
              handleClose();
              clearFlight();
            }}
          />
          <ButtonDK
            buttonText="Search"
            onClick={() => {
              handleChange();
              clearFlight();
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
