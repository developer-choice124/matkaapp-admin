import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { changePassword } from './../services/users';
// reactstrap components
import {
    Card,
    CardBody,
    Form, FormGroup, Input, Alert
} from "reactstrap";

class FirstChangePassword extends Component {
    constructor(props) {

        super(props);
        this.state = {
          userId: "",
          newpassword: "",
          cnewpassword: "",
        };
      };
    
      handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({ [name]: value });
      }
      handlechangepassword = (event) => {
        event.preventDefault();
        const passworddata =
        {
          user_id: this.state.userId ? this.state.userId : localStorage.getItem("userId"),
          newpassword: this.state.newpassword,
          cnewpassword: this.state.cnewpassword,
          is_first_login: false
        };
        changePassword(passworddata).then(response => {
            if(response.status == 200){
                var role = localStorage.role;
                if(role === "user"){
                    localStorage.clear();
                window.location.replace('/');
                } else {
                    localStorage.clear();
                    window.location.replace('/admin');
                }
            }
        }).catch(err => {
          console.log(err);
        });
      }
    render() {
        const is_first_login = localStorage.is_fisrt_login;
        const role = localStorage.role;
        if (is_first_login) {
        return (
            <>
                <div className="wrapper auth">
                    <div className="content h-100 overflow-hidden w-100">
                        <Card className="col-lg-4 col-md-8 p-0 auth-card card">
                            <CardBody className="auth-card-caption text-center text-light p-5 card-body w-100">
                                <h2 className="text-light mb-sm-5">
                                    <img src={require('../../assets/img/logo.png')} alt="matka 777" className="logo-header" />
                                </h2>
                                <Form className="row pt-sm-0" method="POST" onSubmit={this.handlechangepassword} noValidate>
                                    <FormGroup className="col-sm-12 px-1 text-left">
                                        <label className="text-light">New Password</label>
                                        <Input type="password" name="newpassword" placeholder="Enter New Password" onChange={this.handleChange} className="form-control input-style text-light" />
                                    </FormGroup>
                                    <FormGroup className="col-sm-12 px-1 text-left mt-2 mb-4">
                                        <label className="text-light">Confirm Password</label>
                                        <Input type="password" name="cnewpassword" placeholder="Enter Confirm Password" onChange={this.handleChange} className="form-control input-style text-light" />
                                    </FormGroup>
                                    <FormGroup className="col-sm-12 px-1 mt-4">
                                        <button type="submit" className="btn btn-block m-0 theme-btn text-light">Submit</button>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </>
        ) 
        } else if (role === "user") {
            window.location.replace('/');
        } else {
            window.location.replace('/admin');
        }
    }
}

export default FirstChangePassword;