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
  mainButtonText,
  mainButtonTextColor,
  mainButtonColor,
  mainButtonHoverColor,
  acceptButtonText,
  title,
  description,
  terminals,
  icon,
}) {
  const [open, setOpen] = React.useState(false);
  const [flightNumber, setFlightNumber] = React.useState(-1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeFlightNumberHandler = (e) => {
    setFlightNumber(e.target.value);
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
        fullWidth
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
            <TextBoxDK
              text="Flight Number"
              onChange={onChangeFlightNumberHandler}
            />
                
            <TextBoxDK text="Business Seats" />
            <TextBoxDK text="Economy Seats" />
            <DropDownDK
              dropItems={["___"].concat(terminals)}
              helperText="Departure Terminal"
              value="departure"
            />
            <DropDownDK
              dropItems={["___"].concat(terminals)}
              helperText="Arrival Terminal"
              value="arrival"
            />
          </div>
          <div className={Styles.DatesContainer}>
            <DateTimePickerDK label="Departure Time" />
            <DateTimePickerDK label="Arrival Time" />
          </div>
        </DialogContent>
        <DialogActions>
          <ButtonDK buttonText="Cancel" onClick={handleClose} />
          <ButtonDK buttonText={acceptButtonText} />
        </DialogActions>
      </Dialog>
    </div>
  );
}
