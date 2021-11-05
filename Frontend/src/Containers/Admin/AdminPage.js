import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import FlightContainer from "../../Components/FlightContainer/FlightContainer";
import Styles from "./AdminPage.module.css";
import FlightEditModal from "../../Components/FlightEditModal/FlightEditModal";
import ToolBarDK from "../../Components/ToolBarDK/ToolBarDK";
import FlightSearchModal from "../../Components/FlightSearchModal/FlightSearchModal";
const AdminPage = () => {
  return (
    <div>
      <ToolBarDK></ToolBarDK>
      <div className={Styles.Flights}>
        <br></br>
        <div className={Styles.ButtonsContainer}>
          <div className={Styles.Button}>
            <FlightEditModal
              mainButtonText={"Create New Flight"}
              mainButtonTextColor={"white"}
              mainButtonColor={"#1976D2"}
              mainButtonHoverColor={"#1564b3"}
              acceptButtonText={"Create"}
            ></FlightEditModal>
          </div>
          <FlightSearchModal
            mainButtonText={"Search for a flight"}
            mainButtonTextColor={"white"}
            mainButtonColor={"#1976D2"}
            mainButtonHoverColor={"#1564b3"}
            acceptButtonText={"Search"}
          ></FlightSearchModal>
        </div>
        <FlightContainer></FlightContainer>
      </div>
    </div>
  );
};

export default AdminPage;
