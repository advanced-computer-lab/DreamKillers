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
    console.log("in");
    axios.post("http://localhost:8000/admin/login", {
      email: email,
      password: pass,
    });
  };

  return (
    <div className={Styles.Page}>
      <p className={Styles.SignInTitle}>Administrator Login</p>
      <br></br>
      <FontAwesomeIcon icon={faLock} className={Styles.LockIcon} />
      <p className={Styles.SignInText}>Sign in</p>
      <TextBoxDK text="Email Address *" onChange={setEmail} />
      <br></br>
      <TextBoxDK text="Password *" onChange={setPass} />
      <br></br>
      <ButtonDK
        className={Styles.SignInButton}
        buttonText="Sign in"
        onClick={loginCheck}
      ></ButtonDK>
    </div>
  );
};

export default LoginPage;
