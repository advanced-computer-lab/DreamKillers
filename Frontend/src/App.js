import logo from "./logo.svg";
import "./App.css";
import FlightContainer from "./Components/FlightContainer/FlightContainer";
import FilterDK from "./Components/FilterDK/FilterDK";
import AdminPage from "./Containers/Admin/AdminPage";

function App() {
  return (
    <div className="App">
      <AdminPage></AdminPage>
    </div>
  );
}

export default App;
