import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminPage from "../Containers/Admin/AdminPage";
import AdminLoginPage from "../Containers/Login/AdminLoginPage";
import UserPage from "../Containers/User/UserPage";
import GuestPage from "../Containers/Guest/GuestPage";
import UserLoginPage from "../Containers/Login/UserLoginPage";
import SignUp from "../Containers/Signup/Signup";

function AppBrowserRouter({}) {
  const isLoggedIn = localStorage.getItem("loggedin");
  const isAdminLoggedIn = localStorage.getItem("adminLoggedin");

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
            isLoggedIn ? <Redirect to="/user/dashboard" /> : <SignUp />
          }
        />
        <Route
          path="/admin/dashboard"
          render={() =>
            isAdminLoggedIn ? <AdminPage /> : <Redirect to="/admin/login" />
          }
        />
        <Route
          path="/admin/login"
          render={() =>
            isAdminLoggedIn ? (
              <Redirect to="/admin/dashboard" />
            ) : (
              <AdminLoginPage />
            )
          }
        />

        <Route path="/" render={() => <Redirect to="/guest/dashboard" />} />
      </Switch>
    </BrowserRouter>
  );
}

export default AppBrowserRouter;
