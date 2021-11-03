import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';


export default function FlightCard(props) {
    return (
        <div >
            <Accordion sx={{width: 360}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>{'Flight #'+props.flight.flightNumber}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    <div style={{fontSize:25}}>
                        {props.flight.departureTerminal}<ArrowRightAltOutlinedIcon/>{props.flight.arrivalTerminal}
                    </div>
                    <div>Economy Seats: {props.flight.economySeats}</div>
                    <div>Bussiness Seats: {props.flight.bussinessSeats}</div>
                    <div>Leaves On: {props.flight.departureTime}</div>
                    <div>Arrives On: {props.flight.arrivalTime}</div>
                </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
