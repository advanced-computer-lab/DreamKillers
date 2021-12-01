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

export default function ToolBarDK({
  dashboard,
  dashBoardItemOnClick,
  selectedTab,
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

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
            selected={selectedTab == 0}
            onClickHandler={() => {
              console.log("Chose 0");
              setSelectedIndex(0);
              if (dashBoardItemOnClick) dashBoardItemOnClick(0);
            }}
          />
          <DashboardListItemDK
            listItemText="Reservations"
            listItemIcon={<FontAwesomeIcon icon={faBook} color={"white"} />}
            selected={selectedTab == 1}
            onClickHandler={() => {
              console.log("Chose 1");
              setSelectedIndex(1);
              if (dashBoardItemOnClick) dashBoardItemOnClick(1);
            }}
          />
          <DashboardListItemDK
            listItemText="Profile"
            listItemIcon={<FontAwesomeIcon icon={faUser} color={"white"} />}
            selected={selectedTab == 2}
            onClickHandler={() => {
              console.log("Chose 2");
              setSelectedIndex(2);
              if (dashBoardItemOnClick) dashBoardItemOnClick(2);
            }}
          />
        </>
      )}
    </div>
  );
}
