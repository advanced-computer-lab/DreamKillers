import * as React from "react";
import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import FlightContainer from "../../Components/FlightContainer/FlightContainer";
import Styles from "./UserPage.module.css";
import FlightEditModal from "../../Components/FlightEditModal/FlightEditModal";
import ToolBarDK from "../../Components/ToolBarDK/ToolBarDK";
import UserProfileDK from "../../Components/UserProfileDK/UserProfileDK";
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

const UserPage = () => {
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
        email: Email,
        password: Password,
        passportNumber: passportNumber,
        phonenumber: phoneNumber,
        userAge: Age,
      })
      .then((res) => {
        console.log("Success");
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
  }, []);
  const fillUser = () => {
    setUserName(currentUser.name);
    setEmail(currentUser.email);
    setPassword(currentUser.password);
    setPassportNumber(currentUser.passportNumber);
    setAge(currentUser.age);
    setPhoneNumber(currentUser.phoneNumber);
  };

  const [userName, setUserName] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [passportNumber, setPassportNumber] = React.useState("");
  const [Age, setAge] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  return (
    <div>
      <ToolBarDK dashboard={"user"}></ToolBarDK>
      <div className={Styles.Flights}>
        <br></br>

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
              <p className={Styles.ParText}> {Email}</p>
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
              <p className={Styles.ParText}> {passportNumber}</p>
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
              <p className={Styles.ParText}> {phoneNumber}</p>
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
      </div>
    </div>
  );
};

export default UserPage;
