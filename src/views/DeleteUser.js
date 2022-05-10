
import React from "react";
import {getdeletedUser,deleteuser} from './services/users';
import {getBattingbyuserId} from './services/betting';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,Button, FormGroup, Label, Input
} from "reactstrap";


import moment from 'moment';
import 'moment/locale/zh-cn';

import Pagination from "react-js-pagination";

class DeleteUser extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      DeleteUser :[],
      activePage:1,
      search_from: "",
      search_to: "",
      search: "",
      limit: 10,
      isLoaded :false
    }
  }

  getDeleteUser = async () => {
    
    let userData = "";
    var pagerule = {
      search:this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit:this.state.limit,
      offset:this.state.activePage,
      role:localStorage.getItem("role"),
      id:localStorage.getItem("userId")
    };
    userData =await getdeletedUser(pagerule);
    this.setState({
        DeleteUser : userData.data.data,
        isLoaded:true,
        Metadata:userData.data.Metadata
    }); 
}

Userdelete = async (userId) => {
    var pagerule = {
      search:this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit:this.state.limit,
      offset:this.state.activePage,
    };
    let Deleteuser =  await deleteuser({id:userId,status:true},pagerule);
    return Deleteuser;
   }

undeleteuser = async (userId, userRoll) => {
    var userData = {
        user_id:userId,
        role:userRoll,
        status:"PENDEING",
        is_active:false
    };

    await getBattingbyuserId(userData);
    const confirm = window.confirm('Are You sure to restore this user?');
    if(confirm){

        this.Userdelete(userId);
        window.location.reload(); 
        
    }
}

handlePageChange(pageNumber) {
  this.setState({ activePage: pageNumber }, () => {
      this.getDeleteUser();
  });
}

heandelsearch = async (event) => {
  event.preventDefault();
  var { name, value } = event.target;
  this.setState({ [name]: value }, () => {
      this.getDeleteUser();
  });
}
componentDidMount() {
  this.getDeleteUser();
}
render() {
  const {isLoaded , DeleteUser} = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Delete User</CardTitle>
                </CardHeader>
                <CardBody>
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
                {isLoaded &&
                  <>
                    <table className="table table-striped">
                        <thead>
                            <tr className="table-info">
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Sharing</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                          {DeleteUser.length > 0 ? DeleteUser.map((user, key) =>{
                            let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                            return(
                            <tr key={key}>
                                <td>{index}</td>
                                <td>{user.name} <p className="text-success mb-1">{user.chips}</p></td>
                                <td>{user.username}</td>
                                <td>{user.commission?user.commission+"%":"NULL"}</td>
                                <td>{user.is_active?"Active":"Deleted"}</td>
                                <td>
                                    <Button onClick={() => this.undeleteuser(user._id,user.role)} className="btn btn-outline-danger btn-round p-2 m-2" title="Unblock User">
                                        Restore User
                                    </Button>
                                </td>
                            </tr>
                            );
                          }) : <tr className="text-center"><td colSpan="6">Nothing to show.</td></tr>}
                        </tbody>
                    </table>
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
                  </>
}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default DeleteUser;
