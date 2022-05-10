
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
// reactstrap components
import {
  Card,
  CardBody,
  Form, FormGroup, Input, Alert, TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink, Col
} from "reactstrap";

import ShareSpinner from "../SharedComponent/Spinner";
import { USersignIn, USerregistration, verifyOtp, forgotPassword } from './../services/auth';
import { authChangePassword } from './../services/users';

const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};



class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      isRegister: true,
      number: null,
      name: '',
      authError: "",
      success: "",
      preclass: "",
      otp: "",
      section: "login",
      user_id: '',
      newpassword: '',
      cnewpassword: '',
      errors: {
        username: '',
        password: '',
        number: '',
        otp: '',
        newpassword: '',
        cnewpassword: '',
      },
      userdata: null,
      isSignedUp: false,
      isLoading: true,
      activeTab: "1"
    };
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      let errors = this.state.errors;
      errors.username = '';
      errors.password = '';
      errors.number = '';
      this.setState({
        activeTab: tab, authError: '', errors: errors
      });
    }
  };
  changeSection = section => {
    this.setState({
      section: section
    });
  };
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
            ? 'Password must be at least 6 characters long!'
            : '';
        break;
      case 'number':
        errors.number =
          value.length < 10 || value.length > 10
            ? 'Number must be at least 10 Digit long!'
            : isNaN(value) ? 'Please enter only digits'
              : '';
        break;
      case 'otp':
        errors.number =
          value.length < 6 || value.length > 6
            ? 'OTP must be at least 6 Digit long!'
            : '';
        break;
      case 'newpassword':
        errors.newpassword =
          value.length < 6
            ? 'Password must be at least 6 characters long!'
            : '';
        break;
      case 'cnewpassword':
        errors.cnewpassword =
          value.length < 6
            ? 'Password must be at least 6 characters long!'
            : this.state.newpassword === this.state.cnewpassword
              ? 'Password Does not match please fill correct password'
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
      var response = await USersignIn({ username: this.state.username, password: this.state.password, role: 'user' }).then(function (response) {
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
          window.location.replace('/dashboard/lottery');
        }
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
  handleRegisterSubmit = async (event) => {
    event.preventDefault();

    this.setState({ isRegister: false });

    var RegisterData = {
      name: this.state.name,
      username: this.state.username,
      password: this.state.password,
      number: this.state.number,
      role: 'user'
    };
    if (validateForm(this.state.errors)) {
      var response = await USerregistration(RegisterData).catch((error) => {
        return error;
      });
      if (response.status === 201 || response.status === 200) {
        // window.location.reload();
        this.setState({
          isRegister: true,
          section: 'verify-otp',
          user_id: response.data.data._id
        });
        console.log(response);
      } else if (response.response && response.response.data) {
        this.setState({
          authError: response.response.data.errors,
          isRegister: true,
        });
      }
    } else {
      console.error('Invalid Form')
    }
  }
  handleauthChangePassword = (event) => {
    event.preventDefault();
    const passworddata =
    {
      user_id: this.state.userId ? this.state.userId : localStorage.getItem("userId"),
      newpassword: this.state.newpassword,
      cnewpassword: this.state.cnewpassword,
    };
    authChangePassword(passworddata).then(response => {
      this.setState({
        Successmsg: "Successfully Updated Password",
        isRegister: true,
        section: 'login',
      });
    }).catch(err => {
      console.log(err);
      this.setState({
        authError: "Password Change has been failed. Please try some another time.",
        isRegister: true
      });
    });
  }
  handleVerifyOtp = async (event) => {
    event.preventDefault();

    this.setState({ isRegister: false });

    var RegisterData = {
      otp: this.state.otp,
      _id: this.state.user_id
    };
    if (validateForm(this.state.errors)) {
      var response = await verifyOtp(RegisterData).catch((error) => {
        return error;
      });
      if (response.status === 201 || response.status === 200) {
        this.setState({
          isRegister: true,
          section: this.state.section === 're-verify-otp' ? 'change-password' : 'login',
          activeTab: '1',
          success: 'Successfully registered user please Login.'
        });
      } else if (response.response && response.response.data) {
        this.setState({
          authError: response.response.data.errors,
          isRegister: true
        });
      }
    } else {
      console.error('Invalid Form')
    }
  }
  handleforgotPassword = async (event) => {
    event.preventDefault();

    this.setState({ isRegister: false });

    var RegisterData = {
      number: this.state.number
    };
    if (validateForm(this.state.errors)) {
      var response = await forgotPassword(RegisterData).catch((error) => {
        return error;
      });
      if (response.status === 201 || response.status === 200) {
        this.setState({
          isRegister: true,
          section: 're-verify-otp',
          user_id: response.data.data._id
        });
      } else if (response.response && response.response.data) {
        this.setState({
          authError: response.response.data.errors,
          isRegister: true
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
    document.title = "Login";
    const { errors, authError, preclass, isRegister, section, success } = this.state;
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
              {this.state.isLoading ? <p className={"preloader" + preclass}><span data-text="MATKA777"><ShareSpinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /><br />MATKA777</span></p> : ""}
              <Card className="col-lg-4 col-md-8 p-0 p-sm-2 auth-card card">
                <CardBody className="auth-card-caption text-center text-light p-4 card-body w-100">
                  <h2 className="text-light mb-sm-4">
                    <img src={require('../../assets/img/logo.png')} alt="matka 777" className="logo-header" />
                  </h2>
                  <div>
                    {success &&
                      <Alert className="bg-warning text-dark">{success}</Alert>
                    }
                    {
                      !isRegister ? <Col className="col-12 text-center my-5"> <ShareSpinner /> </Col> :
                        section === 'login' ?
                          <>
                            <Nav tabs className="nav-justified px-0 border-0">
                              <NavItem className="theme-btn text-light">
                                <NavLink
                                  className={this.state.activeTab === "1" ? "active" : ""}
                                  onClick={() => {
                                    this.toggle("1");
                                  }}
                                >
                                  Sign In
                                </NavLink>
                              </NavItem>
                              <NavItem className="theme-btn text-light">
                                <NavLink
                                  className={this.state.activeTab === "2" ? "active" : ""}
                                  onClick={() => {
                                    this.toggle("2");
                                  }}
                                >
                                  Register Now
                                </NavLink>
                              </NavItem>
                            </Nav>
                            <TabContent className="pt-3" activeTab={this.state.activeTab}>
                              <TabPane tabId="1">
                                <Col sm="12">
                                  <Form className="row pt-sm-0" method="POST" onSubmit={this.handleSubmit} noValidate>
                                    {authError &&
                                      <Alert className="bg-danger">{authError}</Alert>
                                    }
                                    <FormGroup className="col-sm-12 px-1 text-left ">
                                      <label className="text-light">Username</label>
                                      <Input type="text" name="username" placeholder="Enter Username" onChange={this.handleChange} className="form-control input-style text-light pl-0" />
                                      {errors.username.length > 0 &&
                                        <span className='small error text-danger'>{errors.username}</span>}
                                    </FormGroup>
                                    <FormGroup className="col-sm-12 px-1 text-left mt-2 mb-4 ">

                                      <label className="text-light">Password</label>
                                      <Input type="password" name="password" placeholder="Enter Password" onChange={this.handleChange} className="form-control input-style text-light pl-0" />
                                      {errors.password.length > 0 &&
                                        <span className='small error text-danger'>{errors.password}</span>}
                                    </FormGroup>
                                    <FormGroup className="col-sm-12 px-1 mt-4">
                                      <button type="submit" className="btn btn-block m-0 theme-btn text-light">Submit</button>
                                    </FormGroup>
                                  </Form>
                                </Col>
                              </TabPane>
                              <TabPane tabId="2">
                                <Col sm="12">
                                  <Form className="row pt-sm-0" method="POST" onSubmit={this.handleRegisterSubmit} noValidate>
                                    {authError &&
                                      <Alert className="bg-danger">{authError}</Alert>
                                    }
                                    <FormGroup className="col-sm-12 px-1 text-left ">
                                      <label className="text-light">Name</label>
                                      <Input type="text" name="name" placeholder="Enter Name" onChange={this.handleChange} className="form-control input-style text-light pl-0" />
                                    </FormGroup>
                                    <FormGroup className="col-sm-12 px-1 text-left ">
                                      <label className="text-light">Username</label>
                                      <Input type="text" name="username" placeholder="Enter Username" onChange={this.handleChange} className="form-control input-style text-light pl-0" />
                                      {errors.username.length > 0 &&
                                        <span className='small error text-danger'>{errors.username}</span>}
                                    </FormGroup>
                                    <FormGroup className="col-sm-12 px-1 text-left mt-2 mb-4 ">
                                      <label className="text-light">Mobile Number</label>
                                      <Input type="tel" name="number" autocomplete="off" placeholder="Enter Mobile Number" onChange={this.handleChange} className="form-control input-style text-light pl-0" />
                                      {errors.number.length > 0 &&
                                        <span className='small error text-danger'>{errors.number}</span>}
                                    </FormGroup>
                                    <FormGroup className="col-sm-12 px-1 text-left mt-2 mb-4 ">
                                      <label className="text-light">Password</label>
                                      <Input type="password" name="password" placeholder="Enter Password" onChange={this.handleChange} className="form-control input-style text-light pl-0" />
                                      {errors.password.length > 0 &&
                                        <span className='small error text-danger'>{errors.password}</span>}
                                    </FormGroup>
                                    <FormGroup className="col-sm-12 px-1 mt-4">
                                      <button type="submit" className="btn btn-block m-0 theme-btn text-light">Submit</button>
                                    </FormGroup>
                                  </Form>
                                </Col>
                              </TabPane>
                            </TabContent>
                          </>
                          : section === 'verify-otp' || section === 're-verify-otp' ?
                            <>
                              <Col sm="12">
                                <h3 className="text-center">Verify OTP</h3>
                                <Form className="row pt-sm-0" method="POST" onSubmit={this.handleVerifyOtp} noValidate>
                                  {authError &&
                                    <Alert className="bg-danger">{authError}</Alert>
                                  }
                                  <FormGroup className="col-sm-12 px-1 text-left ">
                                    <label className="text-light">OTP</label>
                                    <Input type="text" name="otp" placeholder="Enter OTP" onChange={this.handleChange} className="form-control input-style text-light pl-0" />
                                    {errors.otp.length > 0 &&
                                      <span className='small error text-danger'>{errors.otp}</span>}
                                  </FormGroup>
                                  <FormGroup className="col-sm-12 px-1 mt-4">
                                    <button type="submit" className="btn btn-block m-0 theme-btn text-light">Submit</button>
                                  </FormGroup>
                                </Form>
                              </Col>
                            </>
                            : section === 'forgot-password' ?
                              <>
                                <Col sm="12">
                                  <h3 className="text-center">Forgot Password</h3>
                                  <Form className="row pt-sm-0" method="POST" onSubmit={this.handleforgotPassword} noValidate>
                                    {authError &&
                                      <Alert className="bg-danger">{authError}</Alert>
                                    }
                                    <FormGroup className="col-sm-12 px-1 text-left ">
                                      <label className="text-light">Mobile Number</label>
                                      <Input type="tel" name="number" placeholder="Enter Registered Mobile Number" onChange={this.handleChange} className="form-control input-style text-light pl-0" />
                                      {errors.number.length > 0 &&
                                        <span className='small error text-danger'>{errors.number}</span>}
                                    </FormGroup>
                                    <FormGroup className="col-sm-12 px-1 mt-4">
                                      <button type="submit" className="btn btn-block m-0 theme-btn text-light">Submit</button>
                                    </FormGroup>
                                  </Form>
                                </Col>
                              </>
                              : section === 'change-password' ?
                                <>
                                  <Col sm="12">
                                    <h3 className="text-center">Change Your Password</h3>
                                    <Form className="row pt-sm-0" method="POST" onSubmit={this.handlechangepassword} noValidate>
                                      {authError &&
                                        <Alert className="bg-danger">{authError}</Alert>
                                      }
                                      <FormGroup className="col-sm-12 px-1 text-left ">
                                        <label className="text-light">New Password</label>
                                        <Input type="password" name="newpassword" onChange={this.handleChange} placeholder="New Password" className="form-control input-style text-light pl-0" />
                                        {errors.newpassword.length > 0 &&
                                          <span className='small error text-danger'>{errors.newpassword}</span>}
                                      </FormGroup>
                                      <FormGroup className="col-sm-12 px-1 text-left ">
                                        <label className="text-light">Confirm Password</label>
                                        <Input type="password" name="cnewpassword" onChange={this.handleChange} placeholder="Confirm Password" className="form-control input-style text-light pl-0" />
                                        {errors.cnewpassword.length > 0 &&
                                          <span className='small error text-danger'>{errors.cnewpassword}</span>}
                                      </FormGroup>
                                      <FormGroup className="col-sm-12 px-1 mt-4">
                                        <button type="submit" className="btn btn-block m-0 theme-btn text-light">Submit</button>
                                      </FormGroup>
                                    </Form>
                                  </Col>
                                </>
                                : ''
                    }
                  </div>
                  {section === 'forgot-password' ?
                    <NavLink href="#" className="text-light" onClick={() => this.changeSection('login')}> Back to Sign In?</NavLink>
                    :
                    <NavLink href="#" className="text-light" onClick={() => this.changeSection('forgot-password')}> Forgot Password?</NavLink>
                  }
                </CardBody>
              </Card>
              <a href={"https://wa.me/91"+"9329195461"} className="footer-contact-icon " title="Chat with Master" target="_blank" rel="noopener noreferrer"
               style={{"position": "fixed","bottom": "50px", "zIndex":"10"}}>
            <img src={require('../../assets/img/whatsapp.png')} alt="Chat with Master" className="mw-100 p-0" />
          </a> 
            </div>
          </div>
        </>
      );
    }
  }
}

export default Login;
