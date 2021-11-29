import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import FlightIcon from "@material-ui/icons/Flight";
import InboxIcon from "@material-ui/icons/Inbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

// Default Dashboard List
const DashboardListItemDK = ({
  listItemText,
  listItemIcon,
  onClickHandler,
  selected,
}) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 200, color: "white" }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton selected={selected} onClick={onClickHandler}>
              <ListItemIcon>{listItemIcon}</ListItemIcon>
              <ListItemText primary={listItemText} />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
    </Box>
  );
};

export default DashboardListItemDK;
