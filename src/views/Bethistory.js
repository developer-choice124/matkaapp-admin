
import React from "react";

import moment from 'moment';
import 'moment/locale/zh-cn';
import { NavLink } from "react-router-dom";
import Pagination from "react-js-pagination";

import {getcasinoBetHistory} from './services/otherPlateformprofitandloss';
import {all_betting} from './services/betting';
import {i18n} from "components/i18n/hindi";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup, Input,
  Row,
  Col, Label
} from "reactstrap";

class Bethistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSection:"lottery",
      casinoBetHistory :"",
      BetHistory :"",
      lottery :true,
      casino :false,
      activePage:1,
      Metadata:0,
      search_from: "",
      search_to: "",
      search: "",
      limit: 10,
      isLoaded :false,      
      language: localStorage.getItem('language')
    }
  }

  handleChange = (event) => {
    const { value,checked } = event.target;
    this.setState({
      activePage:1,
      search_from: "",
      search_to: "",
      search: "",
      limit: 10,
    });
    switch (value) {
      case 'casino': 
      
        this.getcasinoBetHistory(value);
        this.setState({
          showSection:value,
          casino:checked
        });
        
        break;
      case 'lottery': 
        this.getBetHistory();
        this.setState({
          showSection:value,
          lottery:checked
        });
        break;
      default:
        break;
    }
     
  }

  getBetHistory = async () => {
    var id = 0;
    if(this.props.match.params.id){
      id=this.props.match.params.id;
    }else{
      id=localStorage.getItem("userId");
    }
    var pagerule = {
      search:this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit:this.state.limit,
      offset:this.state.activePage,
      id:id
    };
   var BetHistory =await all_betting({slug:"SETTLED"}, pagerule);
    this.setState({
        BetHistory : BetHistory.data.data,
        isLoaded:true,
        Metadata:BetHistory.data.Metadata
    }); 
  }

  getcasinoBetHistory = async (game) => {
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
      type:"ALL",
      game:game
    };
   var BetHistory =await getcasinoBetHistory(pagerule);
    this.setState({
        casinoBetHistory : BetHistory.data.data,
        isLoaded:true,
        Metadata:BetHistory.data.Metadata
    }); 
  }

  
handlePageChange(pageNumber) {
  this.setState({ activePage: pageNumber }, () => {
      this.getBetHistory();
  });
}
casinohandlePageChange(pageNumber) {
  this.setState({ activePage: pageNumber }, () => {
      this.getcasinoBetHistory();
  });
}

casinoheandelsearch = async (event) => {
  event.preventDefault();
  var { name, value } = event.target;
  this.setState({ [name]: value }, () => {
      this.getcasinoBetHistory();
  });
}
heandelsearch = async (event) => {
  event.preventDefault();
  var { name, value } = event.target;
  this.setState({ [name]: value }, () => {
      this.getBetHistory();
  });
}

componentDidMount() {
    this.getBetHistory();
}
  render() {
    
    const {isLoaded , BetHistory, showSection, casinoBetHistory} = this.state;
    return (
      <>
        <div className="content">
          <Row className="pt-2 pb-3 mb-1">
            <Col md="6">
              <FormGroup>
                    <Input type="radio" name="GameType" className="input-radio-off" id="GameType1" defaultValue="lottery" onChange={this.handleChange} defaultChecked={this.state.lottery}/>
                    {localStorage.getItem('role') === "user" ? <label className="card game-radio" htmlFor="GameType1">{this.state.language === "hin" ? i18n.BETS_HISTORY.LOTTERY.hindi : i18n.BETS_HISTORY.LOTTERY.english}</label>
                    : <label className="card game-radio" htmlFor="GameType1">{i18n.BETS_HISTORY.LOTTERY.english}</label>}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                    <Input type="radio" name="GameType" className="input-radio-off" id="GameType2" defaultValue="casino" onChange={this.handleChange} defaultChecked={this.state.casino}/>
                    {localStorage.getItem('role') === "user" ? <label className="card game-radio" htmlFor="GameType2"> {this.state.language === "hin" ? i18n.BETS_HISTORY.CASINO.hindi : i18n.BETS_HISTORY.CASINO.english}</label>
                    : <label className="card game-radio" htmlFor="GameType2"> {i18n.BETS_HISTORY.CASINO.english}</label>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                {localStorage.getItem('role') === "user" ? 
                  <CardTitle tag="h4">{this.state.language === "hin" ? i18n.BETS_HISTORY.BETS_HISTORY.hindi : i18n.BETS_HISTORY.BETS_HISTORY.english}</CardTitle>
                  : <CardTitle tag="h4">{i18n.BETS_HISTORY.BETS_HISTORY.english}</CardTitle>}
                </CardHeader>
                <CardBody>
                  {(showSection === "casino" && isLoaded) ?
                    <>
                      <Row className="mb-2">
                        <FormGroup className="col-sm-4">
                        {localStorage.getItem('role') === "user" ? <Label htmlFor="Search">{this.state.language === "hin" ? i18n.BETS_HISTORY.FILTER.hindi : i18n.BETS_HISTORY.FILTER.english}</Label>
                        : <Label htmlFor="Search">{i18n.BETS_HISTORY.FILTER.english}</Label>}
                          <Input type="text" id="Search" name="search" onChange={this.casinoheandelsearch} placeholder="Search here..." />
                        </FormGroup>
                        <FormGroup className="col-sm-4">
                        {localStorage.getItem('role') === "user" ? <Label htmlFor="from">{this.state.language === "hin" ? i18n.BETS_HISTORY.FROM.hindi : i18n.BETS_HISTORY.FROM.english}</Label>
                        : <Label htmlFor="from">{i18n.BETS_HISTORY.FROM.english}</Label>}
                          <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.casinoheandelsearch} id="from" name="search_from" />
                        </FormGroup>
                        <FormGroup className="col-sm-4">
                        {localStorage.getItem('role') === "user" ? <Label htmlFor="to">{this.state.language === "hin" ? i18n.BETS_HISTORY.TO.hindi : i18n.BETS_HISTORY.TO.english}</Label>
                        : <Label htmlFor="to">{i18n.BETS_HISTORY.TO.english}</Label>}
                          <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.casinoheandelsearch} id="to" name="search_to" />
                        </FormGroup>
                      </Row>
                      
                      <Col className="table-responsive px-0">
                        <table className="table table-striped">
                          <thead>
                              <tr className="table-info">
                              {localStorage.getItem('role') === "user" ? 
                              <>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.S_NO.hindi : i18n.BETS_HISTORY.S_NO.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.MARKET_NAME.hindi : i18n.BETS_HISTORY.MARKET_NAME.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.DATE.hindi : i18n.BETS_HISTORY.DATE.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.PROFIT_LOSS.hindi : i18n.BETS_HISTORY.PROFIT_LOSS.english}</th>
                                </>
                                : <>
                                <th>{i18n.BETS_HISTORY.S_NO.english}</th>
                                <th>{i18n.BETS_HISTORY.MARKET_NAME.english}</th>
                                <th>{i18n.BETS_HISTORY.DATE.english}</th>
                                <th>{i18n.BETS_HISTORY.PROFIT_LOSS.english}</th>
                                </>}
                              </tr>
                          </thead>
                          <tbody>
                            {casinoBetHistory && casinoBetHistory.map((plstatement, key) => {
                              let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                              return(
                                <tr key={key}>
                                  <td>{index}</td>
                                  <td>{plstatement.marketName}</td>
                                  <td>{moment(plstatement.created_at).format('DD-MM-YYYY')}</td>
                                  {(Math.sign(plstatement.pl) === -1) ? 
                                    <td className="text-danger">{plstatement.pl}</td>
                                    :
                                    <td className="text-success">{plstatement.pl}</td>
                                  }
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
                          totalItemsCount={(this.state.Metadata && this.state.Metadata.totalCount) ? this.state.Metadata.totalCount: 0}
                          pageRangeDisplayed={10}
                          onChange={this.casinohandlePageChange.bind(this)}
                      />
                    </>
                  : (showSection && isLoaded) ?
                      <>
                        <Row className="mb-2">
                          <FormGroup className="col-sm-4">
                          {localStorage.getItem('role') === "user" ? <Label htmlFor="Search">{this.state.language === "hin" ? i18n.BETS_HISTORY.FILTER.hindi : i18n.BETS_HISTORY.FILTER.english}</Label>
                          : <Label htmlFor="Search">{i18n.BETS_HISTORY.FILTER.english}</Label>}
                            <Input type="text" id="Search" name="search" onChange={this.heandelsearch} placeholder="Search here..." />
                          </FormGroup>
                          <FormGroup className="col-sm-4">
                          {localStorage.getItem('role') === "user" ? <Label htmlFor="from">{this.state.language === "hin" ? i18n.BETS_HISTORY.FROM.hindi : i18n.BETS_HISTORY.FROM.english}</Label>
                          : <Label htmlFor="from">{i18n.BETS_HISTORY.FROM.english}</Label>}
                            <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="from" name="search_from" />
                          </FormGroup>
                          <FormGroup className="col-sm-4">
                            {localStorage.getItem('role') === "user" ? <Label htmlFor="to">{this.state.language === "hin" ? i18n.BETS_HISTORY.TO.hindi : i18n.BETS_HISTORY.TO.english}</Label>
                            : <Label htmlFor="to">{i18n.BETS_HISTORY.TO.english}</Label>}
                            <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="to" name="search_to" />
                          </FormGroup>
                        </Row>
                        <Col className="table-responsive px-0">
                          <table className="table table-striped">
                            <thead>
                                <tr className="table-info">
                                  {localStorage.getItem('role') === "user" ? 
                                  <>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.S_NO.hindi : i18n.BETS_HISTORY.S_NO.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.MARKET_NAME.hindi : i18n.BETS_HISTORY.MARKET_NAME.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.BETS_TYPE.hindi : i18n.BETS_HISTORY.BETS_TYPE.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.BETTING_TIME.hindi : i18n.BETS_HISTORY.BETTING_TIME.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.RATE.hindi : i18n.BETS_HISTORY.RATE.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.DIGIT.hindi : i18n.BETS_HISTORY.DIGIT.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.USER.hindi : i18n.BETS_HISTORY.USER.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.BET_AMOUNT.hindi : i18n.BETS_HISTORY.BET_AMOUNT.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.WINNING_AMOUNT.hindi : i18n.BETS_HISTORY.WINNING_AMOUNT.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.DATE.hindi : i18n.BETS_HISTORY.DATE.english}</th>
                                <th>{this.state.language === "hin" ? i18n.BETS_HISTORY.STATUS.hindi : i18n.BETS_HISTORY.STATUS.english}</th>
                                </>
                                : <>
                                <th>{i18n.BETS_HISTORY.S_NO.english}</th>
                                <th>{i18n.BETS_HISTORY.MARKET_NAME.english}</th>
                                <th>{i18n.BETS_HISTORY.BETS_TYPE.english}</th>
                                <th>{i18n.BETS_HISTORY.BETTING_TIME.english}</th>
                                <th>{i18n.BETS_HISTORY.RATE.english}</th>
                                <th>{i18n.BETS_HISTORY.DIGIT.english}</th>
                                <th>{i18n.BETS_HISTORY.USER.english}</th>
                                <th>{i18n.BETS_HISTORY.BET_AMOUNT.english}</th>
                                <th>{i18n.BETS_HISTORY.WINNING_AMOUNT.english}</th>
                                <th>{i18n.BETS_HISTORY.DATE.english}</th>
                                <th>{i18n.BETS_HISTORY.STATUS.english}</th>
                                </>}                                  
                                </tr>
                            </thead>
                            <tbody>
                              {BetHistory && BetHistory.map((history, key) => {
                                let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                                return(
                                  <tr key={key}>
                                    <td>{index}</td>
                                    <td>{history.market_name}</td>
                                    <td>{history.bet_type}</td>
                                    <td>{history.betting_time}</td>
                                    <td>{history.rate}</td>
                                    <td>{history.digit}</td>
                                    <td>{history.userDetails.length > 0 ? 
                                      <NavLink to={"/dashboard/bethistory/"+history.userDetails[0]._id} title="history">
                                        {history.userDetails[0].username}
                                    </NavLink>
                                    : ""}</td>
                                    <td>{history.bet_amount}</td>
                                    <td>{history.status === "WIN" ? history.bet_amount*history.rate : "0"}</td>
                                    <td>{moment(history.created_at).format('DD-MM-YYYY HH:mm')}</td>
                                    <td>
                                      {(history.status === "PENDING" && localStorage.getItem("role") === 'admin') ?
                                        <NavLink to={"/dashboard/lottery/"+history.lottery_id+"/"+history.market_name+"/"+history.bet_type+"/"+history.betting_time+"/"+moment(history.created_at).format('DD-MM-YYYY')}>{history.status}</NavLink>
                                        : history.status
                                      }
                                    </td>
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
                            totalItemsCount={(this.state.Metadata && this.state.Metadata.totalCount) ? this.state.Metadata.totalCount: 0}
                            pageRangeDisplayed={10}
                            onChange={this.handlePageChange.bind(this)}
                        />
                      </> : ""
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

export default Bethistory;
