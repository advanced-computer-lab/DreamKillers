import logo from "./logo.svg";
import "./App.css";
import FlightContainer from "./Components/FlightContainer/FlightContainer";

function App() {
  return (
    <div className="App">
      <FlightContainer style={{ maxHeight: 20, overflow: "auto" }} />
    </div>
  );
}

export default App;
