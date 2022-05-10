
import React from "react";

import { NavLink } from "react-router-dom";
import {getLottery} from './../../services/lottery';
import { getBetting} from './../../services/betting';

import ShareSpinner from "../../SharedComponent/Spinner";
import {Breadcrum} from "./Breadcrum.js";

import moment from 'moment';
import 'moment/locale/zh-cn';
// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Row,
  Col,
} from "reactstrap";




class Bettype extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lotteryData: "",
      BettingData: "",
      isLoaded: false,
      fade: false,
      activePage:1,
      search_from: "",
      search_to: "",
      search: "",
      Metadata: 0,
      limit: 1000,
    };
};



getLottery = async () => {
  let lottryData = await getLottery({id:this.props.match.params.id});
  this.setState({
      lotteryData : lottryData.data.data,
      isLoaded:true
  });
}

getBetting = async () => {
  var pagerule = {
    search:this.state.search,
    from: this.state.search_from,
    to: this.state.search_to,
    limit:this.state.limit,
    offset:this.state.activePage,
  };
  var d1;
          if(this.props.match.params.pathParam2 || this.props.match.params.pathParam2 !== undefined){
            d1 = this.props.match.params.pathParam2;
          }else{
            d1 = moment().format('YYYY-MM-DD');
        
          }
          pagerule.min_date=d1;
  let BettingData = await getBetting({id:localStorage.getItem("userId"),lottery_id:this.props.match.params.id}, pagerule);
  var bettinglistaccordingtobetType = [];
  var Betlistbytype = [];
  BettingData.data.data.map((bet) => {
    var btype;
    if(bet.bet_type === 'single-patti' || bet.bet_type === 'double-patti' || bet.bet_type === 'triple-patti'){
      btype = 'patti';
    }else{
      btype = bet.bet_type;
    }
    var indexName = btype + "-" + bet.betting_time;
    if(typeof bettinglistaccordingtobetType[indexName] === 'undefined') {
      bettinglistaccordingtobetType[indexName] =[];
      bettinglistaccordingtobetType[indexName].push(bet);
    }else {
        bettinglistaccordingtobetType[indexName].push(bet);
    }
    return true;
  });
  var getIndex = Object.keys(bettinglistaccordingtobetType);
  for(var i=0; i<getIndex.length;i++){
    var betArray = {
      _id:bettinglistaccordingtobetType[getIndex[i]][0]._id,
      market_name:bettinglistaccordingtobetType[getIndex[i]][0].market_name,
      lottery_id:bettinglistaccordingtobetType[getIndex[i]][0].lottery_id,
      bet_type:bettinglistaccordingtobetType[getIndex[i]][0].bet_type,
      betting_time:bettinglistaccordingtobetType[getIndex[i]][0].betting_time,
      created_at:bettinglistaccordingtobetType[getIndex[i]][0].created_at,
      digit:bettinglistaccordingtobetType[getIndex[i]][0].digit,
    };
    let totalAmount = 0;
    bettinglistaccordingtobetType[getIndex[i]].map(bet => {
      return totalAmount = Number(totalAmount) + Number(bet.bet_amount);
    });
    betArray.amount = totalAmount;
    Betlistbytype.push(betArray);
  }

  this.setState({
      BettingData : Betlistbytype,
      Metadata:BettingData.data.Metadata
  });
}

componentDidMount() {
  this.getLottery();
  this.getBetting();
}
  render() {
    const {isLoaded, BettingData ,lotteryData} = this.state;
    if(isLoaded){
        const breadcrumb = [
          {
              name: "All Lottery",
              path:"/dashboard/manage-lottery/",
              isactive: false
          },
          {
              name: lotteryData.market_name,
              path:null,
              isactive: true
          }
      ];
      return (
        <>
          <div className="content">
            <Col sm={12} className="px-0">
                <Breadcrum  breadcrumb={breadcrumb}/>
            </Col>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader className="d-sm-flex">
                    <h2 className="text-center">{lotteryData.market_name}</h2>
                  </CardHeader>
                  <CardBody>
                    {
                      !BettingData ? <Col className="col-12 text-center my-5"> <ShareSpinner  /> </Col> :
    
                      <Row>
                        <Col sm="6">
                          <h4 className="my-0">OPEN</h4>
                          <Table responsive>
                            <thead>
                                <tr className="table-info">
                                <th>S.No</th>
                                <th>Bet Type</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                              {BettingData && BettingData.map((betting, key) =>{
                                return (
                                  <>
                                  {betting.betting_time === 'open' ? 
                                    <tr key={key}>
                                        <td>{++key}</td>
                                        <td>{betting.bet_type}</td>
                                        <td>{moment(betting.created_at).format('DD-MM-YYYY HH:mm')}</td>
                                        <td>{betting.amount}</td>
                                        {(localStorage.getItem('role') === 'admin') ? 
                                          <td><NavLink to={"/dashboard/lottery/"+betting.lottery_id+"/"+betting.market_name+"/"+betting.bet_type+"/"+betting.betting_time}>Action</NavLink></td>
                                          :
                                          <td><NavLink to={"/dashboard/manage/today/"+betting.lottery_id+"/"+betting.market_name+"/"+betting.bet_type+"/"+betting.betting_time}>Action</NavLink></td>
                                        }
                                    </tr>
                                  :''
                                }
                                  </>
                                );
                              })}
                            </tbody>
                          </Table>
                        </Col>
                        <Col sm="6">
                        <h4 className="my-0">CLOSE</h4>
                          <Table responsive>
                            <thead>
                                <tr className="table-info">
                                <th>S.No</th>
                                <th>Bet Type</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                              {BettingData && BettingData.map((betting, key) =>{
                                return (
                                  <>
                                  {betting.betting_time === 'close' ? 
                                    <tr key={key}>
                                        <td>{++key}</td>
                                        <td>{betting.bet_type}</td>
                                        <td>{moment(betting.created_at).format('DD-MM-YYYY HH:mm')}</td>
                                        <td>{betting.amount}</td>
                                        {(localStorage.getItem('role') === 'admin') ? 
                                          <td><NavLink to={"/dashboard/lottery/"+betting.lottery_id+"/"+betting.market_name+"/"+betting.bet_type+"/"+betting.betting_time}>Action</NavLink></td>
                                          :
                                          <td><NavLink to={"/dashboard/manage/today/"+betting.lottery_id+"/"+betting.market_name+"/"+betting.bet_type+"/"+betting.betting_time}>Action</NavLink></td>
                                        }
                                    </tr>
                                  :''
                                }
                                  </>
                                );
                              })}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    }
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      );
    }else{
      return(
        <div className="content">
          <h2>Wait for a second!!!!!!!!</h2>
        </div>
      );
    }
  }
}

export default Bettype;
