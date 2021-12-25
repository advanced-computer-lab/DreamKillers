import React from "react";
import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import TextBoxDK from "../../Components/TextBoxDK/TextBoxDK";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Styles from "./Signup.module.css";
import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@material-ui/core";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const axios = require("axios");

const Signup = ({}) => {
  const [email, setEmailState] = React.useState("");
  const [pass, setPassState] = React.useState("");
  const [passportNumber, setPassportNumber] = React.useState("");
  const [age, setAge] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [homeAddress, setHomeAddress] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("");
  const [pageNum, setPageNum] = React.useState(1);
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
        homeAddress: homeAddress,
        countryCode: countryCode,
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

  const nextPageHandler = () => {
    if (
      passportNumber !== "" &&
      age !== "" &&
      name !== "" &&
      phone !== "" &&
      homeAddress !== "" &&
      countryCode !== ""
    ) {
      setPageNum(2);
    } else {
      setErrorMessage("Please fill all fields");
      setOpenSnack(true);
    }
  };

  return (
    <div className={Styles.Page}>
      <div className={Styles.PageItems}>
        <p className={Styles.SignInTitle}>Sign up</p>
        <br></br>
        {pageNum == 1 ? (
          <>
            <TextBoxDK
              text="Name *"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <br></br>
            <TextBoxDK
              text="Passport Number *"
              onChange={(e) => setPassportNumber(e.target.value)}
              value={passportNumber}
            />
            <br></br>
            <TextBoxDK
              text="Age *"
              onChange={(e) => setAge(e.target.value)}
              value={age}
            />
            <br></br>
            <TextBoxDK
              text="Country Code *"
              onChange={(e) => setCountryCode(e.target.value)}
              value={countryCode}
            />
            <br></br>
            <TextBoxDK
              text="Phone Number *"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />

            <br></br>
            <TextBoxDK
              text="Home Address *"
              onChange={(e) => setHomeAddress(e.target.value)}
              value={homeAddress}
            />
            <br></br>
            <ButtonDK
              className={Styles.SignInButton}
              buttonText="Next"
              onClick={() => nextPageHandler()}
              color={"#1976D2"}
              textColor={"white"}
              hoverColor={"#1564b3"}
              icon={<ArrowForwardIosIcon />}
            ></ButtonDK>
          </>
        ) : (
          <>
            <TextBoxDK
              key={"email"}
              text="Email Address *"
              onChange={(e) => {
                console.log(e.target.value);
                setEmailState(e.target.value);
              }}
              value={email}
            />
            <br></br>
            <TextBoxDK
              key={"pass"}
              text="Password *"
              onChange={(e) => setPassState(e.target.value)}
              isPassword={true}
              value={pass}
            />
            <br></br>
            <ButtonDK
              className={Styles.SignInButton}
              buttonText="Back"
              onClick={() => setPageNum(1)}
              color={"#1976D2"}
              textColor={"white"}
              hoverColor={"#1564b3"}
              icon={<ArrowBackIosIcon />}
            ></ButtonDK>
            <br></br>
            <ButtonDK
              className={Styles.SignInButton}
              buttonText="Sign up"
              onClick={() => signupCheck()}
              color={"#1976D2"}
              textColor={"white"}
              hoverColor={"#1564b3"}
            ></ButtonDK>
          </>
        )}
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
