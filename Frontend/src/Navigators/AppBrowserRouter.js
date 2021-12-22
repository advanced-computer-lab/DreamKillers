import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminPage from "../Containers/Admin/AdminPage";
import AdminLoginPage from "../Containers/Login/AdminLoginPage";
import UserPage from "../Containers/User/UserPage";
import GuestPage from "../Containers/Guest/GuestPage";
import UserLoginPage from "../Containers/Login/UserLoginPage";
import Signup from "../Containers/SignUp/Signup";
function AppBrowserRouter({}) {
  const isLoggedIn = localStorage.getItem("loggedin");

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/guest/dashboard" component={GuestPage} />
        <Route
          path="/user/dashboard"
          render={() =>
            isLoggedIn ? <UserPage /> : <Redirect to="/user/login" />
          }
        />
        <Route
          path="/user/login"
          render={() =>
            isLoggedIn ? <Redirect to="/user/dashboard" /> : <UserLoginPage />
          }
        />
        <Route
          path="/user/signup"
          render={() =>
            isLoggedIn ? <Redirect to="/user/dashboard" /> : <Signup />
          }
        />
        <Route path="/admin/dashboard" component={AdminPage} />
        <Route path="/admin/login" component={AdminLoginPage} />

        <Route path="/" render={() => <Redirect to="/guest/dashboard" />} />
      </Switch>
    </BrowserRouter>
  );
}

export default AppBrowserRouter;
