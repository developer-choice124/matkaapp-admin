
import React from "react";
import { Route, Switch } from "react-router-dom";

import {auth} from "../routes.js";


class Auth extends React.Component {
  
  render() {
    return (
      <div className="wrapper auth">
          <Switch>
            {auth.map((prop, key) => {
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  key={key}
                />
              );
            })}
          </Switch>
      </div>
    );
  }
}

export default Auth;
