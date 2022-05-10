import React from "react";
import { NavLink } from "react-router-dom";

import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from './services/users';
import { lotteryfilterd } from './services/lottery';
import { all_betting, getTotalbatting, get_currnet_bets_count } from './services/betting';
import { getTotalprofitandloss } from './services/profitandloss';
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
import {i18n} from "components/i18n/hindi";
class Userdashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Users: null,
      userisLoaded: false,
      isLoaded: false,
      lotteryData: null,
      BetHistory: null,
      isBetHistoryLoaded: false,
      isprofitLoaded: null,
      profit: "",
      loss: "",
      totalBetting: "",
      isBetting: false,
      activePage: 1,
      search_from: "",
      search_to: "",
      search: "",
      limit: 10,
      currentBetCount: 0,
      language: localStorage.getItem('language'),
    };
  };

  Users = async () => {
    let userData = await getUser({ id: localStorage.getItem("userId") });
    this.setState({
      Users: userData.data.data,
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
  getCurrentBets = async () => {
    var id = localStorage.getItem("userId");
    var body = { id }
    await get_currnet_bets_count(body)
      .then(res => {
        this.setState({ currentBetCount: res.data.data.totalCount })
      }).catch(error => {
        console.log(error);
      })
  }

  componentDidMount() {
    this.Users();
    this.todayLottery();
    this.getBetHistory();
    this.totalProfitandLoss();
    this.totalbatting();
    this.getCurrentBets();
  }
  render() {
    if (localStorage.getItem("role") !== "user") {
      window.location.replace('/dashboard/dashboard');
    }
    const { Users, userisLoaded, isBetHistoryLoaded, BetHistory, isprofitLoaded, profit, loss, isBetting, totalBetting } = this.state;

    return (
      <>
        <div className="content">
          <Row>
            <Col sm={4}>
              <Card className="px-2 pt-2 pb-0 overflow-hidden">
                <Row className="mx-0 py-3">
                  <Col xs={4}><i className="card-icon nc-icon nc-money-coins" /></Col>
                  <Col xs={8} className="card-detail text-center">{this.state.language === "hin" ? i18n.DASHBOARD.TOTAL_CHIPS.hindi : i18n.DASHBOARD.TOTAL_CHIPS.english} <br /> <p className="mb-0">{userisLoaded ? Users.chips : "0"}</p></Col>
                </Row>
                <Row>
                  <NavLink className="card-link" to="/dashboard/chips-transaction">{this.state.language === "hin" ? i18n.DASHBOARD.VIEW_COIN_HISTORY.hindi : i18n.DASHBOARD.VIEW_COIN_HISTORY.english}</NavLink>
                </Row>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="px-2 pt-2 pb-0 overflow-hidden">
                <Row className="mx-0 py-3">
                  <Col xs={4}><i className="card-icon fa fa-history" /></Col>
                  <Col xs={8} className="card-detail text-center">{this.state.language === "hin" ? i18n.DASHBOARD.TOTAL_BET.hindi : i18n.DASHBOARD.TOTAL_BET.english} <br /> <p className="mb-0"><span className="mb-0 text-success">{isBetting ? totalBetting.length : "0"}</span></p></Col>
                </Row>
                <Row>
                  <NavLink className="card-link" to="/dashboard/bethistory">{this.state.language === "hin" ? i18n.DASHBOARD.VIEW_ALL_HISTORY.hindi : i18n.DASHBOARD.VIEW_ALL_HISTORY.english}</NavLink>
                </Row>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="px-2 pt-2 pb-0 overflow-hidden">
                <Row className="mx-0 py-3">
                  <Col xs={4}><i className="card-icon fas fa-chart-line"></i></Col>
                  <Col xs={8} className="card-detail text-center">{this.state.language === "hin" ? i18n.DASHBOARD.TOTAL_PROFIT_LOSS.hindi : i18n.DASHBOARD.TOTAL_PROFIT_LOSS.english} <br /> <span className="mb-0 text-success">{(isprofitLoaded && profit.length > 0) ? profit[0].totalprofit : "0"}</span> / <span className="mb-0 text-danger">{(isprofitLoaded && loss.length > 0) ? loss[0].totalloss : "0"}</span></Col>
                </Row>
                <Row>
                  <NavLink className="card-link" to="/dashboard/profitandloss">{this.state.language === "hin" ? i18n.DASHBOARD.VIEW_PROFIT_AND_LOSS.hindi : i18n.DASHBOARD.VIEW_PROFIT_AND_LOSS.english}</NavLink>
                </Row>
              </Card>
            </Col>
            {/* Active bets */}
            <Col sm={4}>
              <Card className="px-2 pt-2 pb-0 overflow-hidden">
                <Row className="mx-0 py-3">
                  <Col xs={4}><i class="card-icon fas fa-dice"></i></Col>
                  <Col xs={8} className="card-detail text-center">{this.state.language === "hin" ? i18n.DASHBOARD.ACTIVE_BETS.hindi : i18n.DASHBOARD.ACTIVE_BETS.english} <br /> <span className="mb-0 text-success">{this.state.currentBetCount ? this.state.currentBetCount : 0}</span></Col>
                </Row>
                <Row>
                  <NavLink className="card-link" to="/dashboard/active-bets">{this.state.language === "hin" ? i18n.DASHBOARD.CURRENT_ACTIVE_BETS.hindi : i18n.DASHBOARD.CURRENT_ACTIVE_BETS.english}</NavLink>
                </Row>
              </Card>
            </Col>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">{this.state.language === "hin" ? i18n.DASHBOARD.TODAY_LOTTERY_RESULT.hindi : i18n.DASHBOARD.TODAY_LOTTERY_RESULT.english}</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead>
                      <tr className="table-info">
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.S_NO.hindi : i18n.DASHBOARD.S_NO.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.MARKET_NAME.hindi : i18n.DASHBOARD.MARKET_NAME.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.BETS_TYPE.hindi : i18n.DASHBOARD.BETS_TYPE.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.BETTING_TIME.hindi : i18n.DASHBOARD.BETTING_TIME.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.RATE.hindi : i18n.DASHBOARD.RATE.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.DIGIT.hindi : i18n.DASHBOARD.DIGIT.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.USER.hindi : i18n.DASHBOARD.USER.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.BET_AMOUNT.hindi : i18n.DASHBOARD.BET_AMOUNT.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.WINNING_AMOUNT.hindi : i18n.DASHBOARD.WINNING_AMOUNT.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.DATE.hindi : i18n.DASHBOARD.DATE.english}</th>
                        <th>{this.state.language === "hin" ? i18n.DASHBOARD.STATUS.hindi : i18n.DASHBOARD.STATUS.english}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isBetHistoryLoaded ? BetHistory.map((history, key) => {
                        return (
                          <tr>
                            <td>{++key}</td>
                            <td>{history.market_name}</td>
                            <td>{history.bet_type}</td>
                            <td>{history.betting_time}</td>
                            <td>{history.rate}</td>
                            <td>{history.digit}</td>
                            <td>{history.userDetails.length > 0 ? history.userDetails[0].username : ""}</td>
                            <td>{history.bet_amount}</td>
                            <td>{history.status === "WIN" ? history.bet_amount * history.rate : "0"}</td>
                            <td>{moment(history.created_at).format('DD-MM-YYYY HH:mm')}</td>
                            <td>{history.status}</td>
                          </tr>
                        );
                      }) : null}
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

export default Userdashboard;
