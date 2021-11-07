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
import Styles from "./FlightEditModal.module.css";
import DateTimePickerDK from "../DateTimePickerDK/DateTimePickerDK";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FlightEditModal({
  flightID,
  flightNumberState,
  departureTerminalState,
  arrivalTerminalState,
  economySeatsState,
  businessSeatsState,
  departureTimeState,
  arrivalTimeState,
  mainButtonText,
  mainButtonTextColor,
  mainButtonColor,
  mainButtonHoverColor,
  acceptButtonText,
  title,
  description,
  terminals,
  icon,
  onAcceptOnClickHandler,
}) {
  const [open, setOpen] = React.useState(false);
  const [flightNumber, setFlightNumber] = React.useState(flightNumberState);
  const [businessSeats, setBusinessSeats] = React.useState(businessSeatsState);
  const [economySeats, setEconomySeats] = React.useState(economySeatsState);
  const [departureTerminal, setDepartureTerminal] = React.useState(
    departureTerminalState
  );
  const [arrivalTerminal, setArrivalTerminal] =
    React.useState(arrivalTerminalState);
  const [arrivalTime, setArrivalTime] = React.useState(arrivalTimeState);
  const [departureTime, setDepartureTime] = React.useState(departureTimeState);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = () => {
    setOpen(false);
  };

  const onChangeFlightNumberHandler = (e) => {
    setFlightNumber(e.target.value);
  };
  const onChangeBusinessSeatsHandler = (e) => {
    setBusinessSeats(e.target.value);
  };
  const onChangeEconomySeatsHandler = (e) => {
    setEconomySeats(e.target.value);
  };
  const onChangeDepartureTerminalHandler = (e) => {
    setDepartureTerminal(e.target.value);
  };
  const onChangeArrivalTerminalHandler = (e) => {
    setArrivalTerminal(e.target.value);
  };
  const onChangeDepartureTimeHandler = (e) => {
    setDepartureTime(e);
  };
  const onChangeArrivalTimeHandler = (e) => {
    setArrivalTime(e);
  };

  return (
    <div>
      <ButtonDK
        buttonText={mainButtonText}
        color={mainButtonColor}
        textColor={mainButtonTextColor}
        hoverColor={mainButtonHoverColor}
        onClick={handleClickOpen}
        icon={icon}
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

          <div class={Styles.container}>
            <div className={Styles.TextBox}>
              <TextBoxDK
                text="Flight Number"
                onChange={onChangeFlightNumberHandler}
              />
            </div>
            <div className={Styles.TextBox}>
              <TextBoxDK
                text="Business Seats"
                onChange={onChangeBusinessSeatsHandler}
              />
            </div>
            <div className={Styles.TextBox}>
              <TextBoxDK
                text="Economy Seats"
                onChange={onChangeEconomySeatsHandler}
              />
            </div>
            <div className={Styles.TextBox}>
              <TextBoxDK
                text="Departure Terminal"
                onChange={onChangeDepartureTerminalHandler}
              />
            </div>
            <div className={Styles.TextBox}>
              <TextBoxDK
                text="Arrival Terminal"
                onChange={onChangeArrivalTerminalHandler}
              />
            </div>
          </div>
          <div className={Styles.DatesContainer}>
            <DateTimePickerDK
              label="Departure Time"
              onChange={onChangeDepartureTimeHandler}
            />
            <DateTimePickerDK
              label="Arrival Time"
              onChange={onChangeArrivalTimeHandler}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <ButtonDK buttonText="Cancel" onClick={handleClose} />
          <ButtonDK
            buttonText={acceptButtonText}
            onClick={() => {
              handleClose();
              onAcceptOnClickHandler(
                flightID,
                flightNumber,
                businessSeats,
                economySeats,
                departureTerminal,
                arrivalTerminal,
                arrivalTime,
                departureTime
              );
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
