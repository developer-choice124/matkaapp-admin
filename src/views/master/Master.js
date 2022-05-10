
import React from "react";

import {Add} from './../services/users';
import Lists from './../users/Lists.js';

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

class Master extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
        modal: false,
        addmastertoggle: false,
        fade: false,
        username:"",
        name:"",
        commission:"",
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
      role:"master",
      parent_id:this.props.match.params.id?this.props.match.params.id:localStorage.getItem('userId'),
      password:this.state.username+"1234",
      is_first_login: true
    };

      var response = await  Add(superdata).then((response) =>{
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
    if(localStorage.getItem("role") !== "supermaster" && !this.props.match.params.id){
      window.location.replace('/dashboard/dashboard');
    }
    const {userError} = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader className="d-flex">
                  <CardTitle tag="h4">Master List </CardTitle>
                  <div className="ml-auto d-flex">    
                  <div>
                      <Button color="info" onClick={this.toggle}>Add Master</Button>
                      <Modal isOpen={this.state.modal} fade={this.state.fade }  toggle={this.toggle}>
                          <ModalHeader toggle={this.toggle}>Add Master</ModalHeader>
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
                <CardBody>
                  <Lists role="master" parentId ={this.props.match.params.id}/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Master;
