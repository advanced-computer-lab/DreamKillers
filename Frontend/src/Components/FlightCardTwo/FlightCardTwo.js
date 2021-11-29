import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import ButtonDK from "../ButtonDK/ButtonDK";
import Styles from "./FlightCardTwo.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "../Modal/Modal";
import FlightEditModal from "../FlightEditModal/FlightEditModal";

export default function FlightCardTwo({
  flightID,
  flightNumber,
  departureTerminal,
  arrivalTerminal,
  economySeats,
  businessSeats,
  departureTime,
  arrivalTime,
}) {
  return (
    <div>
      <div className={Styles.FlightCardContainer}>
        <Accordion>
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
                <div className={Styles.ButtonsContainer}></div>
              </Typography>
            </AccordionDetails>
          </div>
        </Accordion>
      </div>
    </div>
  );
}
