import logo from "./logo.svg";
import "./App.css";
import ButtonDK from "./Components/ButtonDK.component";
import AirportTerminalDK from "./Components/AirportTerminalDK.component";
import BasicDateTimePicker from "./Components/DateTimePickerDK.component";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <ButtonDK buttonText="hello" />
        <AirportTerminalDK/>
        <BasicDateTimePicker/>
        <BasicDateTimePicker/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
