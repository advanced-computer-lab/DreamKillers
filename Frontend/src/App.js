import logo from "./logo.svg";
import "./App.css";
import FlightContainer from "./Components/FlightContainer/FlightContainer";
import FilterDK from "./Components/FilterDK/FilterDK";
import AdminPage from "./Containers/Admin/AdminPage";
import DropDownDK from "./Components/DropDownDK/DropDownDK";
import FlightSearchModal from "./Components/FlightSearchModal/FlightSearchModal";
import FlightEditModal from "./Components/FlightEditModal/FlightEditModal";


function App() {
  return (
    <div className="App">
      <AdminPage></AdminPage>
    </div>
  );
}

export default App;
