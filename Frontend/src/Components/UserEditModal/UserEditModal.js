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
import Styles from "./UserEditModal.module.css";
import DateTimePickerDK from "../DateTimePickerDK/DateTimePickerDK";

import EditIcon from "@mui/icons-material/Edit";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserEditModal({
  userNameState,
  EmailState,
  PasswordState,
  passportNumberState,
  AgeState,
  phoneNumberState,
  mainButtonText,
  mainButtonTextColor,
  mainButtonColor,
  mainButtonHoverColor,
  acceptButtonText,
  title,
  description,
  icon,
  onAcceptOnClickHandler,
}) {
  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [passportNumber, setPassportNumber] = React.useState("");
  const [Age, setAge] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = () => {
    setOpen(false);
  };

  const onChangeUserNameHandler = (e) => {
    setUserName(e.target.value);
  };
  const onChangeEmailHandler = (e) => {
    setEmail(e.target.value);
  };
  const onChangePasswordHandler = (e) => {
    setPassword(e.target.value);
  };
  const onChangePassportNumberHandler = (e) => {
    setPassportNumber(e.target.value);
  };
  const onChangeAgeHandler = (e) => {
    setAge(e.target.value);
  };
  const onChangePhoneNumberHandler = (e) => {
    setPhoneNumber(e.target.value);
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

          <div className={Styles.Container}>
            <div className={Styles.TextBox}>
              <TextBoxDK text="User Name" onChange={onChangeUserNameHandler} />
            </div>
            <div className={Styles.TextBox}>
              <TextBoxDK text="Email" onChange={onChangeEmailHandler} />
            </div>
            <div className={Styles.TextBox}>
              <TextBoxDK
                text="Passport Number"
                onChange={onChangePassportNumberHandler}
              />
            </div>
            <div className={Styles.TextBox}>
              <TextBoxDK text="Age" onChange={onChangeAgeHandler} />
            </div>
            <div className={Styles.TextBox}>
              <TextBoxDK
                text="Phone Number"
                onChange={onChangePhoneNumberHandler}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <ButtonDK
            buttonText="Cancel"
            onClick={handleClose}
            color={"orange"}
            textColor={"#000000"}
            hoverColor={"orange"}
          />
          <ButtonDK
            buttonText={acceptButtonText}
            color={"orange"}
            textColor={"#000000"}
            hoverColor={"orange"}
            onClick={() => {
              handleClose();
              onAcceptOnClickHandler(
                userName,
                Email,
                Password,
                passportNumber,
                Age,
                phoneNumber
              );
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
