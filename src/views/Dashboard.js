import React from "react";
import { NavLink } from "react-router-dom";
import moment from 'moment';
import 'moment/locale/zh-cn';

import { getUser } from './services/users';
import { lotteryfilterd } from './services/lottery';
import { all_betting, getTotalbatting } from './services/betting';
import { getTotalprofitandloss } from './services/profitandloss';
import ShareSpinner from "./SharedComponent/Spinner";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UsersDetail: null,
      isLoaded: false,
      isBetHistoryLoaded: false,
      isBetting: false,
      userisLoaded: false,
      lotteryData: null,
      activePage: 1,
      search_from: "",
      search_to: "",
      search: "",
      limit: 10,
      BetHistory: null,
      isprofitLoaded: null,
      profit: "",
      loss: "",
      totalBetting: "",
    };
  };
  Users = async () => {
    let userData = await getUser({ id: localStorage.getItem("userId") });
    this.setState({
      UsersDetail: userData.data.data,
      userisLoaded: true
    });
  }
  
  todayLottery = async () => {
    let lotteryData = await lotteryfilterd({ slug: "today" });
    this.setState({
      lotteryData: lotteryData.data.data,
      isLoaded: true
    });
  }
  getBetHistory = async () => {
    var id = localStorage.getItem("userId");
    var pagerule = {
      search: this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit: this.state.limit,
      offset: this.state.activePage,
      id: id
    };
    var BetHistory = await all_betting({ slug: "today" }, pagerule);
    this.setState({
      BetHistory: BetHistory.data.data,
      isBetHistoryLoaded: true,
      Metadata: BetHistory.data.Metadata
    });
  }
  totalProfitandLoss = async () => {
    var id = localStorage.getItem("userId");
    var profit = await getTotalprofitandloss({ slug: "profit", id: id });
    var loss = await getTotalprofitandloss({ slug: "loss", id: id });
    this.setState({
      profit: profit.data.data.length > 0 ? profit.data.data : "",
      loss: loss.data.data.length > 0 ? loss.data.data : "",
      isprofitLoaded: true
    });
  }
  totalbatting = async () => {
    var id = localStorage.getItem("userId");
    var role = localStorage.getItem("role");
    var totalBetting = await getTotalbatting({ role: role, id: id });
    this.setState({
      totalBetting: totalBetting.data.data.length > 0 ? totalBetting.data.data : "",
      isBetting: true
    });
  }


  componentDidMount() {
    this.Users();
    this.todayLottery();
    this.getBetHistory();
    this.totalProfitandLoss();
    this.totalbatting();
  }
  render() {
    if (localStorage.getItem("role") === "user") {
      window.location.replace('/dashboard/user-dashboard');
    }
    const { isLoaded, UsersDetail, lotteryData, userisLoaded, isBetHistoryLoaded, BetHistory, isprofitLoaded, profit, loss, isBetting, totalBetting } = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col lg={4} md={6} >
              <Card className="px-2 pt-2 pb-0 overflow-hidden">
                <Row className="mx-0 py-3">
                  <Col xs={4}><i className="card-icon nc-icon nc-money-coins" /></Col>
                  <Col xs={8} className="card-detail text-center">Total Chips <br /> <p className="mb-0">{userisLoaded ? UsersDetail.chips : "0"}</p></Col>
                </Row>
                <Row>
                  <NavLink className="card-link" to="/dashboard/account-statement">View Coin History</NavLink>
                </Row>
              </Card>
            </Col>
            <Col lg={4} md={6} >
              <Card className="px-2 pt-2 pb-0 overflow-hidden">
                <Row className="mx-0 py-3">
                  <Col xs={4}><i className="card-icon fa fa-history" /></Col>
                  <Col xs={8} className="card-detail text-center">Total Bet <br /> <p className="mb-0"><span className="mb-0 text-success">{isBetting ? totalBetting.length : "0"}</span></p></Col>
                </Row>
                <Row>
                  <NavLink className="card-link" to="/dashboard/bethistory">View All History</NavLink>
                </Row>
              </Card>
            </Col>
            <Col lg={4} md={6} >
              <Card className="px-2 pt-2 pb-0 overflow-hidden">
                <Row className="mx-0 py-3">
                  <Col xs={4}><i className="card-icon fas fa-chart-line"></i></Col>
                  <Col xs={8} className="card-detail text-center">Total Profit/Loss<br /><span className="mb-0 text-success">{(isprofitLoaded && profit.length > 0) ? profit[0].totalprofit : "0"}</span> / <span className="mb-0 text-danger">{(isprofitLoaded && loss.length > 0) ? loss[0].totalloss : "0"}</span></Col>
                </Row>
                <Row>
                  <NavLink className="card-link" to="/dashboard/profitandloss">View Profit and Loss</NavLink>
                </Row>
              </Card>
            </Col>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Today Lottery List</CardTitle>
                </CardHeader>
                <CardBody>
                  {
                    !isLoaded && <Row> <Col className="text-center my-5"> <ShareSpinner /> </Col> </Row>
                  }
                  {
                    isLoaded &&
                    <Table responsive className="table-bordered">
                      <thead className="text-primary">
                        <tr className="table-info">
                          <th>Name</th>
                          <th>Opening Bids</th>
                          <th>Closing Bids</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>

                        {(isLoaded && lotteryData) && lotteryData.map((list, key) => {
                          return (
                            <tr key={key}>
                              <td>{list.market_name}</td>
                              <td>{list.open}</td>
                              <td>{list.close}</td>
                              <td>{list.start_date}</td>
                              <td>{list.is_active ? "Active" : "Deactive"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  }
                </CardBody>
              </Card>
            </Col>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Today Winners</CardTitle>
                </CardHeader>
                <CardBody>
                  {
                    !isBetHistoryLoaded && <Row> <Col className="text-center my-5"> <ShareSpinner /> </Col> </Row>
                  }
                  <Table responsive className="table-bordered">
                    <thead>
                      <tr className="table-info">
                        <th>S.No</th>
                        <th>Market Name</th>
                        <th>Bet Type</th>
                        <th>Betting Time</th>
                        <th>Rate</th>
                        <th>Digit</th>
                        <th>User</th>
                        <th>Bet Amount</th>
                        <th>Winning Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isBetHistoryLoaded && BetHistory.length > 0) ? BetHistory.map((history, key) => {
                        return (
                          <tr>
                            <td>{++key}</td>
                            <td>{history.market_name}</td>
                            <td>{history.bet_type}</td>
                            <td>{history.betting_time}</td>
                            <td>{history.rate}</td>
                            <td>{history.digit}</td>
                            <td>{history.userDetails.length > 0 && history.userDetails[0].username}</td>
                            <td>{history.bet_amount}</td>
                            <td>{history.status === "WIN" && (history.bet_amount * history.rate || "0")}</td>
                            <td>{moment(history.created_at).format('DD-MM-YYYY HH:mm')}</td>
                            <td>{history.status}</td>
                          </tr>
                        );
                      }) : <tr><td className="text-center" colSpan="11">No data here...</td></tr>}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
