import logo from "./logo.svg";
import "./App.css";
import ButtonDK from "./Components/ButtonDK.component";
import DashboardListDK from "./Components/DashboardListItem";
import FlightIcon from '@material-ui/icons/Flight';

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
      
      <DashboardListDK listItemText="Flights" listItemIcon={<FlightIcon />} />
    </div>
  );
}

export default App;
