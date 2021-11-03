import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import FlightCard from './FlightCard';

export default function FlightContainer() {

  const flight1 = {"flightNumber":1 ,
  "departureTime": "23-12-2000",
  "arrivalTime": "23-12-2001" ,
  "economySeats": 21,
  "businessSeats": 12,
  "arrivalTerminal": "CAI",
  "departureTerminal":"RYD"}

  const flight2 = {"flightNumber":2 ,
  "departureTime": "23-12-2000",
  "arrivalTime": "23-12-2001" ,
  "economySeats": 21,
  "businessSeats": 12,
  "arrivalTerminal": "CAI",
  "departureTerminal":"BUX"}
  return (
    <Box sx={{ width: '100%', maxWidth: 360,maxHeight: 1000, overflow: 'auto', bgcolor: 'black' }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <FlightCard flight = {flight1}/>
          </ListItem>
          <ListItem disablePadding>
            <FlightCard flight = {flight2}/>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
