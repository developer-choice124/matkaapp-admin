
import React from "react";

import {getAccountstatement, settalmentUpdate} from './services/accountstatement';
import CasinoChipsummary from "./CasinoChipsummary.js";

import { NavLink } from "react-router-dom";

import ShareSpinner from "./SharedComponent/Spinner";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form, FormGroup, Input,
} from "reactstrap";

class Chipsummary extends React.Component { 
constructor(props) {

  super(props);
  this.state = {
    modal: false,
    chiptoggle: false,
    DebitAccountstatement :"",
    CreditAccountstatement :"",
    isLoaded :false,
    DebitisLoaded :false,
    user_id : null,
    senderId : null,
    type : null,
    chips : 0,
    description : 0,
    totaldebit:0,
    totalcredit:0,
    lottery :true,
    casino :false,
    isLoading:false,
    showSection:"lottery",
  }
  
  this.chiptoggle = this.chiptoggle.bind(this);
}

handleSection = (event) => {
  const { value,checked } = event.target;

  switch (value) {
    case 'casino': 
    
      this.setState({
        showSection:value,
        casino:checked
      });
      
      break;
    case 'lottery': 
      this.setState({
        showSection:value,
        lottery:checked
      });
      break;
    default:
      break;
  }
}
getDebitAccountstatement = async () => {
  

 var Accountstatement = await getAccountstatement({id:localStorage.getItem("userId"),type:"DEBIT"});
 var totaldebit = 0;
  Accountstatement.data.data.map((statement) =>{
    totaldebit = totaldebit + statement.amount;
    return true;
  });
  this.setState({
      DebitAccountstatement : Accountstatement.data.data,
      DebitisLoaded:true,
      totaldebit:totaldebit,
  }); 
}

getCreditAccountstatement = async () => {

 var Accountstatement = await getAccountstatement({id:localStorage.getItem("userId"),type:"CREDIT"});
 var totalcredit = 0;
  Accountstatement.data.data.map((statement) =>{
    totalcredit = totalcredit + statement.amount;
    return true;
  });
  this.setState({
      CreditAccountstatement : Accountstatement.data.data,
      isLoaded:true,
      totalcredit:totalcredit
  }); 
}

chiptoggle(user_id,senderId, type) {
  this.setState({
      chiptoggle: !this.state.chiptoggle,
      user_id:user_id,
      senderId:senderId,
      type:type,
  });
}

handlewithdrawchip = (event) => {
  
  this.setState({ isLoading: true });
  event.preventDefault();
    const chipdata = 
    {
      user_id:this.state.user_id,
      sender_id:this.state.senderId,
      chips:this.state.chips,
      discription:this.state.description,
    };
    settalmentUpdate(chipdata).then(function(response) {
      window.location.reload();   
    });
    this.setState({
      isLoading: false
    });
  }

handleChange = (event) => {
  event.preventDefault();
  const { name, value } = event.target;
  this.setState({[name]: value});
}

componentDidMount() {
  this.getCreditAccountstatement();
  this.getDebitAccountstatement();
}

render() {
  const {isLoaded , CreditAccountstatement,DebitAccountstatement,DebitisLoaded,totalcredit,totaldebit, showSection} = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
                <Row className="pt-2 pb-3 mb-1">
                  <Col md="6">
                    <FormGroup>
                          <Input type="radio" name="GameType" className="input-radio-off" id="GameType1" defaultValue="lottery" onChange={this.handleSection} defaultChecked={this.state.lottery}/>
                          <label className="card game-radio" htmlFor="GameType1"><span className="checkmark"></span> Lottery</label>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                          <Input type="radio" name="GameType" className="input-radio-off" id="GameType2" defaultValue="casino" onChange={this.handleSection} defaultChecked={this.state.casino}/>
                          <label className="card game-radio" htmlFor="GameType2"><span className="checkmark"></span> Casino</label>
                    </FormGroup>
                  </Col>
                </Row>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Chip Summary</CardTitle>
                </CardHeader>
                <CardBody>
                  
                  {(showSection === "casino" && isLoaded) ?
                    <CasinoChipsummary />
                  : (showSection && isLoaded) ?
                  <Row>
                    <Col sm={12}>
                      <h4 className="m-0"><b>Plus Account (+)</b></h4>
                      <Table className="table-bordered">
                        <thead className="text-primary">
                          <tr className="table-info">
                            <th>Name</th>
                            <th>Account</th>
                            <th>Chips</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoaded && CreditAccountstatement.map((statement, key) =>{
                              return(
                                <tr key={key}>
                                  <td>{statement.senderDetails.length > 0 ? statement.senderDetails[0].username : ""}</td>
                                  <td>{statement.senderDetails.length > 0 ? <NavLink to={"/dashboard/user/account-statement/"+statement.senderDetails[0]._id} title="history">
                                    {statement.senderDetails[0].username}
                                </NavLink> :""} CR From {statement.userDetails.length > 0 ? statement.userDetails[0].username : ""}</td>
                                  <td>{statement.amount}</td>
                                  <td>
                                    <Button color="primary" onClick={() => this.chiptoggle(statement.user_id,statement.sender_id,"CREDIT")} >
                                    Settlement
                                    </Button>
                                  </td>
                                </tr>
                              );
                          })}
                          
                          <tr className="bg-primary">
                            <td colSpan="2"><b>Total</b></td>
                            <td colSpan="2"> {totalcredit}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col sm={12}>
                      <h4 className="m-0"><b>Minus Account (-)</b></h4>
                      <Table className="table-bordered">
                        <thead>
                          <tr className="table-danger">
                            <th>Name</th>
                            <th>Account</th>
                            <th>Chips</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DebitisLoaded && DebitAccountstatement.map((statement, key) =>{
                              return(
                                <tr key={key}>
                                  <td>{statement.userDetails[0] ? statement.userDetails[0].username : ""}</td>
                                  <td>{statement.senderDetails[0].username} DR to {statement.userDetails[0] ? statement.userDetails[0].username : ""}</td>
                                  <td>{statement.amount}</td>
                                  <td>
                                    <Button color="danger" onClick={() => this.chiptoggle(statement.user_id,statement.sender_id,"CREDIT")} >
                                    Settlement
                                    </Button>
                                  </td>
                                </tr>
                              );
                          })}
                          <tr className="bg-danger">
                            <td colSpan="2"><b>Total</b></td>
                            <td colSpan="2"> {totaldebit}</td>
                          </tr>
                        </tbody> 
                      </Table>
                    </Col>
                  </Row>
                  : ""}
                </CardBody>
                <Modal size="lg" isOpen={this.state.chiptoggle} fade={this.state.fade} toggle={this.chiptoggle}>
                    <ModalHeader toggle={this.chiptoggle}>Settelment</ModalHeader>
                    <ModalBody>    
                    <Form method="POST" onSubmit={this.handlewithdrawchip}>
                        <Row>
                        <FormGroup className="col-sm-12">
                            <Input type="number" name="chips" onChange={this.handleChange} min="0" placeholder="Please Enter Chips to be Settled" />
                        </FormGroup>
                        <FormGroup className="col-sm-12">
                            <Input type="text" name="description" onChange={this.handleChange} placeholder="Please Enter Description" />
                        </FormGroup>
                        <FormGroup className="col-sm-3">
                            <Button type="submit" className="btn-block my-0 submit-btn-spninner" disabled={this.state.isLoading}>
                                {this.state.isLoading ? <span className="w-25"><ShareSpinner as="span" animation="grow" size="xs" role="status" aria-hidden="true" /> Loading...</span> : "Submit"}
                              </Button>
                        </FormGroup>
                        </Row>
                    </Form>                
                    </ModalBody>
                </Modal>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Chipsummary;
