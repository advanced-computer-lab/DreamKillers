import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import FlightContainer from "../../Components/FlightContainer/FlightContainer";
import Styles from "./AdminPage.module.css";

const AdminPage = () => {
  return (
    <div>
      <div className={Styles.Toolbar}></div>
      <div className={Styles.Flights}>
        <br></br>
        <ButtonDK
          buttonText={"Add Flight"}
          color={"#1976D2"}
          hoverColor={"#1564b3"}
          textColor={"white"}
        />
        <FlightContainer></FlightContainer>
      </div>
    </div>
  );
};

export default AdminPage;
