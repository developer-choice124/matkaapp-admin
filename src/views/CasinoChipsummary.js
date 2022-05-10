
import React from "react";

import {getcasinoAccountstatement, settalmentUpdate} from './services/otherPlateformAccountstatement';

// reactstrap components
import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form, FormGroup, Input,
} from "reactstrap";

import ShareSpinner from "./SharedComponent/Spinner";

class CasinoChipsummary extends React.Component { 
constructor(props) {

  super(props);
  this.state = {
    modal: false,
    chiptoggle: false,
    DebitAccountstatement :"",
    CreditAccountstatement :"",
    isLoaded :false,
    DebitisLoaded :false,
    isLoading:false,
    user_id : null,
    senderId : null,
    type : null,
    chips : 0,
    description : 0,
    totaldebit:0,
    totalcredit:0,
  }
  
  this.chiptoggle = this.chiptoggle.bind(this);
}


getDebitAccountstatement = async () => {

 var Accountstatement = await getcasinoAccountstatement({id:localStorage.getItem("userId"),type:"DEBIT",game:"casino"});
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

 var Accountstatement = await getcasinoAccountstatement({id:localStorage.getItem("userId"),type:"CREDIT",game:"casino"});
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
    settalmentUpdate(chipdata).then((response) => {
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
  const {isLoaded , CreditAccountstatement,DebitAccountstatement,DebitisLoaded,totalcredit,totaldebit} = this.state;
    return (
      <>
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
                            <td>{statement.sender_name}</td>
                            <td>{statement.sender_name} CR From {statement.username}</td>
                            <td>{statement.amount}</td>
                            <td><Button color="primary" onClick={() => this.chiptoggle(statement.user_id,statement.sender_id,"CREDIT")}>Settlement</Button></td>
                          </tr>
                        );
                    })}
                    <tr className="bg-primary">
                    <td colSpan="2"><b>Total</b></td>
                    <td colSpan="2"> {totalcredit} </td>
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
                  {DebitisLoaded ? DebitAccountstatement.map((statement, key) =>{
                      return(
                        <tr key={key}>
                            <td>{statement.username}</td>
                            <td>{statement.username} DR From {statement.sender_name}</td>
                            <td>{statement.amount}</td>
                            {localStorage.getItem("role") === "master" ? 
                              <>
                                <td></td>
                              </>
                              :
                          <td><Button color="danger" onClick={() => this.chiptoggle(statement.user_id,statement.sender_id,"CREDIT")}>Settlement</Button></td>
                            }
                        </tr>
                      );
                  }): <tr><td  colSpan="4">No Settlement Yet.</td></tr>}
                  <tr className="bg-danger">
                    <td colSpan="2"><b>Total</b></td>
                    <td colSpan="2"> {totaldebit}</td>
                  </tr>
                </tbody> 
              </Table>
            </Col>
          </Row>
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
      </>
    );
  }
}

export default CasinoChipsummary;
