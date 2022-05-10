
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
// reactstrap components
import {
  Card,
  CardBody,
  Form, FormGroup, Input, Alert
} from "reactstrap";

import ShareSpinner from "../SharedComponent/Spinner";
import { AdminsignIn } from './../services/auth';

const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};



class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      authError: "",
      preclass: "",
      errors: {
        username: '',
        password: '',
      },
      userdata: null,
      isSignedUp: false,
      isLoading: true
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'username':
        errors.username =
          value.length < 2
            ? 'Full Name must be at least 2 characters long!'
            : '';
        break;
      case 'password':
        errors.password =
          value.length < 6
            ? 'Password must be at least 8 characters long!'
            : '';
        break;
      default:
        break;
    }
    this.setState({ errors, [name]: value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm(this.state.errors)) {
      var response = await AdminsignIn({ username: this.state.username, password: this.state.password }).then(function (response) {
        var is_first_login = response.data.data.is_first_login;
        localStorage.setItem("is_fisrt_login", response.data.data.is_first_login);
        localStorage.setItem("token", `JWT ${response.data.data.token}`);
        localStorage.setItem("role", `${response.data.data.role}`);
        localStorage.setItem("userId", `${response.data.data._id}`);
        localStorage.setItem("supermasterId", `${response.data.data.supermaster_id}`);
        localStorage.setItem("adminId", `${response.data.data.admin_id}`);
        localStorage.setItem("masterId", `${response.data.data.parent_id}`);
        localStorage.setItem("is_blocked", `${response.data.data.is_blocked}`);
        if (is_first_login) {
          window.location.replace('/change-password');
        } else {
          window.location.replace('/dashboard/dashboard');
        }
        // window.location.replace('/dashboard/dashboard');
        return true;
      }).catch((error) => {
        return error;
      });
      if (response.status === 201 || response.status === 200) {
        window.location.reload();
      } else if (response.response && response.response.data) {
        this.setState({
          authError: response.response.data.msg
        });
      }
    } else {
      console.error('Invalid Form')
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        preclass: "animate"
      });
    }, 200);
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 200);
  }
  render() {
    document.title = "Admin";
    const { errors, authError, preclass } = this.state;
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("role") !== "user") {
        return <Redirect to="/dashboard/dashboard" />
      } else {
        return <Redirect to="/dashboard/lottery" />
      }
    } else {
      return (
        <>
          <div className="wrapper auth">
            <div className="content h-100 overflow-hidden w-100">
              {this.state.isLoading ? <p className={"preloader " + preclass}><span data-text="MATKA777"><ShareSpinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /><br />MATKA777</span></p> : ""}
              <Card className="col-lg-4 col-md-8 p-0 auth-card card">
                <CardBody className="auth-card-caption text-center text-light p-5 card-body w-100">
                  <h2 className="text-light mb-sm-5">
                    <img src={require('../../assets/img/logo.png')} alt="matka 777" className="logo-header" />
                  </h2>
                  <Form className="row pt-sm-0" method="POST" onSubmit={this.handleSubmit} noValidate>
                    {authError &&
                      <Alert className="bg-danger">{authError}</Alert>
                    }
                    <FormGroup className="col-sm-12 px-1 text-left ">
                      <label className="text-light">Username</label>
                      <Input type="text" name="username" placeholder="Enter Username" onChange={this.handleChange} className="form-control input-style text-light" />
                      {errors.username.length > 0 &&
                        <span className='small error text-danger'>{errors.username}</span>}
                    </FormGroup>
                    <FormGroup className="col-sm-12 px-1 text-left mt-2 mb-4 ">

                      <label className="text-light">Password</label>
                      <Input type="password" name="password" placeholder="Enter Password" onChange={this.handleChange} className="form-control input-style text-light" />
                      {errors.password.length > 0 &&
                        <span className='small error text-danger'>{errors.password}</span>}
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
      );
    }
  }
}

export default AdminLogin;
