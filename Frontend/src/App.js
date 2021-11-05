import logo from "./logo.svg";
import "./App.css";
import DashboardListItemDK from "./Components/DashboardListItemDK";
import FlightIcon from '@material-ui/icons/Flight';
import ToolBarDK from "./Components/ToolBarDK/ToolBarDK";

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
      
      <DashboardListItemDK listItemText="Flights" listItemIcon={<FlightIcon />} />
      <ToolBarDK/>
    </div>
  );
}

export default App;
