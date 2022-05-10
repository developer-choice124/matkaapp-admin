/* eslint-disable array-callback-return */

import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { getUser } from '../views/services/users';

import { routes, innerroute, supermasterroute, master, userHindi, userEnglish } from "../routes.js";
var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info",
      islogedin: false,
      lang: true,
      setLang: this.setLang,
    };
    this.mainPanel = React.createRef();
  }
  setLang = (lang) => {
    this.setState({ lang });
  }
  Users = async () => {
    let response = await getUser({ id: localStorage.getItem("userId") }).then(function (response, error) {

      localStorage.setItem("role", `${response.data.data.role}`);
      localStorage.setItem("userId", `${response.data.data._id}`);
      return response;
    }).catch((error) => {
      return error;
    });

    if (response.response && response.response.data) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("supermasterId");
      localStorage.removeItem("adminId");
      localStorage.removeItem("is_blocked");
      window.location.replace('/');
    }
    this.setState({
      islogedin: true
    });

  }

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }

    this.Users();
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };
  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  };
  render() {
    if (!localStorage.getItem("role")) {
      window.location.replace('/');
    }
    var mainRoutes;

    if (localStorage.getItem("role") === "admin") {
      mainRoutes = routes;
    } else if (localStorage.getItem("role") === "supermaster") {
      mainRoutes = supermasterroute;
    } else if (localStorage.getItem("role") === "master") {
      mainRoutes = master;
    } else if (localStorage.getItem("role") === "user") {
      mainRoutes = this.state.lang ? userHindi : userEnglish;
      mainRoutes = localStorage.getItem("language") === "hin" ? userHindi : userEnglish;
    }
    return (
        <div className="wrapper">
          <Sidebar
            {...this.props}
            routes={mainRoutes}
            bgColor={this.state.backgroundColor}
            activeColor={this.state.activeColor}
          />
          <div className="main-panel" ref={this.mainPanel}>
            <DemoNavbar {...this.props} />
            <Switch>
              {(localStorage.getItem("role") === "admin") ?
                <>
                  {routes.map((component, key) => {
                    return (
                      <Route
                        path={component.layout + component.path}
                        component={component.component}
                        key={key}
                      />
                    );
                  })}
                </>
                : (localStorage.getItem("role") === "supermaster") ?
                  <>
                    {supermasterroute.map((prop, key) => {
                      return (
                        <Route exact
                          path={prop.layout + prop.path}
                          component={prop.component}
                          key={key}
                        />
                      );
                    })}
                  </>
                  : (localStorage.getItem("role") === "master") ?
                    <>
                      {master.map((prop, key) => {
                        return (
                          <Route
                            path={prop.layout + prop.path}
                            component={prop.component}
                            key={key}
                          />
                        );
                      })}
                    </>
                    : (localStorage.getItem("role") === "user") ?
                      <>
                        {userHindi.map((prop, key) => {
                          return (
                            <Route
                              path={prop.layout + prop.path}
                              component={prop.component}
                              key={key}
                            />
                          );
                        })}
                      </>
                      : ""
              }
            </Switch>
            <Switch>
              {innerroute.map((prop, key) => {
                return (
                  <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={key}
                  />
                );
              })}
            </Switch>
            <Footer fluid />
          </div>
        </div>
      
    );
  }
}

export default Dashboard;
