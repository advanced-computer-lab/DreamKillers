import * as React from "react";
import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import FlightContainer from "../../Components/FlightContainer/FlightContainer";
import Styles from "./GuestPage.module.css";
import FlightEditModal from "../../Components/FlightEditModal/FlightEditModal";
import ToolBarDK from "../../Components/ToolBarDK/ToolBarDK";
import FlightSearchModal from "../../Components/FlightSearchModal/FlightSearchModal";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import DashboardListItemDK from "../../Components/DashBoardListItemDK/DashboardListItemDK";
import axios from "axios";
import { useEffect, useState } from "react";

const GuestPage = () => {

  return (
    <div>
      <ToolBarDK >
      <DashboardListItemDK
        listItemText="Flights"
        listItemIcon={<FontAwesomeIcon icon={faPlane} color={"white"} />}
        INDEX = {0}
      />
      <DashboardListItemDK
        listItemText="Profile"
        listItemIcon={<FontAwesomeIcon icon={faPlane} color={"white"} />}
        INDEX = {2}
      />
      </ToolBarDK>
      <div className={Styles.Flights}>
        <br></br>
        <div className={Styles.ButtonsContainer}>
          <div className={Styles.Button}>
            
          </div>
          
          
        </div>
        
      </div>
    </div>
  );
};

export default GuestPage;
