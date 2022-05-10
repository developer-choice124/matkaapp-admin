
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";


import 'jquery/dist/jquery.min.js';
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.2.0";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "assets/css/style.css";

import AdminLayout from "./layouts/Admin.js";
// import Auth from "layouts/Auth.js";
import Login from "./views/auth/Login.js";
import AdminLogin from "./views/auth/AdminLogin";
import FirstChangePassword from "./views/firstChangePassword/FirstChangePassword";

ReactDOM.render(
  <BrowserRouter basename={'/'}>
    <Switch>
      <Route path="/dashboard" render={(props) => <AdminLayout {...props} />} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/change-password" component={FirstChangePassword}/>
      <Route path="/" component={Login} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
