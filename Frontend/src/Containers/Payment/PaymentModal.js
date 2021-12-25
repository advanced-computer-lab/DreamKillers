import PaymentPage from "./PaymentPage";
import Modal from "../../Components/Modal/Modal";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import PaymentIcon from "@mui/icons-material/Payment";
import StripeContainer from "../../Components/StripeElements/StripeContainer";

const PaymentModal = ({ modalTitle, reserveFunc, email, price }) => {
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
        buttonText={"Reserve"}
        textColor="black"
        icon={<PaymentIcon />}
        hoverColor="gold"
        color="gold"
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">{modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <StripeContainer
              email={email}
              price={price}
              reserveFunc={reserveFunc}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentModal;
