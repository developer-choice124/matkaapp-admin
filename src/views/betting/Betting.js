
import React from "react";
import { Card, CardBody, CardHeader, Row, Col, Table } from 'reactstrap';

import { getBetting, plbyDigit } from './../services/betting';
import { getLottery } from './../services/lottery';
import ShareSpinner from "../SharedComponent/Spinner";
import { Breadcrum } from "../managelottery/components/Breadcrum";

import { single, singlepatti, doublepatti, tripalpatti, jodi } from './../../components/variable/global'
import moment from 'moment';
import 'moment/locale/zh-cn';


class Betting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lotteryData: "",
            BettingData: "",
            activePage: 1,
            search_from: "",
            search_to: "",
            search: "",
            Metadata: 0,
            limit: 10,
            digitarray: "",
            AdminPl: '',
            AdminPlload: false,
        };
    };
    getLottery = async () => {
        let lottryData = await getLottery({id:this.props.match.params.id});
        this.setState({
            lotteryData : lottryData.data.data
        });
      }
    
  getpl = async () => {
    var body = {
      lottery_id:this.props.match.params.id,
      betting_time:this.props.match.params.time,
      digit:this.state.digitarray
    };
    
    var d1;
    if(this.props.match.params.pathParam2 || this.props.match.params.pathParam2 !== undefined){
      d1 = this.props.match.params.pathParam2;
    }else{
      d1 = moment().format('YYYY-MM-DD');
  
    }
    body.min_date=d1;
    let plData = await plbyDigit(body);
    this.setState({
      AdminPl : plData.data.data,
      AdminPlload:true
  });

  }

    setbetTyle = () => {
        if(this.props.match.params.type === 'single'){
          this.setState({
            digitarray:single
          }, () => {
            this.getpl();
          });
        }else if(this.props.match.params.type === 'single-patti' || this.props.match.params.type === 'double-patti' || this.props.match.params.type === 'triple-patti'){
          const arr = [...singlepatti,...doublepatti,...tripalpatti];
          this.setState({
            digitarray:arr
          }, () => {
            this.getpl();
          });
        }else if(this.props.match.params.type === 'jodi'){
          this.setState({
            digitarray:jodi
          }, () => {
            this.getpl();
          });
        }else{
          window.location.replace('admin/today/'+this.props.match.params.id);
        }
      }
    
  getBetting = async () => {
    var pagerule = {
      search:this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit:this.state.limit,
      offset:this.state.activePage,
      bet_type:this.props.match.params.type,
      betting_time:this.props.match.params.time,
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
    var Betlisttype = [];
    BettingData.data.data.map((list) => {
      if(list.lottery_id === this.props.match.params.id && list.betting_time === this.props.match.params.time){
        if(typeof bettinglistaccordingtobetType[list.digit] === 'undefined') {
          bettinglistaccordingtobetType[list.digit] =[];
          bettinglistaccordingtobetType[list.digit].push(list);
        }else {
            bettinglistaccordingtobetType[list.digit].push(list);
        }
      }else if(list.lottery_id === this.props.match.params.id && list.bet_type === 'jodi'){
        if(typeof bettinglistaccordingtobetType[list.digit] === 'undefined') {
          bettinglistaccordingtobetType[list.digit] =[];
          bettinglistaccordingtobetType[list.digit].push(list);
        }else {
            bettinglistaccordingtobetType[list.digit].push(list);
        }
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
        totalAmount = Number(totalAmount) + Number(bet.bet_amount);
        return true;
      });
      betArray.amount = totalAmount;
      Betlisttype.push(betArray);
    }
    this.setState({
        BettingData : Betlisttype,
        Metadata:BettingData.data.Metadata
    });
  }
    componentDidMount() {

        this.setbetTyle();
        this.getLottery();
        this.getBetting();
    }
    render() {
        const { lotteryData, BettingData, AdminPlload, AdminPl } = this.state;
        
        const breadcrumb = [
            {
                name: "All Lottery",
                path: "/dashboard/manage-lottery/",
                isactive: false
            },
            {
                name: lotteryData.market_name,
                path: "/dashboard/today/" + this.props.match.params.id,
                isactive: false
            },
            {
                name: this.props.match.params.type,
                path: null,
                isactive: true
            }
        ];
        return (
            <>
                <div className="content">
                    <Col sm={12} className="px-0">
                        <Breadcrum breadcrumb={breadcrumb} />
                    </Col>
                    <Card>
                        <CardHeader>
                            <h2>{lotteryData.market_name} - {this.props.match.params.type} </h2>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col sm={12}>
                                    {
                                        !BettingData ? <Col className="col-12 text-center my-5"> <ShareSpinner /> </Col> :
                                            <Table className="table-bordered table-striped">
                                                <thead>
                                                    <tr className="table-info">
                                                        <th>Digit</th>
                                                        <th>Date</th>
                                                        <th>Bid</th>
                                                        <th>Total Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {BettingData ? BettingData.map((betting, key) => {
                                                        return (
                                                            <>
                                                                <tr key={key}>
                                                                    <td>{betting.digit}</td>
                                                                    <td>{moment(betting.created_at).format('DD-MM-YYYY HH:mm')}</td>
                                                                    <td>{betting.betting_time}</td>
                                                                    <td>{betting.amount}</td>
                                                                </tr>
                                                            </>
                                                        );
                                                    }) : ''}
                                                </tbody>
                                            </Table>
                                    }
                                </Col>
                            </Row>
                            <Col sm="12" className="mb-2">
                                <div>
                                <h3> Profit And Loss Chart</h3>
                                <ul className={"profitCard "}>
                                    {AdminPlload ?  AdminPl.map((pl, key) => {
                                    return (
                                        <>
                                        {(Math.sign(pl.adminprofit) === -1) ? 
                                        <li className="card bg-danger" key={key}>
                                        <p className="mb-0 border-bottom"><b>Digit</b>: {pl.digit}</p>
                                        <p className="mb-0 border-bottom"><b>Total</b>: {pl.totalprofit}</p>
                                        {(localStorage.getItem('role') === 'admin') &&
                                            <p className="mb-0"><b>Supermaster</b>: {parseFloat(pl.supermasterprofit).toFixed(2)}</p>
                                        }
                                        <p className="mb-0"><b>Master</b>: {parseFloat(pl.masterprofit).toFixed(2)}</p>
                                      </li>
                                      :
                                      <li className="card bg-success" key={key}>
                                      <p className="mb-0 border-bottom"><b>Digit</b>: {pl.digit}</p>
                                      <p className="mb-0 border-bottom"><b>Total</b>: {pl.totalprofit}</p> 
                                        {(localStorage.getItem('role') === 'admin') &&
                                            <p className="mb-0"><b>Supermaster</b>: {parseFloat(pl.supermasterprofit).toFixed(2)}</p>
                                        }
                                        <p className="mb-0"><b>Master</b>: {parseFloat(pl.masterprofit).toFixed(2)}</p>
                                    </li>
                                        }
                                        </>
                                      );
                                    })
                                    :''}
                                </ul>
                                </div>
                            </Col>
                        </CardBody>
                    </Card>
                </div>
            </>
        );
    }
}
export { Betting };