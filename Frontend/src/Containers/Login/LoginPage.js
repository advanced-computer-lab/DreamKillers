import React from "react";

import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import TextBoxDK from "../../Components/TextBoxDK/TextBoxDK";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Styles from "./LoginPage.module.css";
const axios = require("axios");

const LoginPage = ({}) => {
  const [email, setEmailState] = React.useState("");
  const [pass, setPassState] = React.useState("");

  const setEmail = (e) => {
    setEmailState(e.target.value);
  };

  const setPass = (e) => {
    setPassState(e.target.value);
  };

  const loginCheck = () => {
    axios
      .post("http://localhost:8000/admin/login", {
        email: email,
        password: pass,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log("loggedin");
          window.location.href = "http://localhost:3000/admin/dashboard";
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={Styles.Page}>
      <div className={Styles.PageItems}>
        <p className={Styles.SignInTitle}>Administrator Login</p>
        <br></br>
        <div className={Styles.LockIcon}>
          <FontAwesomeIcon icon={faLock} />
        </div>
        <p className={Styles.SignInText}>Sign in</p>
        <TextBoxDK text="Email Address *" onChange={setEmail} />
        <br></br>
        <TextBoxDK text="Password *" onChange={setPass} />
        <br></br>
        <ButtonDK
          className={Styles.SignInButton}
          buttonText="Sign in"
          onClick={loginCheck}
          color={"#1976D2"}
          textColor={"white"}
          hoverColor={"#1564b3"}
        ></ButtonDK>
      </div>
    </div>
  );
};

export default LoginPage;
