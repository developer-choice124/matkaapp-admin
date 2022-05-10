
import React from "react";

import { updateUser, getUser } from './../services/users';
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
class Edituser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Users: "",
      username: "",
      name: "",
      commission: "",
      number: "",
      user_id: this.props.match.params.id ? this.props.match.params.id : localStorage.getItem("userId"),
      errors: {
        number: ''
      },
      success: '',
      language: localStorage.getItem('language')
    };
  };

  Users = async () => {
    let userData = await getUser({ id: this.state.user_id });
    this.setState({
      Users: userData.data.data,
      isLoaded: true
    });
  }
  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case 'number':
        errors.number =
          value.length < 10 || value.length > 10
            ? 'Number must be at least 10 Digit long!'
            : isNaN(value) ? 'Please enter only digits'
              : '';
        break;
      default:
        break;
    }
    this.setState({ errors, [name]: value });
  }
  updateUsers = (evt) => {
    evt.preventDefault();

    const superdata =
    {
      name: this.state.name ? this.state.name : this.state.Users.name,
      commission: this.state.commission,
      number: this.state.Users.number
    };
    if (this.props.match.params.id === undefined) {
      superdata.number = this.state.number ? this.state.number : this.state.Users.number
    }

    updateUser(superdata, this.state.user_id).then((response) => {
      this.setState({
        success: 'Successfully Updated.'
      });
    });
  }


  componentDidMount() {
    this.Users();
  }
  render() {
    if (!this.state.isLoaded) {
      return "Loding....";
    } else if (this.state.isLoaded) {
      const { errors, success } = this.state;
      return (
        <>
          <div className="content">
            <Row>
              <Col md="6">
                <Card>
                  <CardHeader>
                  {localStorage.getItem('role') === "user" ? 
                    <CardTitle tag="h4">{this.state.language === "hin" ? i18n.EDIT_PROFILE.USER_EDIT.hindi : i18n.EDIT_PROFILE.USER_EDIT.english}</CardTitle>
                    : <CardTitle tag="h4">{i18n.EDIT_PROFILE.USER_EDIT.english}</CardTitle>}
                  </CardHeader>
                  <CardBody>
                    {success &&
                      <Alert className="bg-success">{success}</Alert>
                    }
                    <Form method="POST" onSubmit={this.updateUsers}>
                      <FormGroup row>
                      {localStorage.getItem('role') === "user" ? <Label sm={3}>{this.state.language === "hin" ? i18n.EDIT_PROFILE.USERNAME.hindi : i18n.EDIT_PROFILE.USERNAME.english}</Label>
                      : <Label sm={3}>{i18n.EDIT_PROFILE.USERNAME.english}</Label>}
                        <Label sm={9}><strong>{this.state.Users.username}</strong></Label>
                      </FormGroup>
                      <FormGroup row>
                      {localStorage.getItem('role') === "user" ? <Label sm={3}>{this.state.language === "hin" ? i18n.EDIT_PROFILE.FULL_NAME.hindi : i18n.EDIT_PROFILE.FULL_NAME.english}</Label>
                      : <Label sm={3}>{i18n.EDIT_PROFILE.FULL_NAME.english}</Label>}
                        <Col sm={9}>
                          {localStorage.getItem("role") === "admin" || this.props.match.params.id === undefined ?
                            <Input type="text" onChange={this.handleChange} name="name" defaultValue={this.state.Users.name} placeholder="Please Enter full name" />
                            :
                            <Label><strong>{this.state.Users.name}</strong></Label>
                          }
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                      {localStorage.getItem('role') === "user" ? <Label sm={3}>{this.state.language === "hin" ? i18n.EDIT_PROFILE.MOBILE_NUMBER.hindi : i18n.EDIT_PROFILE.MOBILE_NUMBER.english}</Label>
                      : <Label sm={3}>{i18n.EDIT_PROFILE.MOBILE_NUMBER.english}</Label>}
                        <Col sm={9}>
                          {this.props.match.params.id === undefined ?
                            <>
                              <Input type="text" onChange={this.handleChange} name="number" defaultValue={this.state.Users.number} placeholder="Please Enter Number" />
                              {errors.number.length > 0 &&
                                <span className='small error text-danger'>{errors.number}</span>}
                            </>
                            :
                            <Label><strong>{this.state.Users.Number}</strong></Label>
                          }
                        </Col>
                      </FormGroup>
                      {(this.state.Users.role !== "user") &&
                        <FormGroup row>
                          <Label sm={3}>Sharing</Label>
                          <Col sm={9}>
                            <Input type="text" onChange={this.handleChange} name="commission" defaultValue={this.state.Users.commission} placeholder="Please Enter Sharing" />
                          </Col>
                        </FormGroup>
                      }
                      <FormGroup check row>
                        <Col sm={{ size: 10 }}>
                        {localStorage.getItem('role') === "user" ? 
                          <Button type="submit">{this.state.language === "hin" ? i18n.EDIT_PROFILE.SUBMIT.hindi : i18n.EDIT_PROFILE.SUBMIT.english}</Button>
                          : <Button type="submit">{i18n.EDIT_PROFILE.SUBMIT.english}</Button>}
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
}

export default Edituser;
