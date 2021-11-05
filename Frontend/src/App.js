import logo from "./logo.svg";
import "./App.css";
import FlightContainer from "./Components/FlightContainer/FlightContainer";
import FilterDK from "./Components/FilterDK/FilterDK";
import DropDownDK from "./Components/DropDownDK/DropDownDK";
import FlightSearchModal from "./Components/FlightSearchModal/FlightSearchModal";
import FlightEditModal from "./Components/FlightEditModal/FlightEditModal";

function App() {
  return (
    <div className="App">
      <FlightSearchModal
        mainButtonColor="red"
        mainButtonText="hi"
        mainButtonHoverColor="blue"
        mainButtonTextColor="black"
        terminals={["CAI", "NYC"]}
        title="search"
      />
      <FlightEditModal
        mainButtonColor="red"
        mainButtonText="hi"
        mainButtonHoverColor="blue"
        mainButtonTextColor="black"
        terminals={["CAI", "NYC"]}
        title="search"
      />
      <FlightContainer />
    </div>
  );
}

export default App;
