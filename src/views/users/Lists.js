
import React from "react";
import { NavLink } from "react-router-dom";
import {allusers, deleteuser, changePassword, Add, blocked} from './../services/users';
import {getAccountstatement} from './../services/accountstatement';
import {AddCihps} from './../services/chips';
import {getBattingbyuserId} from './../services/betting';
import ShareSpinner from "./../SharedComponent/Spinner";

// reactstrap component
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form, FormGroup, Label, Input,Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

import moment from 'moment';
import 'moment/locale/zh-cn';

import Pagination from "react-js-pagination";

class Lists extends React.Component {
    constructor(props) {
    
        var today = new Date(),

        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        super(props);
        this.state = {
            modal: false,
            chiptoggle: false,
            changepasswordtoggle: false,
            addmastertoggle: false,
            dropdownOpen: {
                fleg:null
            },
            fade: false,
            currentDate: date,
            isLoaded:"",
            Users:"",
            username:"",
            name:"",
            commission:"",
            isLoading:false,
            parentId:"",
            role:"",
            senderId:"",
            reciverId: "",
            chipdescription:"",
            chips:"",
            userId:"",
            newpassword:"",
            cnewpassword:"",
            userError:"",
            chipError:"",
            passwordError:"",
            activePage:1,
            search_from: "",
            search_to: "",
            search: "",
            Metadata: 0,
            limit: 10,
            withdrawalError:""
        };

        this.chiptoggle = this.chiptoggle.bind(this);
        this.changepasswordtoggle = this.changepasswordtoggle.bind(this);
        this.addmastertoggle = this.addmastertoggle.bind(this);
        this.dropdowntoggle = this.dropdowntoggle.bind(this);

    };

    dropdowntoggle(index) {
        let dropdownOpen = this.state.dropdownOpen;
        if(dropdownOpen.fleg !== index){
            dropdownOpen.fleg = index;
        }else{
            dropdownOpen.fleg = null;
        }
        this.setState({ dropdownOpen});
    }

    chiptoggle(senderId,reciverId) {
        this.setState({
            chiptoggle: !this.state.chiptoggle,
            senderId:senderId,
            reciverId:reciverId
        });
    }

    changepasswordtoggle(userId) {
        this.setState({
            changepasswordtoggle: !this.state.changepasswordtoggle,
            userId:userId
        });
    }

    addmastertoggle(userId,role) {
        let userrole = "supermaster";
        if(role==="supermaster"){
            userrole = "master";
        }else if(role === "master"){
            userrole = "user";
        }
        this.setState({
            addmastertoggle: !this.state.addmastertoggle, 
            parentId:userId,
            role:userrole
        });
    }

    blockUser = async (userId,role) =>{
        await blocked({id:userId,role:role,is_blocked:true});
        this.Users();
    }

    unblockeduser = async (userId,role) =>{
        await blocked({id:userId,role:role,is_blocked:false});
        this.Users();
    }

    Userdelete = async (userId) => {
        let Deleteuser =  await deleteuser({id:userId,status:false});
        return Deleteuser;
       }

    deleteUser = async (userId, userRoll) => {
        var AccountCreditStatement = true;
        var AccountDebitStatement = true;
        var userData = {
            user_id:userId,
            status:"PENDEING",
            is_active:true
        };

        // check user chip summery
        if(userRoll === "supermaster" || userRoll === "master"){
             AccountCreditStatement = await getAccountstatement({id:userId,type:"CREDIT"});
             AccountDebitStatement = await getAccountstatement({id:userId,type:"DEBIT"});
             if(AccountCreditStatement.data.data.length > 0 || AccountDebitStatement.data.data.length > 0){ 
                 AccountCreditStatement = false;
                 AccountDebitStatement = false;
                }else{
                    if(userRoll === "supermaster"){
                        userData.role = "supermaster";
                    }else{
                        userData.role = "master";
                    }
                    AccountCreditStatement = true;
                    AccountDebitStatement = true;
                }           
            }else{
                userData.role = "user";
                AccountCreditStatement = true;
                AccountDebitStatement = true;
            }
        
        if(AccountCreditStatement && AccountDebitStatement){

            await getBattingbyuserId(userData);
            const confirm = window.confirm('Delete the user?');
            if(confirm){
                this.Userdelete(userId);
                window.location.reload(); 
            }

        }else{
            alert("Please Settled You Chips");
        } 

    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({[name]: value});
    }

    handleMaster = (event) => {
        event.preventDefault();
          const superdata = 
          {
            username:this.state.username,
            name:this.state.name,
            commission:this.state.commission,
            role:this.state.role,
            parent_id:this.state.parentId, // Admin ID if role supermaster
            password:this.state.username+"1234"
            };
            Add(superdata).then(function(response) {
              window.location.reload();   
          });
        }

    handlechip = async (event) => {
        this.setState({ isLoading: true });
        event.preventDefault();
          const chipdata = 
          {
            sender_id:this.state.senderId?this.state.senderId:localStorage.getItem("userId"),
            reciver_id:this.state.reciverId,
            chips:this.state.chips,
            description:this.state.chipdescription,
            };
         var response = await AddCihps(chipdata).then((response) => {
            window.location.reload();  
              return response; 
          }).catch((error) => {
            return error;
          });
          if(response.status === 201){
            window.location.reload();   
          }else if(response.response && response.response.data){
            this.setState({
                chipError:response.response.data.errors[0],
                isLoading:false
            });
          }
        }

    handlewithdrawchip = async(event) => {
        event.preventDefault();
          const chipdata = 
          {
                reciver_id:this.state.senderId?this.state.senderId:localStorage.getItem("userId"),
                sender_id:this.state.reciverId,
                chips:this.state.chips,
                description:this.state.chipdescription?this.state.chipdescription:null,
            };
            var response = await AddCihps(chipdata).then(function(response) {
                return response; 
            }).catch((error) => {
              return error;
            });
            if(response.status === 200){
              window.location.reload();   
            }else if(response.response && response.response.data){
              this.setState({
                withdrawalError:response.response.data.errors[0],
                isLoading:false
              });
            }
        }

    handlechangepassword = async (event) => {

        event.preventDefault();
          const passworddata = 
          {
            user_id:this.state.userId,
            newpassword:this.state.newpassword,
            cnewpassword:this.state.cnewpassword,
          };
        var response = await changePassword(passworddata).then(function(response) {
                return response; 
            }).catch((error) => {
                return error;
            });
            if(response.status === 200){
                this.setState({
                    changepasswordtoggle: !this.state.changepasswordtoggle
                });  
            }else if(response.response && response.response.data){
                this.setState({
                    passwordError:response.response.data.errors[0]
                });
            }else{
                this.setState({
                    changepasswordtoggle: !this.state.changepasswordtoggle
                });
            }
        }

    Users = async () => {

        let userData = "";
        var pagerule = {
            search:this.state.search,
            from: this.state.search_from,
            to: this.state.search_to,
            limit:this.state.limit,
            offset:this.state.activePage,
          };

        if(this.props.role === "supermaster"){
            userData =await allusers({role:this.props.role}, pagerule);
        }else{
            userData =await allusers({role:this.props.role,id:this.props.parentId?this.props.parentId:localStorage.getItem("userId")}, pagerule);
        }

        this.setState({
            Users : userData.data.data,
            isLoaded:true,
            Metadata:userData.data.Metadata
        }); 
    }
    
    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber }, () => {
            this.Users();
        });
    }
    
    heandelsearch = async (event) => {
        event.preventDefault();
        var { name, value } = event.target;
        this.setState({ [name]: value }, () => {
            this.Users();
        });
    }

    componentDidMount() {
        this.Users();
    }

    render() {

        let userRole = "Master";
        if(this.props.role === "master") {
            userRole = "User";
        }else if(this.props.role === "supermaster") {
            userRole = "Master";
        }

        const { Users,isLoaded, chipError, withdrawalError,passwordError } = this.state;
        
        if(isLoaded){
            return (
                <>
                    <Row className="mb-2">
                        <FormGroup className="col-sm-4">
                            <Label htmlFor="Search">Filter</Label>
                            <Input type="text" id="Search" name="search" onChange={this.heandelsearch} placeholder="Search here..." />
                        </FormGroup>
                        <FormGroup className="col-sm-4">
                            <Label htmlFor="from">From</Label>
                            <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="from" name="search_from" />
                        </FormGroup>
                        <FormGroup className="col-sm-4">
                            <Label htmlFor="to">TO</Label>
                            <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="to" name="search_to" />
                        </FormGroup>
                    </Row>
                    <Col className="table-responsive px-0 py-5 py-sm-0">
                        <table className="table table-striped">
                            <thead className="table-info text-primary">
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Number</th>
                                    {(this.props.role === "master") ? 
                                        <>
                                            <th>S. Masters</th>
                                            <th>Users</th>
                                        </>
                                        : (this.props.role === "user") ? 
                                            <th>Masters</th>
                                        : (this.props.role === "supermaster") ? 
                                            <th>Masters</th>
                                     : ""}
                                    <th>Sharing</th>
                                    <th>Status</th>
                                    <th><Col className="d-none d-sm-block">Action</Col></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Users.map((user ,index)=> (
                                    <tr key={index}>
                                        <td>{user.name} <p className="text-success mb-1">{user.chips}</p></td>
                                        <td style={{'textTransform': 'none'}}>{user.username}</td>
                                        <td>{user.number}</td>
                                        {(this.props.role === "master") ? 
                                        <>
                                            <td><NavLink to="/dashboard/allusers/">View S. Master</NavLink></td>
                                            <td><NavLink to={"/dashboard/users/"+user._id}>View Users</NavLink></td>
                                        </>
                                        : (this.props.role === "user") ? 
                                            <td><NavLink to="/dashboard/allusers/">View S. Master</NavLink></td>
                                        : (this.props.role === "supermaster") ? 
                                            <td><NavLink to={"/dashboard/masters/"+user._id}>View Master</NavLink></td>
                                        : ""}
                                        <td>{user.commission?user.commission+"%":"NULL"}</td>
                                        <td>{user.is_active?"Active":"Blocked"}</td>
                                        <>
                                            {(localStorage.getItem("is_blocked") ==="true" || user.is_blocked === true) ?
                                                <td>
                                                    <Button onClick={() => this.unblockeduser(user._id,user.role)} className="btn btn-outline-danger btn-round p-1 p-sm-2 m-1 m-sm-2" title="Unblock User">
                                                        UnBlocked User
                                                    </Button>
                                                </td>
                                            : <td>
                                                <Col className="d-none d-sm-block">
                                                    {(this.props.role === "master" || this.props.role === "supermaster") ? 
                                                        <>
                                                            <Button onClick={() => this.addmastertoggle(user._id,user.role)} className="btn btn-outline-warning btn-round p-1 p-sm-2 m-1 m-sm-2" title={"Add "+userRole}>
                                                                <i className="fa fa-user" />
                                                            </Button>
                                                        </>
                                                    : ""}
                                                    <Button onClick={() => this.chiptoggle(this.props.parentId,user._id)} className="btn btn-outline-warning btn-round p-1 p-sm-2 m-1 m-sm-2" title="Add/Withdraw Chips">
                                                        <i className="nc-icon nc-money-coins" />
                                                    </Button>
                                                    <Button onClick={() => this.changepasswordtoggle(user._id)} className="btn btn-outline-info btn-round p-1 p-sm-2 m-1 m-sm-2" title="Change Password">
                                                        <i className="fa fa-key" />
                                                    </Button>
                                                    <NavLink to={"/dashboard/edituser/"+user._id} className="btn btn-outline-warning btn-round p-1 p-sm-2 m-1 m-sm-2" title={"Edit "+userRole}>
                                                        <i className="fa fa-edit" />
                                                    </NavLink>
                                                    <Button onClick={() => this.blockUser(user._id,user.role)} className="btn btn-outline-info btn-round p-1 p-sm-2 m-1 m-sm-2" title="Lock Beting">
                                                        <i className="fa fa-lock" />
                                                    </Button>
                                                    <br />
                                                    <Button onClick={() => this.deleteUser(user._id,user.role)} className="btn btn-outline-success btn-round p-1 p-sm-2 m-1 m-sm-2" title="Delete User">
                                                        <i className="fa fa-trash" />
                                                    </Button>
                                                    <NavLink to={"/dashboard/bethistory/"+user._id} className="btn btn-outline-warning btn-round p-1 p-sm-2 m-1 m-sm-2" title="history">
                                                        <i className="fa fa-history" />
                                                    </NavLink>
                                                    <NavLink to={"/dashboard/user/account-statement/"+user._id} className="btn btn-outline-info btn-round p-1 p-sm-2 m-1 m-sm-2" title="Account Statement">
                                                        S
                                                    </NavLink>
                                                    <NavLink to={"/dashboard/user/profitandloss/"+user._id} className="btn btn-outline-success btn-round p-1 p-sm-2 m-1 m-sm-2" title="Profit And Loss">
                                                        P-L
                                                    </NavLink>
                                                </Col>
                                                <Dropdown className="d-block d-sm-none" isOpen={this.state.dropdownOpen.fleg === index ? true : false} toggle={() => this.dropdowntoggle(index)}>
                                                    <DropdownToggle style={{'width':'200px'}}>
                                                        ACTION
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem>
                                                            {(this.props.role === "master" || this.props.role === "supermaster") && 
                                                                <>
                                                                    <Button onClick={() => this.addmastertoggle(user._id,user.role)} className="btn btn-outline-warning btn-round p-1 p-sm-2 m-1 m-sm-2" title={"Add "+userRole}>
                                                                        <i className="fa fa-user" />
                                                                    </Button>
                                                                </>
                                                            }
                                                            <Button onClick={() => this.chiptoggle(this.props.parentId,user._id)} className="btn btn-outline-warning btn-round p-1 p-sm-2 m-1 m-sm-2" title="Add/Withdraw Chips">
                                                                <i className="nc-icon nc-money-coins" />
                                                            </Button>
                                                            <Button onClick={() => this.changepasswordtoggle(user._id)} className="btn btn-outline-info btn-round p-1 p-sm-2 m-1 m-sm-2" title="Change Password">
                                                                <i className="fa fa-key" />
                                                            </Button>
                                                            <NavLink to={"/dashboard/edituser/"+user._id} className="btn btn-outline-warning btn-round p-1 p-sm-2 m-1 m-sm-2" title={"Edit "+userRole}>
                                                                <i className="fa fa-edit" />
                                                            </NavLink>
                                                            <Button onClick={() => this.blockUser(user._id,user.role)} className="btn btn-outline-info btn-round p-1 p-sm-2 m-1 m-sm-2" title="Lock Beting">
                                                                <i className="fa fa-lock" />
                                                            </Button>
                                                            <br />
                                                            <Button onClick={() => this.deleteUser(user._id,user.role)} className="btn btn-outline-success btn-round p-1 p-sm-2 m-1 m-sm-2" title="Delete User">
                                                                <i className="fa fa-trash" />
                                                            </Button>
                                                            <NavLink to={"/dashboard/bethistory/"+user._id} className="btn btn-outline-warning btn-round p-1 p-sm-2 m-1 m-sm-2" title="history">
                                                                <i className="fa fa-history" />
                                                            </NavLink>
                                                            <NavLink to={"/dashboard/user/account-statement/"+user._id} className="btn btn-outline-info btn-round p-1 p-sm-2 m-1 m-sm-2" title="Account Statement">
                                                                S
                                                            </NavLink>
                                                            <NavLink to={"/dashboard/user/profitandloss/"+user._id} className="btn btn-outline-success btn-round p-1 p-sm-2 m-1 m-sm-2" title="Profit And Loss">
                                                                P-L
                                                            </NavLink>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </td>
                                            }
                                        </>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                    <Pagination
                        className="mt-2"
                        itemClass="page-item"
                        linkClass="page-link"
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.limit}
                        totalItemsCount={this.state.Metadata? this.state.Metadata.totalCount: 0}
                        pageRangeDisplayed={10}
                        onChange={this.handlePageChange.bind(this)}
                    />
                    <Modal size="lg" isOpen={this.state.chiptoggle} fade={this.state.fade } toggle={this.chiptoggle}>

                        <ModalHeader toggle={this.chiptoggle}>Add Chip</ModalHeader>
                        <ModalBody>   
                        <Form method="POST" onSubmit={this.handlechip}>
                            {chipError && 
                                <Alert color="danger">{chipError}</Alert>
                              }
                            <Row>
                                <FormGroup className="col-sm-12">
                                    <Label>Add Chips</Label>
                                    <Input type="number" name="chips" onChange={this.handleChange} min="0" placeholder="Please Enter Chips" />
                                </FormGroup>
                                <FormGroup className="col-sm-12">
                                    <Label>Description</Label>
                                    <textarea className="form-control" onChange={this.handleChange} name="chipdescription"></textarea>
                                </FormGroup>
                            </Row>
                            <FormGroup check row>
                                <Col sm={{ size: 4}}>
                                    {/* <Button type="submit" className="btn-block" >Submit</Button> */}
                                    <Button type="submit" className="mx-auto btn-md w-100 theme-btn rounded submit-btn-spninner" disabled={this.state.isLoading}>
                                        {this.state.isLoading ? <span className="w-25"><ShareSpinner as="span" animation="grow" size="xs" role="status" aria-hidden="true" /> Loading...</span> : "Submit"}
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>  
                        <hr />   
                        <h4 className="mb-0">Withdraw Chips</h4>  
                        <Form method="POST" onSubmit={this.handlewithdrawchip}>
                            {withdrawalError && 
                                <Alert color="danger">{withdrawalError}</Alert>
                              }
                        
                            <Row>
                            <Label className="col-sm-12">Chips to be withdrawn</Label>
                            <FormGroup className="col-sm-9">
                                <Input type="number" name="chips" onChange={this.handleChange} min="0" placeholder="Please Enter Chips to be withdrawn" />
                            </FormGroup>
                            <FormGroup className="col-sm-3">
                                <Button type="submit" className="mx-auto btn-md w-100 theme-btn rounded submit-btn-spninner my-0" disabled={this.state.isLoading}>
                                        {this.state.isLoading ? <span className="w-25"><ShareSpinner as="span" animation="grow" size="xs" role="status" aria-hidden="true" /> Loading...</span> : "Submit"}
                                    </Button>
                            </FormGroup>
                            </Row>
                        </Form>                
                        </ModalBody>
                    </Modal>
                    <Modal size="lg" isOpen={this.state.changepasswordtoggle} fade={this.state.fade } toggle={this.changepasswordtoggle}>
                        <ModalHeader toggle={this.changepasswordtoggle}>Change Password</ModalHeader>
                        <ModalBody>   
                        <Form  method="POST" onSubmit={this.handlechangepassword}>
                            {passwordError && 
                                <Alert color="danger">{passwordError}</Alert>
                              }
                            <Row>
                                <FormGroup className="col-sm-6">
                                    <Label>New Password</Label>
                                    <Input type="password" name="newpassword" onChange={this.handleChange} placeholder="New Password" />
                                </FormGroup>
                                <FormGroup className="col-sm-6">
                                    <Label>Confirm Password</Label>
                                    <Input type="password" name="cnewpassword" onChange={this.handleChange} placeholder="Confirm Password"/>
                                </FormGroup>
                            </Row>
                            <FormGroup check row>
                                <Col sm={{ size: 4}}>
                                    <Button type="submit" className="btn-block" >Submit</Button>
                                </Col>
                            </FormGroup>
                        </Form>               
                        </ModalBody>
                    </Modal>
                    <Modal size="lg" isOpen={this.state.addmastertoggle} fade={this.state.fade } toggle={this.addmastertoggle}>
                        <ModalHeader toggle={this.addmastertoggle}>Add {userRole}</ModalHeader>
                        <ModalBody>   
                        <Form method="POST" onSubmit={this.handleMaster} >
                            <Row>
                                <FormGroup className="col-sm-4">
                                    <Label>Username</Label>
                                    <Input type="text" name="username" onChange={this.handleChange} placeholder="Username" />
                                </FormGroup>
                                <FormGroup className="col-sm-4">
                                    <Label>Full Name</Label>
                                    <Input type="text" name="name" onChange={this.handleChange} placeholder="Full Name"/>
                                </FormGroup>
                                {(this.state.role === "master" || this.state.role === "supermaster") ? 
                                    <FormGroup className="col-sm-4">
                                        <Label>Sharing</Label>
                                        <Input type="number" name="commission" onChange={this.handleChange} placeholder="Sharing"/>
                                    </FormGroup>
                                : ""}
                            </Row>
                            <FormGroup check row>
                                <Col sm={{ size: 4}}>
                                    <Button type="submit" className="btn-block" >Submit</Button>
                                </Col>
                            </FormGroup>
                        </Form>               
                        </ModalBody>
                    </Modal>
                </>
            );
        }else{
            return (
                <h2>Please add {this.props.role}.</h2>
            );
        }
    }
}

export default Lists;
