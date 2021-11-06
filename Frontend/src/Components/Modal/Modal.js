import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonDK from "../ButtonDK/ButtonDK";
import DeleteIcon from "@mui/icons-material/Delete";

const Modal = ({
  modalTitle,
  modalText,
  cancelText,
  cancelTextColor,
  cancelButtonColor,
  cancelHoverColor,
  acceptText,
  acceptTextColor,
  acceptButtonColor,
  acceptHoverColor,
  acceptButtonOnClickHandler,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ButtonDK
        buttonText={"Delete"}
        textColor="white"
        icon={<DeleteIcon />}
        hoverColor="#d42c2c"
        color="red"
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {modalText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonDK
            buttonText={cancelText}
            textColor={cancelTextColor}
            color={cancelButtonColor}
            hoverColor={cancelHoverColor}
            onClick={handleClose}
          />
          <ButtonDK
            buttonText={acceptText}
            textColor={acceptTextColor}
            color={acceptButtonColor}
            hoverColor={acceptHoverColor}
            onClick={() => {
              handleClose();
              acceptButtonOnClickHandler();
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Modal;
