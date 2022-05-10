
import React from "react";
import { NavLink } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';


class Breadcrum extends React.Component {
  render() {
    
    const { breadcrumb } = this.props;
    return (
      <>
      <Breadcrumb>
        {breadcrumb.map((links, key) =>{
          if(links.path){
            return (
              <BreadcrumbItem key={key}><NavLink to={links.path}>{links.name}</NavLink></BreadcrumbItem>
            );
          }else{
            return (
              <BreadcrumbItem key={key} active={links.isactive}>{links.name}</BreadcrumbItem>
            );
          }
        })}
        </Breadcrumb>
    </>
    );
  }
}
export {Breadcrum};