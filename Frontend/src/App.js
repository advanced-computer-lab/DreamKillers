import logo from "./logo.svg";
import "./App.css";
import ButtonDK from "./Components/ButtonDK.component";
import FlightContainer from "./Components/FlightContainer";
//import { List } from "@mui/material";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <ButtonDK buttonText="hello" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    <FlightContainer style={{maxHeight: 20, overflow: 'auto'}}/>
    </div>
  );
}

export default App;
