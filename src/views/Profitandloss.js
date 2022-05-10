import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';

import {getprofitandloss} from './services/profitandloss';
import {getcasinoprofitandloss} from './services/otherPlateformprofitandloss';


import Pagination from "react-js-pagination";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,FormGroup,Input,Label
} from "reactstrap";
import {i18n} from "../components/i18n/hindi";
class Profitandloss extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSection:"lottery",
      Profitandloss :"",
      casinoProfitandloss :"",
      isLoaded :false,
      lottery :true,
      activePage:1,
      search_from: "",
      search_to: "",
      search: "",
      Metadata: 0,
      limit: 10,
      casino :false,
      language: localStorage.getItem('language')
    }
  }

  handleChange = (event) => {
    const { value,checked } = event.target;

    switch (value) {
      case 'casino': 
      
      this.getcasinoprofitandloss(value);
        this.setState({
          showSection:value,
          casino:checked
        });
        
        break;
      case 'lottery': 
      this.getprofitandloss();
        this.setState({
          showSection:value,
          lottery:checked
        });
        break;
      default:
        break;
    }
  }
  getprofitandloss = async () => {
    
    var userid = 0;
    if(this.props.match.params.id){
      userid=this.props.match.params.id;
    }else{
      userid=localStorage.getItem("userId");
    }
    var pagerule = {
      search:this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit:this.state.limit,
      offset:this.state.activePage,
    };
   var Profitandloss =await getprofitandloss({id:userid}, pagerule);
    this.setState({
        Profitandloss : Profitandloss.data.data,
        Metadata:Profitandloss.data.Metadata,
        isLoaded:true
    }); 
  }
  getcasinoprofitandloss = async (game) => {
    this.setState({
      Metadata:0
  }); 
    var userid = 0;
    if(this.props.match.params.id){
      userid=this.props.match.params.id;
    }else{
      userid=localStorage.getItem("userId");
    }
    var pagerule = {
      search:this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit:this.state.limit,
      offset:this.state.activePage,
      id:userid,
      game:game,
      type:"ALL"
    };
   var Profitandloss =await getcasinoprofitandloss(pagerule);
    this.setState({
        casinoProfitandloss : Profitandloss.data.data,
        isLoaded:true,
        Metadata:Profitandloss.data.Metadata
    }); 
  }
  
handlePageChange(pageNumber) {
  this.setState({ activePage: pageNumber }, () => {
      this.getprofitandloss();
  });
}

heandelsearch = async (event) => {
  event.preventDefault();
  var { name, value } = event.target;
  this.setState({ [name]: value }, () => {
      this.getprofitandloss();
  });
}
casinohandlePageChange(pageNumber) {
  this.setState({ activePage: pageNumber }, () => {
      this.getcasinoprofitandloss();
  });
}

casinoheandelsearch = async (event) => {
  event.preventDefault();
  var { name, value } = event.target;
  this.setState({ [name]: value }, () => {
      this.getcasinoprofitandloss();
  });
}
componentDidMount() {
    this.getprofitandloss();
    // this.getcasinoprofitandloss("casino");
}
  render() {
    const {isLoaded , Profitandloss, showSection, casinoProfitandloss} = this.state;
    
    return (
      <>
        <div className="content">
        <Row>
            <Col md="12">
                <Row className="pt-2 pb-3 mb-1">
                  <Col md="6">
                    <FormGroup>
                          <Input type="radio" name="GameType" className="input-radio-off" id="GameType1" defaultValue="lottery" onChange={this.handleChange} defaultChecked={this.state.lottery}/>
                          {localStorage.getItem('role') === "user" ? <label className="card game-radio" htmlFor="GameType1"><span className="checkmark"></span> {this.state.language === "hin" ? i18n.PROFIT_LOSS.LOTTERY.hindi : i18n.PROFIT_LOSS.LOTTERY.english}</label>
                          : <label className="card game-radio" htmlFor="GameType1"><span className="checkmark"></span> {i18n.PROFIT_LOSS.LOTTERY.english}</label>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                          <Input type="radio" name="GameType" className="input-radio-off" id="GameType2" defaultValue="casino" onChange={this.handleChange} defaultChecked={this.state.casino}/>
                          {localStorage.getItem('role') === "user" ? <label className="card game-radio" htmlFor="GameType2"><span className="checkmark"></span> {this.state.language === "hin" ? i18n.PROFIT_LOSS.CASINO.hindi : i18n.PROFIT_LOSS.CASINO.english}</label>
                          : <label className="card game-radio" htmlFor="GameType2"><span className="checkmark"></span> {i18n.PROFIT_LOSS.CASINO.english}</label>}
                    </FormGroup>
                  </Col>
                </Row>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  {localStorage.getItem('role') === "user" ? <CardTitle tag="h4">{this.state.language === "hin" ? i18n.PROFIT_LOSS.PROFIT_LOSS.hindi : i18n.PROFIT_LOSS.PROFIT_LOSS.english}</CardTitle>
                  : <CardTitle tag="h4">{i18n.PROFIT_LOSS.PROFIT_LOSS.english}</CardTitle>}
                  
                </CardHeader>
                <CardBody className="table-responsive">

                  {(showSection === "casino" && isLoaded) ?
                    <>
                    <Row className="mb-2">
                      <FormGroup className="col-sm-4">
                      {localStorage.getItem('role') === "user" ? <Label htmlFor="Search">{this.state.language === "hin" ? i18n.PROFIT_LOSS.FILTER.hindi : i18n.PROFIT_LOSS.FILTER.english}</Label>
                      : <Label htmlFor="Search">{i18n.PROFIT_LOSS.FILTER.english}</Label>}
                        <Input type="text" id="Search" name="search" onChange={this.casinoheandelsearch} placeholder="Search here..." />
                      </FormGroup>
                      <FormGroup className="col-sm-4">
                      {localStorage.getItem('role') === "user" ? <Label htmlFor="from">{this.state.language === "hin" ? i18n.PROFIT_LOSS.FROM.hindi : i18n.PROFIT_LOSS.FROM.english}</Label>
                      : <Label htmlFor="from">{i18n.PROFIT_LOSS.FROM.english}</Label>}
                        <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.casinoheandelsearch} id="from" name="search_from" />
                      </FormGroup>
                      <FormGroup className="col-sm-4">
                      {localStorage.getItem('role') === "user" ? <Label htmlFor="to">{this.state.language === "hin" ? i18n.PROFIT_LOSS.TO.hindi : i18n.PROFIT_LOSS.TO.english}</Label>
                      : <Label htmlFor="to">{i18n.PROFIT_LOSS.TO.english}</Label>}
                        <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.casinoheandelsearch} id="to" name="search_to" />
                      </FormGroup>
                    </Row>

                      <table className="table table-striped">
                        <thead>
                            <tr className="table-info">
                            {localStorage.getItem('role') === "user" ? 
                              <>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.S_NO.hindi : i18n.PROFIT_LOSS.S_NO.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.MARKET_NAME.hindi : i18n.PROFIT_LOSS.MARKET_NAME.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.DATE.hindi : i18n.PROFIT_LOSS.DATE.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.PROFIT.hindi : i18n.PROFIT_LOSS.PROFIT.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.LOSS.hindi : i18n.PROFIT_LOSS.LOSS.english}</th>
                            </>
                            : <>
                            <th>{i18n.PROFIT_LOSS.S_NO.english}</th>
                            <th>{i18n.PROFIT_LOSS.MARKET_NAME.english}</th>
                            <th>{i18n.PROFIT_LOSS.DATE.english}</th>
                            <th>{i18n.PROFIT_LOSS.PROFIT.english}</th>
                            <th>{i18n.PROFIT_LOSS.LOSS.english}</th>
                            </> }
                          </tr>
                        </thead>
                        <tbody>
                          {casinoProfitandloss.length > 0 ? casinoProfitandloss.map((plstatement, key) => {
                            let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                            return(
                              <tr key={key}>
                                <td>{index}</td>
                                <td>{plstatement.marketName}</td>
                                <td>{moment(plstatement.created_at).format('DD-MM-YYYY')}</td>
                                <td className="text-success">{plstatement.profit}</td>
                                <td className="text-danger">{plstatement.loss}</td>
                            </tr>
                            );
                          }) : 
                            <tr>
                              {localStorage.getItem('role') === "user" ? <td colSpan="5">{this.state.language === "hin" ? i18n.PROFIT_LOSS.NO_DATA.hindi : i18n.PROFIT_LOSS.NO_DATA.english}</td> 
                              : <td colSpan="5">No Betting Here</td> }                               
                            </tr>
                          }
                        </tbody>
                      </table>
                      <Pagination
                          className="mt-2"
                          itemClass="page-item"
                          linkClass="page-link"
                          activePage={this.state.activePage}
                          itemsCountPerPage={this.state.limit}
                          totalItemsCount={(this.state.Metadata && this.state.Metadata.totalCount) ? this.state.Metadata.totalCount: 0}
                          pageRangeDisplayed={10}
                          onChange={this.casinohandlePageChange.bind(this)}
                      />
                    </>
                  : (showSection && isLoaded) ?
                    <>
                    <Row className="mb-2">
                      <FormGroup className="col-sm-4">
                        {localStorage.getItem('role') === "user" ? <Label htmlFor="Search">{this.state.language === "hin" ? i18n.PROFIT_LOSS.FILTER.hindi : i18n.PROFIT_LOSS.FILTER.english}</Label>
                        : <Label htmlFor="Search">{i18n.PROFIT_LOSS.FILTER.english}</Label>}
                        <Input type="text" id="Search" name="search" onChange={this.heandelsearch} placeholder="Search here..." />
                      </FormGroup>
                      <FormGroup className="col-sm-4">
                      {localStorage.getItem('role') === "user" ? <Label htmlFor="from">{this.state.language === "hin" ? i18n.PROFIT_LOSS.FROM.hindi : i18n.PROFIT_LOSS.FROM.english}</Label>
                      : <Label htmlFor="from">{i18n.PROFIT_LOSS.FROM.english}</Label>}
                        <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="from" name="search_from" />
                      </FormGroup>
                      <FormGroup className="col-sm-4">
                      {localStorage.getItem('role') === "user" ? <Label htmlFor="to">{this.state.language === "hin" ? i18n.PROFIT_LOSS.TO.hindi : i18n.PROFIT_LOSS.TO.english}</Label>
                      : <Label htmlFor="to">{i18n.PROFIT_LOSS.TO.english}</Label>}
                        <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="to" name="search_to" />
                      </FormGroup>
                    </Row>
                      <table className="table">
                        <thead>
                            <tr className="table-info">
                              {localStorage.getItem('role') === "user" ? 
                              <>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.S_NO.hindi : i18n.PROFIT_LOSS.S_NO.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.MARKET_NAME.hindi : i18n.PROFIT_LOSS.MARKET_NAME.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.BETS_TYPE.hindi : i18n.PROFIT_LOSS.BETS_TYPE.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.BETTING_TIME.hindi : i18n.PROFIT_LOSS.BETTING_TIME.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.DATE.hindi : i18n.PROFIT_LOSS.DATE.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.PROFIT.hindi : i18n.PROFIT_LOSS.PROFIT.english}</th>
                            <th>{this.state.language === "hin" ? i18n.PROFIT_LOSS.LOSS.hindi : i18n.PROFIT_LOSS.LOSS.english}</th>
                            </> 
                            : <>
                            <th>{i18n.PROFIT_LOSS.S_NO.english}</th>
                            <th>{i18n.PROFIT_LOSS.MARKET_NAME.english}</th>
                            <th>{i18n.PROFIT_LOSS.BETS_TYPE.english}</th>
                            <th>{i18n.PROFIT_LOSS.BETTING_TIME.english}</th>
                            <th>{i18n.PROFIT_LOSS.DATE.english}</th>
                            <th>{i18n.PROFIT_LOSS.PROFIT.english}</th>
                            <th>{i18n.PROFIT_LOSS.LOSS.english}</th>
                            </>}
                            </tr>
                        </thead>
                        <tbody>
                          {Profitandloss.length > 0 && Profitandloss.map((plstatement, key) => {
                            let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                            return(
                              <tr key={key}>
                                <td>{index}</td>
                                <td>{plstatement.market_name}</td>
                                <td>{plstatement.bet_type}</td>
                                <td>{plstatement.betting_time}</td>
                                <td>{moment(plstatement.created_at).format('DD-MM-YYYY')}</td>
                                <td className="text-success">{plstatement.profit}</td>
                                <td className="text-danger">{plstatement.loss}</td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      
                      <Pagination
                          className="mt-2"
                          itemClass="page-item"
                          linkClass="page-link"
                          activePage={this.state.activePage}
                          itemsCountPerPage={this.state.limit}
                          totalItemsCount={(this.state.Metadata && this.state.Metadata.totalCount)? this.state.Metadata.totalCount: 0}
                          pageRangeDisplayed={10}
                          onChange={this.handlePageChange.bind(this)}
                      />
                    </> : 
                    <>
                    {localStorage.getItem('role') === "user" ? <h2 className="text-center">{this.state.language === "hin" ? i18n.PROFIT_LOSS.NO_DATA.hindi : i18n.PROFIT_LOSS.NO_DATA.english}</h2>
                    : <h2 className="text-center">{i18n.PROFIT_LOSS.NO_DATA.english}</h2>}
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

export default Profitandloss;
