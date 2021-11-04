import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import { Button } from "@mui/material";
import ButtonDK from "../ButtonDK.component";
import Styles from "./FlightCard.module.css";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FlightCard({
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
        <Accordion sx={{ width: 360, bgcolor: "gray", color: "white" }}>
          <AccordionSummary
            sx={{ color: "white" }}
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
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    color="error"
                  >
                    {"Delete"}
                  </Button>
                  <ButtonDK buttonText="Edit" />
                  <ButtonDK buttonText="Delete" color="error" />
                </div>
              </Typography>
            </AccordionDetails>
          </div>
        </Accordion>
      </div>
    </div>
  );
}
