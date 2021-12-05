import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminPage from "../Containers/Admin/AdminPage";
import LoginPage from "../Containers/Login/LoginPage";
import UserPage from "../Containers/User/UserPage";
import GuestPage from "../Containers/Guest/GuestPage";

function AppBrowserRouter({}) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/guest/dashboard" component={GuestPage} />
        <Route path="/user/dashboard" component={UserPage} />
        <Route path="/admin/dashboard" component={AdminPage} />
        <Route path="/admin/login" component={LoginPage} />
        <Route path="/" render={() => <Redirect to="/guest/dashboard" />} />
      </Switch>
    </BrowserRouter>
  );
}

export default AppBrowserRouter;
