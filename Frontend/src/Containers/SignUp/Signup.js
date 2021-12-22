import React from "react";
import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import TextBoxDK from "../../Components/TextBoxDK/TextBoxDK";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Styles from "./Signup.module.css";
import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@material-ui/core";
const axios = require("axios");

const Signup = ({}) => {
  const [email, setEmailState] = React.useState("");
  const [pass, setPassState] = React.useState("");
  const [passportNumber, setPassportNumber] = React.useState("");
  const [age, setAge] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [openSnack, setOpenSnack] = useState(false);

  const handleCloseBar = () => {
    setOpenSnack(false);
  };

  const setEmail = (e) => {
    setEmailState(e.target.value);
  };

  const setPass = (e) => {
    setPassState(e.target.value);
  };

  const signupCheck = () => {
    axios
      .post("http://localhost:8000/user/signup", {
        name: name,
        email: email,
        password: pass,
        passportNumber: passportNumber,
        age: age,
        phoneNumber: phone,
      })
      .then((res) => {
        if (res.status == 201) {
          window.location.href = "http://localhost:3000/user/login";
        }
      })
      .catch((e) => {
        setErrorMessage("Something went wrong");
        setOpenSnack(true);
        console.log(e);
      });
  };

  return (
    <div className={Styles.Page}>
      <div className={Styles.PageItems}>
        <p className={Styles.SignInTitle}>Sign up</p>
        <br></br>

        <TextBoxDK text="Email Address *" onChange={setEmail} />
        <br></br>
        <TextBoxDK text="Password *" onChange={setPass} isPassword={true} />
        <br></br>
        <TextBoxDK text="Name *" onChange={(e) => setName(e.target.value)} />
        <br></br>
        <TextBoxDK
          text="Passport Number *"
          onChange={(e) => setPassportNumber(e.target.value)}
        />
        <br></br>
        <TextBoxDK text="Age *" onChange={(e) => setAge(e.target.value)} />
        <br></br>
        <TextBoxDK
          text="PhoneNumber *"
          onChange={(e) => setPhone(e.target.value)}
        />
        <br></br>
        <ButtonDK
          className={Styles.SignInButton}
          buttonText="Sign up"
          onClick={() => signupCheck()}
          color={"#1976D2"}
          textColor={"white"}
          hoverColor={"#1564b3"}
        ></ButtonDK>
        <Snackbar
          open={openSnack}
          autoHideDuration={3000}
          onClose={handleCloseBar}
        >
          <Alert
            onClose={handleCloseBar}
            severity="warning"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Signup;
