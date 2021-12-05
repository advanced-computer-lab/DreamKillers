import React from "react";
import DropDownDK from "../DropDownDK/DropDownDK";
import TextBoxDK from "../TextBoxDK/TextBoxDK";
import { useState } from "react";
import Styles from "./UserFlightSearch.module.css";
import DateTimePickerDK from "../DateTimePickerDK/DateTimePickerDK";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import RefreshIcon from "@mui/icons-material/Refresh";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, TextField } from "@mui/material";
import ButtonDK from "../ButtonDK/ButtonDK";
import Button from "@material-ui/core/Button";
import axios from "axios";

export default function UserFlightSearch({ search, reset }) {
  //to be raised to higher component and changed to props
  //(childrenNum,adultNum,depTerminal,arrTerminal, cabinClass, depterminals, arrterminals ,depDate, arrDate, searchFunc)
  const [childrenNum, setChildrenNum] = useState("");
  const [adultNum, setAdultNum] = useState("");
  const [depTerminal, setDepterminal] = useState("");
  const [arrTerminal, setArrTerminal] = useState("");
  const [cabinClass, setCabinClass] = useState("");
  const [depDate, setDepDate] = useState(new Date());
  const [arrDate, setArrDate] = useState(new Date());
  let depterminals = ["CAI", "CAN", "RYA"];
  let arrterminals = ["CAI", "RYA", "CAN"];

  const resetFunc = () => {
    setChildrenNum("");
    setAdultNum("");
    setDepterminal("");
    setArrTerminal("");
    setCabinClass("");
    setDepDate(new Date());
    setArrDate(new Date());
  };

  const searchFunc = () => {
    axios
      .post("http://localhost:8000/userFlights/searchOnDepart", {
        noOfPassengers: adultNum,
        dateOne: depDate,
        dateTwo: arrDate,
        cabinClass: cabinClass,
        arrivalTerminal: arrTerminal,
        departureTerminal: depTerminal,
      })
      .then((res) => {
        search(res.data, adultNum, childrenNum, cabinClass);
      });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        searchFunc();
      }}
      autoComplete="off"
    >
      <Card sx={{ maxWidth: 750, bgcolor: "snow" }}>
        <CardContent>
          <div className={Styles.container}>
            <div className={Styles.componentHolder}>
              <div className={Styles.componentHolder}>
                <DropDownDK
                  dropItems={["Bussiness", "Economy"]}
                  helperText="Cabin Class"
                  value={cabinClass}
                  onChange={(e) => {
                    setCabinClass(e);
                  }}
                  isRequired={true}
                />
              </div>
              <div className={Styles.componentHolder}>
                <DropDownDK
                  dropItems={depterminals}
                  helperText="Departure Terminal"
                  value={depTerminal}
                  onChange={(e) => {
                    setDepterminal(e);
                  }}
                  isRequired={true}
                />
              </div>
              <div className={Styles.componentHolder}>
                <DropDownDK
                  dropItems={arrterminals}
                  helperText="Arrival Terminal"
                  value={arrTerminal}
                  onChange={(e) => {
                    setArrTerminal(e);
                  }}
                  isRequired={true}
                />
              </div>
              <br></br>
              <div className={Styles.dateComp}>
                <DateTimePickerDK
                  label="From *"
                  onChange={(e) => {
                    setDepDate(e);
                  }}
                />
              </div>
              <div className={Styles.componentHolder}>
                <DateTimePickerDK
                  label="To *"
                  onChange={(e) => {
                    setArrDate(e);
                  }}
                />
              </div>
              <br></br>
              <div className={Styles.numbers}>
                <div className={Styles.componentHolder}>
                  <DropDownDK
                    dropItems={[1, 2, 3, 4, 5, 6]}
                    helperText="Number of Adults"
                    value={adultNum}
                    onChange={(e) => {
                      setAdultNum(e);
                    }}
                    isRequired={true}
                  />
                </div>
                <div className={Styles.componentHolder}>
                  <DropDownDK
                    dropItems={[0, 1, 2, 3]}
                    helperText="Number of Children"
                    value={childrenNum}
                    onChange={(e) => {
                      setChildrenNum(e);
                    }}
                    isRequired={true}
                    note="Ages 0-3"
                  />
                </div>
              </div>
            </div>
            <br></br>
            <div className={Styles.button}>
              <ButtonDK
                variant="contained"
                onClick={() => {}}
                textColor="White"
                buttonText="Reset"
                color="black"
                hoverColor="#545454"
                icon={<RefreshIcon />}
                onClick={() => {
                  resetFunc();
                  reset();
                }}
              />
              <p className={Styles.padder}></p>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "orange",
                  color: "black",
                  ":hover": { backgroundColor: "orange" },
                }}
                type="submit"
              >
                {"Search"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
