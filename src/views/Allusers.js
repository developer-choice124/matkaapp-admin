
import React from "react";
import {Add} from './services/users';

import Lists from './users/Lists.js';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form, FormGroup, Label, Input,Alert
} from "reactstrap";
 
class Allusers extends React.Component {
  constructor(props) {
    
    var today = new Date(),

    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    super(props);
    this.state = {
        modal: false,
        fade: false,
        currentDate: date,
        username:"",
        name:"",
        commission:"",
        adminId : localStorage.getItem("userId"),
        userError:""
    };
    this.toggle = this.toggle.bind(this);
};
toggle() {
    this.setState({
        modal: !this.state.modal
    });
}

handleChange = (event) => {
  event.preventDefault();
  const { name, value } = event.target;
  this.setState({[name]: value});
}
handleSuperMaster = async (event) => {
event.preventDefault();
  const superdata = 
  {
    username:this.state.username,
    name:this.state.name,
    commission:this.state.commission,
    role:"supermaster",
    parent_id:this.state.adminId, // Admin ID if role supermaster
    password:this.state.username+"1234",
    };
    var response = await Add(superdata).then(function(response) {
      return response;
    }).catch((error) => {
      return error;
    });
    if(response.status === 201){
      window.location.reload();   
    }else if(response.response && response.response.data){
      this.setState({
        userError:response.response.data.errors[0]
      });
    }
}

  render() {
    if(localStorage.getItem("role") === "supermaster"){
      window.location.replace('/dashboard/masters/'+localStorage.getItem("userId"));
    }else if(localStorage.getItem("role") === "master"){
      window.location.replace('/dashboard/users/'+localStorage.getItem("userId"));
    }
    const {userError} = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader className="d-flex">
                  <CardTitle tag="h4">Super Master List</CardTitle>
                  <div className="ml-auto d-flex">      
                    <div>
                      <Button color="info" onClick={this.toggle}>Add Super Master</Button>
                      <Modal isOpen={this.state.modal} fade={this.state.fade }  toggle={this.toggle}>
                          <ModalHeader toggle={this.toggle}>Add Super Master</ModalHeader>
                          <ModalBody> 
                            <Form method="POST" onSubmit={this.handleSuperMaster} noValidate>
                              {userError && 
                                <Alert color="danger">{userError}</Alert>
                              }
                              <FormGroup row>
                                <Label sm={3}>Username</Label>
                                <Col sm={9}>
                                  <Input type="text" name="username" onChange={this.handleChange} placeholder="Please Enter username" />
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Label sm={3}>Full Name</Label>
                                <Col sm={9}>
                                  <Input type="text" name="name" onChange={this.handleChange} placeholder="Please Enter full name" />
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Label sm={3}>Sharing</Label>
                                <Col sm={9}>
                                  <Input type="text" name="commission" onChange={this.handleChange} placeholder="Sharing in %" />
                                </Col>
                              </FormGroup>
                              <FormGroup check row>
                                <Col sm={{ size: 10, offset: 2 }}>
                                  <Button type="submit" >Submit</Button>
                                </Col>
                              </FormGroup>
                            </Form>                     
                          </ModalBody>
                      </Modal>
                    </div>       
                  </div>
                </CardHeader>
                <CardBody className="table-responsive">
                    <Lists role="supermaster" parentId ={this.state.adminId}/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Allusers;
