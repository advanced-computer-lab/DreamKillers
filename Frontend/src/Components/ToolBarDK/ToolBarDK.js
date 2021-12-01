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
import { faPlane } from "@fortawesome/free-solid-svg-icons";

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
        listItemIcon={<FontAwesomeIcon icon={faPlane} color={"white"} />}
      />
    </div>
  );
}
