
import React from "react";
import { NavLink } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
// javascript plugin used to create scrollbars on windows

import {getUser} from './../../views/services/users';

class Sidebar extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      userData :"",
      isLoaded :false
    }
  }

  Users = async () => {
    let response =await getUser({id:localStorage.getItem("userId")}).then(function(response, error) {
      
      localStorage.setItem("role", `${response.data.data.role}`);
      localStorage.setItem("userId", `${response.data.data._id}`);
      return response;
    }).catch((error) => {
        return error;
      });
    if(response.response && response.response.data){
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("supermasterId");
      localStorage.removeItem("adminId");
      localStorage.removeItem("is_blocked");
      window.location.replace('/');
    }
    this.setState({
      userData : response.data.data,
      isLoaded:true
    }); 
    
  }
  
  
  componentDidMount() {
    this.Users();
  }

  
  render() {
    const { isLoaded, userData} = this.state;
    return (
      <div
        className="sidebar"
        data-color={this.props.bgColor}
        data-active-color={this.props.activeColor}
      >
        <ProSidebar>
        <div className="text-center p-0">
          <a
            href="../"
            className="simple-text logo-normal p-0"
          >
            <img src={require('../../assets/img/sidebar-logo.png')} alt="matka 777" className="logo p-0" />
          </a>
        </div>
          <span className="pt-2 pb-1 text-center user-name">{isLoaded ? userData.name:"MATKA 777"}</span>
          <Menu iconShape="square" className="pt-0 mt-0">
            {this.props.routes.map((prop, key) => {
              if(!prop.isdropdown){
                return( 
                <MenuItem
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                  >{prop.name}
                  </NavLink>
                </MenuItem>
                );
              } else if(prop.isdropdown) {
                return(
                  <SubMenu title={prop.name} key={key}>
                    {prop.dropdowncontent.map((dorpdownprop, innerkey) => {
                      return( 
                      <MenuItem key={innerkey}>
                        <NavLink
                            to={dorpdownprop.layout + dorpdownprop.path}
                            className="nav-link"
                            activeClassName="active"
                          >{dorpdownprop.name}
                        </NavLink>
                      </MenuItem>
                      );
                    })}
                  </SubMenu>
                );
              }else{
                return false;
              }
            })}
          </Menu>
        </ProSidebar>
      </div>
    );
  }
}

export default Sidebar;
