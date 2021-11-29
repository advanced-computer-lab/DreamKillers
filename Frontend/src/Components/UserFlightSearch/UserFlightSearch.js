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
import { CardActionArea } from "@mui/material";
import ButtonDK from "../ButtonDK/ButtonDK";

export default function UserFlightSearch() {
  //to be raised to higher component and changed to props
  //(childrenNum,adultNum,depTerminal,arrTerminal, cabinClass, depterminals, arrterminals ,depDate, arrDate)
  const [childrenNum, setChildrenNum] = useState("");
  const [adultNum, setAdultNum] = useState("");
  const [depTerminal, setDepterminal] = useState("");
  const [arrTerminal, setArrTerminal] = useState("");
  const [cabinClass, setCabinClass] = useState("");
  const [depDate, setDepDate] = useState("");
  const [arrDate, setArrDate] = useState("");

  let depterminals = ["CAI", "POL", "USA"];
  let arrterminals = ["CAI", "POL", "USA"];

  const reset = () => {
    setChildrenNum("");
    setAdultNum("");
    setDepterminal("");
    setArrTerminal("");
    setCabinClass("");
    setDepDate("");
    setArrDate("");
  };

  return (
    <nav>
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
                />
              </div>
              <div className={Styles.componentHolder}>
                <DropDownDK
                  dropItems={["___"].concat(depterminals)}
                  helperText="Departure Terminal"
                  value={depTerminal}
                  onChange={(e) => {
                    setDepterminal(e);
                  }}
                />
              </div>
              <div className={Styles.componentHolder}>
                <DropDownDK
                  dropItems={["___"].concat(arrterminals)}
                  helperText="Arrival Terminal"
                  value={arrTerminal}
                  onChange={(e) => {
                    setArrTerminal(e);
                  }}
                />
              </div>
              <br></br>
              <div className={Styles.dateComp}>
                <DateTimePickerDK
                  label="Departure Date"
                  onChange={(e) => {
                    setDepDate(e);
                  }}
                />
              </div>
              <div className={Styles.componentHolder}>
                <DateTimePickerDK
                  label="Arrival Date"
                  onChange={(e) => {
                    setArrDate(e);
                  }}
                />
              </div>
              <br></br>
              <div className={Styles.numbers}>
                <div className={Styles.componentHolder}>
                  <DropDownDK
                    dropItems={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    helperText="Number of Adults"
                    value={adultNum}
                    onChange={(e) => {
                      setAdultNum(e);
                    }}
                  />
                </div>
                <div className={Styles.componentHolder}>
                  <DropDownDK
                    dropItems={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    helperText="Number of Children"
                    value={childrenNum}
                    onChange={(e) => {
                      setChildrenNum(e);
                    }}
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
                color="green"
                hoverColor="darkgreen"
                icon={<RefreshIcon />}
                onClick={() => {
                  reset();
                }}
              />
              <p className={Styles.padder}></p>
              <ButtonDK
                variant="contained"
                onClick={() => {}}
                textColor="White"
                buttonText="Search"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </nav>
  );
}
