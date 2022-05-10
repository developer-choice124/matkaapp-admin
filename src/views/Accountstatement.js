
import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';

import {getChiphistory} from './services/chips';
import Pagination from "react-js-pagination";
import ShareSpinner from "./SharedComponent/Spinner";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,FormGroup, Label, Input
} from "reactstrap";
import {i18n} from "../components/i18n/hindi";
class Accountstatement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ChipsTransactionData :"",
      isLoaded :false,
      activePage:1,
      search_from: "",
      search_to: "",
      search: "",
      limit: 10,
      Metadata: 0,
      language: localStorage.getItem('language'),
    }
  }

  getChiphistory = async () => {
    var pagerule = {
      search:this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit:this.state.limit,
      offset:this.state.activePage,
    };
    var id = 0;
    if(this.props.match.params.id){
      id=this.props.match.params.id;
    }else{
      id=localStorage.getItem("userId");
    }
    var ChipsTransactionData =await getChiphistory({id:id}, pagerule);
    this.setState({
        ChipsTransactionData : ChipsTransactionData.data.data,
        isLoaded:true,
        Metadata:ChipsTransactionData.data.Metadata
      });
    }
    
    
    handlePageChange(pageNumber) {
      this.setState({ activePage: pageNumber }, () => {
        this.getChiphistory();
      });
    }
casinohandlePageChange(pageNumber) {
  this.setState({ activePage: pageNumber }, () => {
    this.getChiphistory();
  });
}

heandelsearch = async (event) => {
  event.preventDefault();
  var { name, value } = event.target;
  this.setState({ [name]: value }, () => {
    this.getChiphistory();
  });
}
componentDidMount() {
  this.getChiphistory();
}
render() {
  
  const {isLoaded , ChipsTransactionData} = this.state;
  
  return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                    {/* {localStorage.getItem('role') === "user" ?  */}
                    <CardTitle tag="h4">{this.state.language === "hin" ? i18n.ACCOUNT_STATEMENT.ACCOUNT_STATEMENT.hindi : i18n.ACCOUNT_STATEMENT.ACCOUNT_STATEMENT.english}</CardTitle>
                    {/* : <CardTitle tag="h4">{i18n.ACCOUNT_STATEMENT.ACCOUNT_STATEMENT.english}</CardTitle>}                   */}
                </CardHeader>
                <CardBody>
                {
                  !isLoaded && <Col className="col-12 text-center my-5"> <ShareSpinner  /> </Col>
                }
                {isLoaded &&
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
                    <Col className="table-responsive px-0">
                      <table className="table table-striped">
                        <thead className="text-primary">
                          <tr className="table-info">
                            <th>S.No</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Credit</th>
                            <th>Debit</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                        {ChipsTransactionData && ChipsTransactionData.map((transection, key) => {
                          let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                                return(
                                  <tr key={key}>
                                    <td>{index}</td>
                                    <td>{moment(transection.created_at).format('DD-MM-YYYY, h:mm')}</td>
                                    <td>
                                      {(transection.senderDetails && transection.senderDetails.length>0) ? 
                                      
                                        <a href={"/dashboard/user/account-statement/" + transection.senderDetails[0]._id} title="Account Statement">
                                          {transection.description}
                                        </a>
                                        :
                                        <>
                                          {transection.description}
                                        </>
                                      }
                                    </td>
                                    <td className="text-success">{transection.credit}</td>
                                    <td className="text-danger">{transection.debit}</td>
                                    <td><span className="btn btn-success">{transection.balance}</span></td>
                                  </tr>
                                );
                        })}
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
                          onChange={this.casinohandlePageChange.bind(this)}
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

export default Accountstatement;
