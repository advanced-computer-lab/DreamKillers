import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminPage from "../Containers/Admin/AdminPage";
import LoginPage from "../Containers/Login/LoginPage";

function AppBrowserRouter({}) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/admin/dashboard" component={AdminPage} />
        <Route path="/admin/login" component={LoginPage} />
        <Route path="/" render={() => <Redirect to="/admin/login" />} />
      </Switch>
    </BrowserRouter>
  );
}

export default AppBrowserRouter;
