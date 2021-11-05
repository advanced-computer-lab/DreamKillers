import logo from "./logo.svg";
import "./App.css";
import DashboardListItemDK from "./Components/DashBoardListItemDK/DashboardListItemDK";
import FlightIcon from "@material-ui/icons/Flight";
import ToolBarDK from "./Components/ToolBarDK/ToolBarDK";
import AdminPage from "./Containers/Admin/AdminPage";

function App() {
  return (
    <div className="App">
      <AdminPage></AdminPage>
    </div>
  );
}

export default App;
