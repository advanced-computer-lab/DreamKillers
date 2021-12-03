import * as React from "react";
import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import FlightContainer from "../../Components/FlightContainer/FlightContainer";
import Styles from "./UserPage.module.css";
import FlightEditModal from "../../Components/FlightEditModal/FlightEditModal";
import ToolBarDK from "../../Components/ToolBarDK/ToolBarDK";
import FlightSearchModal from "../../Components/FlightSearchModal/FlightSearchModal";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useEffect, useState } from "react";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faUser, faBook } from "@fortawesome/free-solid-svg-icons";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import BadgeIcon from "@mui/icons-material/Badge";
import UserEditModal from "../../Components/UserEditModal/UserEditModal.js";

import EditIcon from "@mui/icons-material/Edit";
import ReservationSummary from "../../Components/ReservationSummary/ReservationSummary";

const UserPage = () => {
  const [editTriggered, setEditTriggered] = React.useState(false);
  const onAcceptEditOnClickHandler = (
    userName,
    Email,
    Password,
    passportNumber,
    Age,
    phoneNumber
  ) => {
    axios
      .patch(`http://localhost:8000/user/edit`, {
        name: userName,
        oldEmail: currentUser.email,
        newEmail: Email,
        password: Password,
        newPassportNumber: passportNumber,
        newPhoneNumber: phoneNumber,
        userAge: Age,
      })
      .then((res) => {
        console.log("Success");
        setEditTriggered(!editTriggered);
      })
      .catch((e) => console.log(e));
  };
  let currentUser = {};
  useEffect(() => {
    axios
      .get(`http://localhost:8000/user`)
      .then((res) => {
        currentUser = res.data;
        fillUser();
      })
      .catch((e) => console.log(e));
  }, [editTriggered]);
  const fillUser = () => {
    setUserName(currentUser.name);
    setOldEmail(currentUser.email);
    setPassword(currentUser.password);
    setOldPassportNumber(currentUser.passportNumber);
    setAge(currentUser.age);
    setOldPhoneNumber(currentUser.phoneNumber);
  };

  const [userName, setUserName] = React.useState("");
  const [oldEmail, setOldEmail] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [oldPassportNumber, setOldPassportNumber] = React.useState("");
  const [passportNumber, setPassportNumber] = React.useState("");
  const [Age, setAge] = React.useState("");
  const [oldPhoneNumber, setOldPhoneNumber] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [reservations, setReservations] = React.useState([]);

  const getReservations = () => {
    axios
      .get("http://localhost:8000/user/reservations")
      .then((res) => {
        setReservations(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getReservations();
  }, [selectedTab]);

  return (
    <div>
      <ToolBarDK
        dashboard={"user"}
        dashBoardItemOnClick={(index) => {
          console.log(index);
          setSelectedTab(index);
        }}
        selectedTab={selectedTab}
      ></ToolBarDK>
      <div className={Styles.Flights}>
        {selectedTab == 2 ? (
          <>
            <div className={Styles.UserDisplay}>
              <div className={Styles.UserDetailsContainer}>
                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <FontAwesomeIcon icon={faUser} color={"black"} size="2x" />
                  </div>
                  <p className={Styles.Text}> User Name:</p>
                  <p className={Styles.ParText}> {userName}</p>
                </div>

                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <EmailIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> E-mail:</p>
                  <p className={Styles.ParText}> {oldEmail}</p>
                </div>

                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <VpnKeyIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> Password:</p>
                  <p className={Styles.ParText}> {Password}</p>
                </div>
              </div>

              <div className={Styles.UserDetailsContainer}>
                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <AirplaneTicketIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> Passport Number:</p>
                  <p className={Styles.ParText}> {oldPassportNumber}</p>
                </div>

                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <BadgeIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> Age:</p>
                  <p className={Styles.ParText}> {Age}</p>
                </div>

                <div className={Styles.DisplayComponent}>
                  <div className={Styles.Icon}>
                    <PhoneIphoneIcon fontSize="large" />
                  </div>
                  <p className={Styles.Text}> Phone Number:</p>
                  <p className={Styles.ParText}> {oldPhoneNumber}</p>
                </div>
              </div>
            </div>
            <div className={Styles.Edit}>
              <UserEditModal
                mainButtonText={"Edit"}
                mainButtonColor={"#2682de"}
                mainButtonTextColor={"white"}
                mainButtonHoverColor={"#1976D2"}
                icon={<EditIcon />}
                acceptButtonText={"Edit"}
                title={"Edit the attributes of profile you want to edit"}
                userName={currentUser.name}
                onAcceptOnClickHandler={onAcceptEditOnClickHandler}
                Email={currentUser.email}
                Password={currentUser.password}
                passportNumber={currentUser.passportNumber}
                Age={currentUser.age}
                phoneNumber={currentUser.phoneNumber}
              ></UserEditModal>
            </div>
          </>
        ) : selectedTab == 1 ? (
          <>
            {reservations.map((res, index) => {
              return (
                <ReservationSummary
                  reservationID={index + 1}
                  dfNumber={
                    res.departureFlight.flightNumber +
                    ` (${res.departureFlight.departureTerminal} > ${res.departureFlight.arrivalTerminal})`
                  }
                  dfDateTime={res.departureFlight.departureTime}
                  dfPrice={res.departureFlight.price}
                  rfNumber={
                    res.returnFlight.flightNumber +
                    ` (${res.returnFlight.departureTerminal} > ${res.returnFlight.arrivalTerminal})`
                  }
                  rfDateTime={res.returnFlight.departureTime}
                  rfPrice={res.returnFlight.price}
                  cabin={res.cabinClass}
                  dfSeats={"A1 A2 A3"}
                  rfSeats={"C2 C3 C4"}
                ></ReservationSummary>
              );
            })}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default UserPage;
