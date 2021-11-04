import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import { Button } from '@mui/material';


export default function FlightCard(props) {
    return (
        <div >
            <Accordion sx={{width: 360, bgcolor: 'gray',color: "white"}}>
                <AccordionSummary sx={{color: 'white'}} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>{'Flight #'+props.flight.flightNumber}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    <div style={{fontSize:25}}>
                        {props.flight.departureTerminal}<ArrowRightAltOutlinedIcon/>{props.flight.arrivalTerminal}
                    </div>
                    <div>Economy Seats: {props.flight.economySeats}</div>
                    <div>Bussiness Seats: {props.flight.businessSeats}</div>
                    <div>Leaves On: {props.flight.departureTime}</div>
                    <div>Arrives On: {props.flight.arrivalTime}</div>
                    <div>
                        <Button sx={{color:'black' ,bgcolor:'yellow'}}>Edit</Button>
                        <Button sx={{color:'black' ,bgcolor:'red'}}>Delete</Button>
                    </div>
                </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
