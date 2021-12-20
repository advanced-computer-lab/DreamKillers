import React from "react";
import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import TextBoxDK from "../../Components/TextBoxDK/TextBoxDK";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Styles from "./UserLoginPage.module.css";
import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@material-ui/core";
const axios = require("axios");

const UserLoginPage = ({}) => {
  const [email, setEmailState] = React.useState("");
  const [pass, setPassState] = React.useState("");
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

  const loginCheck = () => {
    axios
      .post("http://localhost:8000/user/login", {
        email: email,
        password: pass,
      })
      .then((res) => {
        if (res.status == 200) {
          const token = res.headers["user-token"];
          localStorage.setItem("user-token", token);
          localStorage.setItem("loggedin", true);
          window.location.href = "http://localhost:3000/user/dashboard";
        }
      })
      .catch((e) => {
        setOpenSnack(true);
        console.log(e);
      });
  };

  return (
    <div className={Styles.Page}>
      <div className={Styles.PageItems}>
        <p className={Styles.SignInTitle}>User Login</p>
        <br></br>
        <div className={Styles.LockIcon}>
          <FontAwesomeIcon icon={faLock} />
        </div>
        <p className={Styles.SignInText}>Sign in</p>
        <TextBoxDK text="Email Address *" onChange={setEmail} />
        <br></br>
        <TextBoxDK text="Password *" onChange={setPass} isPassword={true} />
        <br></br>
        <ButtonDK
          className={Styles.SignInButton}
          buttonText="Sign in"
          onClick={loginCheck}
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
            Incorrect username or password
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default UserLoginPage;
