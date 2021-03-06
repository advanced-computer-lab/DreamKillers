import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import ButtonDK from "../ButtonDK/ButtonDK";
import Styles from "./FlightCard.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "../Modal/Modal";
import FlightEditModal from "../FlightEditModal/FlightEditModal";

export default function FlightCard({
  flightID,
  flightNumber,
  departureTerminal,
  arrivalTerminal,
  economySeats,
  businessSeats,
  departureTime,
  arrivalTime,
  onAcceptAddOnClickHandler,
  onAcceptEditOnClickHandler,
  deleteButtonOnClick,
}) {
  return (
    <div>
      <div className={Styles.FlightCardContainer}>
        <Accordion sx={{ width: "1000px", bgcolor: "white" }}>
          <AccordionSummary
            sx={{ color: "black" }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{"Flight #" + flightNumber}</Typography>
          </AccordionSummary>

          <div className={Styles.FlightCardDescription}>
            <AccordionDetails>
              <Typography>
                <div style={{ fontSize: 25 }}>
                  {departureTerminal}
                  <ArrowRightAltOutlinedIcon />
                  {arrivalTerminal}
                </div>
                <div>Economy Seats: {economySeats}</div>
                <div>Bussiness Seats: {businessSeats}</div>
                <div>Leaves On: {departureTime}</div>
                <div>Arrives On: {arrivalTime}</div>
                <br></br>
                <div className={Styles.ButtonsContainer}>
                  <FlightEditModal
                    mainButtonText={"Edit"}
                    mainButtonColor={"#2682de"}
                    mainButtonTextColor={"white"}
                    mainButtonHoverColor={"#1976D2"}
                    icon={<EditIcon />}
                    acceptButtonText={"Edit"}
                    title={"Enter the attributes of flight you want to edit"}
                    flightID={flightID}
                    onAcceptOnClickHandler={onAcceptEditOnClickHandler}
                    flightNumberState={flightNumber}
                    departureTerminalState={departureTerminal}
                    arrivalTerminalState={arrivalTerminal}
                    economySeatsState={economySeats}
                    businessSeatsState={businessSeats}
                    departureTimeState={departureTime}
                    arrivalTimeState={arrivalTime}
                  ></FlightEditModal>

                  <Modal
                    modalTitle={"Are you sure you want to delete this flight?"}
                    modalText={"Your action is irreversible"}
                    cancelButtonColor={"#1976D2"}
                    cancelHoverColor={"#1564b3"}
                    cancelTextColor={"white"}
                    cancelText={"Cancel"}
                    acceptButtonColor={"#ff0000"}
                    acceptHoverColor={"#c91e1e"}
                    acceptTextColor={"white"}
                    acceptText={"Delete"}
                    acceptButtonOnClickHandler={() =>
                      deleteButtonOnClick(flightID)
                    }
                  ></Modal>
                </div>
              </Typography>
            </AccordionDetails>
          </div>
        </Accordion>
      </div>
    </div>
  );
}
