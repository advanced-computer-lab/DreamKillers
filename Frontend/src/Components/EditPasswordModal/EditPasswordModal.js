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
import Styles from "./EditPasswordModal.module.css";
import DateTimePickerDK from "../DateTimePickerDK/DateTimePickerDK";

import EditIcon from "@mui/icons-material/Edit";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditPasswordModal({
  PasswordState,
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
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = () => {
    setOpen(false);
  };

  const onChangeOldPasswordHandler = (e) => {
    setOldPassword(e.target.value);
  };
  const onChangeNewPasswordHandler = (e) => {
    setNewPassword(e.target.value);
  };

  return (
    <div>
      <ButtonDK
        buttonText={"Edit Password"}
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
              <TextBoxDK text="Old Password" onChange={onChangeOldPasswordHandler} />
            </div>
            <div className={Styles.TextBox}>
              <TextBoxDK text="New Password" onChange={onChangeNewPasswordHandler} />
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
                oldPassword,
                newPassword
              );
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
