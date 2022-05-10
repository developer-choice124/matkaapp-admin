
import React from "react";

import { NavLink } from "react-router-dom";

import { lotteryfilterd } from './../services/lottery';
import { get_books } from './../services/betting';

import { checkresultchart } from './../services/chart';
import moment from 'moment';
import 'moment/locale/zh-cn';


// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col, Button, Modal, ModalHeader, ModalBody
} from "reactstrap";
import { i18n } from "components/i18n/hindi";

// var hour = parseInt(moment().format('HH')) + 3;
// var min = parseInt(moment().format('mm'));
// var currentTime = moment().format('HH:mm');
// var extraTime = hour + ":" +min;
var now = new Date();

moment.locale('en');
var closetime = moment(now).add(15, "minutes").format('h:mm a');

class Lottery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isBlocked: false,
      bookstoggle: false,
      books: '',
      lotteryData: null,
      reftime: '',
      showPlay: 'true',
      language: localStorage.getItem('language')
    };
    
    this.showBooks = this.showBooks.bind(this);
  };


  todayLottery = async () => {
    let lotteryData = await lotteryfilterd({ slug: "today", userId: localStorage.getItem("userId") });
    lotteryData.data.data.map(async (lottery, key) => {
      var hour = moment().hour();
      if(hour === 0 || hour === 1 || hour === 2 || hour === 3 || hour === 4 || hour === 5) {
        var from = moment().subtract(1,'d').format('YYYY-MM-DD');
        var to =  moment().format('YYYY-MM-DD');
        this.setState({showPlay: false});
      } else {
        var from = moment().format('YYYY-MM-DD');
        var to =  moment().add(1,'d').format('YYYY-MM-DD');
        this.setState({showPlay: true});
      }
      var checkrule = {
        from: from,
        to: to,
        lottery_id: lottery._id,
        bet_type: 'single-patti'
      };
      let lottryChartData = await checkresultchart(checkrule);
      if (lottryChartData.data.data) {
        lotteryData.data.data[key].result = lottryChartData.data.data;
      } else {
        lotteryData.data.data[key].result = '';
      }
      let betsData = await get_books({ user_id: localStorage.getItem("userId"), lottery_id: lottery._id });
      if (betsData.data.data) {
        lotteryData.data.data[key].bets = betsData.data.data;
      } else {
        lotteryData.data.data[key].bets = '';
      }
    });
    this.setState({
      lotteryData: lotteryData.data.data,
      isBlocked: localStorage.getItem("is_blocked"),
      isLoaded: true,
    });
  }

  showBooks(books) {
    this.setState({
      bookstoggle: !this.state.bookstoggle,
      books: books
    });
  }

  componentDidMount() {
    this.todayLottery();
    this.interval = setInterval(() => this.setState({ reftime: Date.now() }), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { lotteryData, isLoaded } = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardBody>
                  <Row>
                    {isLoaded ? lotteryData.map((list, key) => {
                      return (
                        <>
                          <Col sm={4} className="px-2" key={key}>
                            <Card className="border lottery-card text-center">
                              <CardBody className="py-0">
                                <div className="lottery-inner">
                                  <Row className="cardHeaderBottomBorder">
                                    <div className={"icon"}>
                                      <i className="nc-icon nc-planet" />
                                    </div>
                                    <span className={"live"}>
                                      {list.bets != 0 ? "LIVE" : ""}
                                    </span>
                                    <h5 className="col-7 mb-0 text-right px-1 date py-2 ml-auto">
                                      <Button onClick={() => this.showBooks(list.bets)} className="btn d-inline-flex btn-secondery m-0 mr-1 p-1" title="Books">
                                        <small>{this.state.language === "hin" ? i18n.LOTTERY.BOOKS.hindi : i18n.LOTTERY.BOOKS.english}</small>
                                      </Button>
                                      <NavLink className="btn btn-warning text-center text-dark d-inline-flex px-0 py-1 m-0 mr-2 w-50" to={"/dashboard/last-result/" + list._id}><small className="mx-auto">{this.state.language === "hin" ? i18n.LOTTERY.LAST_RESULT.hindi : i18n.LOTTERY.LAST_RESULT.english}</small></NavLink>
                                    </h5>
                                  </Row>
                                  <h4 className="my-2 uppercase">{list.market_name}</h4>
                                  <Row>
                                    <h6 className="col-5 mb-2 description uppercase">{this.state.language === "hin" ? i18n.LOTTERY.OPEN.hindi : i18n.LOTTERY.OPEN.english} {list.open}</h6>
                                    <h6 className="col-2 px-0 mb-2 description uppercase">{list.result && 'Result' }</h6>
                                    <h6 className="col-5 mb-2 description uppercase">{this.state.language === "hin" ? i18n.LOTTERY.CLOSE.hindi : i18n.LOTTERY.CLOSE.english} {list.close}</h6>
                                    { list && list.result && (list.result.hasOwnProperty('open') || list.result.hasOwnProperty('close')) ?
                                      <>
                                        <h6 className="col-5 py-2 mb-2 description uppercase theme-btn bg-yellow border text-center">{list.result && list.result.open ? list.result.open : null}</h6>
                                        <h6 className="col-2 py-2 px-0 mb-2 description uppercase theme-btn bg-yellow border text-center">{list.result && list.result.patti ? list.result.patti : null}</h6>
                                        <h6 className="col-5 py-2 mb-2 description uppercase theme-btn bg-yellow border text-center">{list.result && list.result.close ? list.result.close: null}</h6>
                                      </>: null
                                    }
                                  </Row>
                                  {localStorage.getItem("is_blocked") === "false" ?
                                    <>
                                    {/* Don't remove static date b'coz Date function only work when date avialable. We only use time to check they passed or not*/}
                                      { this.state.showPlay && !moment(new Date("2021-07-16 " +list.close)).isBefore(new Date("2021-07-16 " +closetime)) ?
                                        <>
                                          {!list.result || !list.result.close ? 
                                            <NavLink className="btn theme-btn btn-block" to={"/dashboard/gametype/" + list._id} color="danger">{this.state.language === "hin" ? i18n.LOTTERY.PLAY_NOW.hindi : i18n.LOTTERY.PLAY_NOW.english}</NavLink>
                                            : ''
                                          }
                                        </>
                                        : ''
                                      }
                                    </>
                                    : <>
                                      <NavLink className="btn theme-btn btn-block" to="#" color="danger">{this.state.language === "hin" ? i18n.LOTTERY.YOUR_ARE_BLOCKED.hindi : i18n.LOTTERY.YOUR_ARE_BLOCKED.english}</NavLink>
                                    </>}
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        </>
                      );
                    }) : ''}
                  </Row>
                </CardBody>
                <Modal size="lg" isOpen={this.state.bookstoggle} fade={this.state.fade} toggle={() => this.showBooks('')}>
                  <ModalHeader toggle={() => this.showBooks('')}>Books</ModalHeader>
                  <ModalBody>
                    <Col className="table-responsive px-0 py-5 py-sm-0">
                      <table className="table table-striped">
                        <thead className="table-info text-primary">
                          <tr>
                            <th>Market Name</th>
                            <th>Result</th>
                            <th>Betting Time</th>
                            <th>Digit</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.books ? this.state.books.map((book, index) => (
                            <tr key={index}>
                              <td>{book.market_name}</td>
                              <td>{book.bet_type}</td>
                              <td>{book.betting_time}</td>
                              <td>{book.digit}</td>
                              <td>{book.bet_amount}</td>
                            </tr>
                          )) 
                            : 
                            <>
                                No Bets Here.
                            </>
                        }
                        </tbody>
                      </table>
                    </Col>
                  </ModalBody>
                </Modal>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Lottery;
