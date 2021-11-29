import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import FlightIcon from "@material-ui/icons/Flight";
import DashboardListItemDK from "../DashBoardListItemDK/DashboardListItemDK";
import { maxWidth } from "@mui/system";
import ListItem from "@mui/material/ListItem";
import Styles from "./ToolBarDK.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faUser, faBook } from "@fortawesome/free-solid-svg-icons";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: 180,
}));

const tools = [];

export default function ToolBarDK({ dashboard, dashBoardItemOnClick }) {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  return (
    <div className={Styles.Toolbar}>
      {dashboard != "user" ? (
        <DashboardListItemDK
          listItemText="Flights"
          listItemIcon={<FontAwesomeIcon icon={faPlane} color={"white"} />}
        />
      ) : (
        <>
          <DashboardListItemDK
            listItemText="Flights"
            listItemIcon={<FontAwesomeIcon icon={faPlane} color={"white"} />}
            selected={selectedIndex == 0}
            onClickHandler={() => {
              setSelectedIndex(0);
              if (dashBoardItemOnClick) dashBoardItemOnClick();
            }}
          />
          <DashboardListItemDK
            listItemText="Reservations"
            listItemIcon={<FontAwesomeIcon icon={faBook} color={"white"} />}
            selected={selectedIndex == 1}
            onClickHandler={() => {
              setSelectedIndex(1);
              if (dashBoardItemOnClick) dashBoardItemOnClick();
            }}
          />
          <DashboardListItemDK
            listItemText="Profile"
            listItemIcon={<FontAwesomeIcon icon={faUser} color={"white"} />}
            selected={selectedIndex == 2}
            onClickHandler={() => {
              setSelectedIndex(2);
              if (dashBoardItemOnClick) dashBoardItemOnClick();
            }}
          />
        </>
      )}
    </div>
  );
}
