import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import FlightContainer from "../../Components/FlightContainer/FlightContainer";
import Styles from "./AdminPage.module.css";
import FlightEditModal from "../../Components/FlightEditModal/FlightEditModal";
import ToolBarDK from "../../Components/ToolBarDK/ToolBarDK";
import FlightSearchModal from "../../Components/FlightSearchModal/FlightSearchModal";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useEffect, useState } from "react";
const AdminPage = () => {
  const [flights, setFlights] = useState([]);
  const [arrterminals, setArrterminal] = useState([]);
  const [depterminals, setDepterminal] = useState([]);

  const searchFunc = (query) => {
    axios.post("http://localhost:8000/flights/search", query).then((res) => {
      setFlights(res.data);
      console.log(res.data);
    });
  };

  const getFlights = () => {
    axios
      .get("http://localhost:8000/flights")
      .then((res) => {
        setFlights(res.data);
        let arr = res.data.map((flight) => {
          return flight.arrivalTerminal;
        });
        let dep = res.data.map((flight) => {
          return flight.departureTerminal;
        });
        setArrterminal([...new Set(arr)]);
        setDepterminal([...new Set(dep)]);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getFlights();
  }, []);

  return (
    <div>
      <ToolBarDK></ToolBarDK>
      <div className={Styles.Flights}>
        <br></br>
        <div className={Styles.ButtonsContainer}>
          <div className={Styles.Button}>
            <FlightEditModal
              mainButtonText={"Add New Flight"}
              mainButtonTextColor={"white"}
              mainButtonColor={"#1976D2"}
              mainButtonHoverColor={"#1564b3"}
            ></FlightEditModal>
          </div>
          <FlightSearchModal
            mainButtonText={"Search for a flight"}
            mainButtonTextColor={"white"}
            mainButtonColor={"#1976D2"}
            mainButtonHoverColor={"#1564b3"}
            searchFunc={searchFunc}
            arrterminals={arrterminals}
            depterminals={depterminals}
          ></FlightSearchModal>
          <ButtonDK
            icon={<RefreshIcon />}
            buttonText="Reset"
            textColor={"#1976D2"}
            onClick={getFlights}
          />
        </div>
        <FlightContainer flights={flights}></FlightContainer>
      </div>
    </div>
  );
};

export default AdminPage;
