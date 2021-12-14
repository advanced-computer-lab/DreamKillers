import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminPage from "../Containers/Admin/AdminPage";
import AdminLoginPage from "../Containers/Login/AdminLoginPage";
import UserPage from "../Containers/User/UserPage";
import GuestPage from "../Containers/Guest/GuestPage";
import UserLoginPage from "../Containers/Login/UserLoginPage";

function AppBrowserRouter({}) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/guest/dashboard" component={GuestPage} />
        <Route path="/user/dashboard" component={UserPage} />
        <Route path="/user/login" component={UserLoginPage} />
        <Route path="/admin/dashboard" component={AdminPage} />
        <Route path="/admin/login" component={AdminLoginPage} />

        <Route path="/" render={() => <Redirect to="/guest/dashboard" />} />
      </Switch>
    </BrowserRouter>
  );
}

export default AppBrowserRouter;
