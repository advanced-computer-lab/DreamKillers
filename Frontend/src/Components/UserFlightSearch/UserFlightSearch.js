import React from "react";
import DropDownDK from "../DropDownDK/DropDownDK";
import TextBoxDK from "../TextBoxDK/TextBoxDK";
import { useState } from "react";
import Styles from "./UserFlightSearch.css";
import DateTimePickerDK from "../DateTimePickerDK/DateTimePickerDK";

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

  return (
    <div className={Styles.container}>
      <div className={Styles.container}>
        <DropDownDK
          dropItems={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          helperText="Number of Adults"
          value={adultNum}
          onChange={(e) => {
            setAdultNum(e);
          }}
        />
      </div>
      <div className={Styles.container}>
        <DropDownDK
          dropItems={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          helperText="Number of Children"
          value={childrenNum}
          onChange={(e) => {
            setChildrenNum(e);
          }}
        />
      </div>
      <div className={Styles.container}>
        <DropDownDK
          dropItems={["Bussiness", "Economy"]}
          helperText="Cabin Class"
          value={cabinClass}
          onChange={(e) => {
            setCabinClass(e);
          }}
        />
      </div>
      <br></br>
      <div className={Styles.container}>
        <DropDownDK
          dropItems={["___"].concat(depterminals)}
          helperText="Departure Terminal"
          value={depTerminal}
          onChange={(e) => {
            setDepterminal(e);
          }}
        />
      </div>
      <div className={Styles.container}>
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
      <div className={Styles.container}>
        <DateTimePickerDK
          label="Departure Date"
          onChange={(e) => {
            setDepDate(e);
          }}
        />
      </div>
      <div className={Styles.container}>
        <DateTimePickerDK
          label="Arrival Date"
          onChange={(e) => {
            setArrDate(e);
          }}
        />
      </div>
    </div>
  );
}
