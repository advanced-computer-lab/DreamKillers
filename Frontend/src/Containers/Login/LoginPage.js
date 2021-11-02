import ButtonDK from "../../Components/ButtonDK/ButtonDK";
import TextBoxDK from "../../Components/TextBoxDK/TextBoxDK";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import Styles from "./LoginPage.module.css";
const LoginPage = ({}) => {
  return (
    <div className={Styles.Page}>
      <p className={Styles.SignInTitle}>Administrator Login</p>
      <br></br>
      <FontAwesomeIcon icon={faLock} className={Styles.LockIcon} />
      <p className={Styles.SignInText}>Sign in</p>
      <TextBoxDK text="Email Address *" />
      <br></br>
      <TextBoxDK text="Password *" />
      <br></br>
      <ButtonDK className={Styles.SignInButton} buttonText="Sign in"></ButtonDK>
    </div>
  );
};

export default LoginPage;
