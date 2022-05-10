
import React from "react";

import { changePassword } from './../services/users';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Form, FormGroup, Label, Input, Alert
} from "reactstrap";
import { i18n } from "components/i18n/hindi";

class Changepassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      newpassword: "",
      cnewpassword: "",
      Successmsg: "",
      Success: false,
      Error: false,
      Errormsg: "",
      language: localStorage.getItem('language'),
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
      this.setState({
        Successmsg: "Successfully Updated Password",
        Success: true,
        Error: false,
      });
    }).catch(err => {
      console.log(err);
      this.setState({
        Errormsg: "Password Change has been failed. Please try some another time.",
        Error: true,
        Success: false,
      });
    });
  }

  render() {
    const { Successmsg, Success, Error, Errormsg } = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  {localStorage.getItem('role') === "user" ?
                  <CardTitle tag="h4">{this.state.language === "hin" ? i18n.CHANGE_PASSWORD.CHANGE_PASSWORD.hindi : i18n.CHANGE_PASSWORD.CHANGE_PASSWORD.english}</CardTitle>
                   : <CardTitle tag="h4">{i18n.CHANGE_PASSWORD.CHANGE_PASSWORD.english}</CardTitle>}                  
                </CardHeader>
                <CardBody>
                  {Success ? <Alert color="success">{Successmsg}</Alert> : (Error) ? <Alert color="danger">{Errormsg}</Alert> : ''}
                  <Form method="POST" onSubmit={this.handlechangepassword}>
                    <Row>
                      <FormGroup className="col-sm-6">
                      {localStorage.getItem('role') === "user" ?
                  <Label>{this.state.language === "hin" ? i18n.CHANGE_PASSWORD.NEW_PASSWORD.hindi : i18n.CHANGE_PASSWORD.NEW_PASSWORD.english}</Label>
                   : <Label>{i18n.CHANGE_PASSWORD.NEW_PASSWORD.english}</Label>}
                        
                        <Input type="password" name="newpassword" onChange={this.handleChange} placeholder="New Password" />
                      </FormGroup>
                      <FormGroup className="col-sm-6">
                      {localStorage.getItem('role') === "user" ?
                  <Label>{this.state.language === "hin" ? i18n.CHANGE_PASSWORD.CONFIRM_PASSWORD.hindi : i18n.CHANGE_PASSWORD.CONFIRM_PASSWORD.english}</Label>
                   : <Label>{i18n.CHANGE_PASSWORD.CONFIRM_PASSWORD.english}</Label>}
                        <Input type="password" name="cnewpassword" onChange={this.handleChange} placeholder="Confirm Password" />
                      </FormGroup>
                    </Row>
                    <FormGroup check row>
                      <Col sm={{ size: 4 }}>
                        {localStorage.getItem('role') === "user" ?
                        <Button type="submit" className="btn-block" >{this.state.language === "hin" ? i18n.CHANGE_PASSWORD.SUBMIT.hindi : i18n.CHANGE_PASSWORD.SUBMIT.english}</Button>
                      : <Button type="submit" className="btn-block" >{i18n.CHANGE_PASSWORD.SUBMIT.english}</Button>}
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Changepassword;
