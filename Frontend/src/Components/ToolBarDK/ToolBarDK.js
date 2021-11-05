import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import FlightIcon from "@material-ui/icons/Flight";
import DashboardListItemDK from "../DashBoardListItemDK/DashboardListItemDK";
import { maxWidth } from "@mui/system";
import ListItem from "@mui/material/ListItem";
import Styles from "./ToolBarDK.module.css";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: 180,
}));

const tools = [];

export default function ToolBarDK() {
  return (
    <div className={Styles.Toolbar}>
      <DashboardListItemDK
        listItemText="Flights"
        listItemIcon={<FlightIcon />}
      />
    </div>
  );
}

// export default function FlightContainer() {
//     // const flight1 = {
//     //   flightNumber: 1,
//     //   departureTime: "23-12-2000",
//     //   arrivalTime: "23-12-2001",
//     //   economySeats: 21,
//     //   businessSeats: 12,
//     //   arrivalTerminal: "CAI",
//     //   departureTerminal: "RYD",
//     // };

//     // const flight2 = {
//     //   flightNumber: 2,
//     //   departureTime: "23-12-2000",
//     //   arrivalTime: "23-12-2001",
//     //   economySeats: 21,
//     //   businessSeats: 12,
//     //   arrivalTerminal: "CAI",
//     //   departureTerminal: "BUX",
//     // };

//     const [flights, setFlights] = React.useState([]);

//     React.useEffect(() => {
//       axios
//         .get("http://localhost:8000/flights")
//         .then((res) => {
//           setFlights(res.data);
//           console.log(res.data);
//         })
//         .catch((e) => console.log(e));
//     }, []);

//     return (
//       <Box
//         sx={{
//           width: "100%",
//           maxWidth: 380,
//           maxHeight: 500,
//           overflow: "auto",
//           bgcolor: "black",
//         }}
//       >
//         <nav aria-label="main mailbox folders">
//           <List>
//             {flights.map((flight) => {
//               return (
//                 <div>
//                   <ListItem disablePadding>
//                     <FlightCard
//                       flightNumber={flight.flightNumber}
//                       departureTime={flight.departureTime}
//                       arrivalTime={flight.arrivalTime}
//                       economySeats={flight.economySeats}
//                       businessSeats={flight.businessSeats}
//                       arrivalTerminal={flight.arrivalTerminal}
//                       departureTerminal={flight.departureTerminal}
//                     />
//                   </ListItem>
//                 </div>
//               );
//             })}
//           </List>
//         </nav>
//       </Box>
//     );
//   }
