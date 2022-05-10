/*
* Logic of this page
* In url we get data :  Bet Type, Lottery date, Bet TIme (Open or close) , Name of Lottery
* in default we call 4 function 
* setbetType(); getLottery(); Lotterysetting(); getBetting(); getjodibets();
*
*/
import React from "react";

import { NavLink } from "react-router-dom";

import { AllLotterysetting } from './../../services/lottery_setting';
import { findDigitSuggesion, stringSeprator, sumofArray } from './../../services/helper/helper';
import { getLottery } from './../../services/lottery';
import { getBetting, bettingbydigit, plbyDigit, betannounce, plbysuggestiondigit, getbetresult } from './../../services/betting';

import ShareSpinner from "./../../SharedComponent/Spinner";

import moment from 'moment';
import 'moment/locale/zh-cn';

import { single, singlepatti, doublepatti, tripalpatti, jodi } from './../../../components/variable/global'

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Row,
  Col,
  Button,
  Form, FormGroup, Label, Input, Alert
} from "reactstrap";
import { Breadcrum } from "./Breadcrum.js";



class Betlistbytype extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      GetMarketTypes: "",
      lotteryData: "",
      BettingData: "",
      digitarray: "",
      Successmsg: "",
      Success: false,
      resulttoggle: false,
      fade: false,
      activePage: 1,
      search_from: "",
      search_to: "",
      search: "",
      Metadata: 0,
      limit: 100000,
      suggestionList: null,
      digitlist: null,
      suggestion: false,
      AdminPl: '',
      AdminPlload: false,
      JodiPL: '',
      JOdiPLload: false,
      AdminsuggestionPl: '',
      AdminsuggestionPlload: false,
      digit: ""

    };
    this.resulttoggle = this.resulttoggle.bind(this);
  };


  getDate = () => {
    var d1;
    if (this.props.match.params.pathParam2 || this.props.match.params.pathParam2 !== undefined) {
      d1 = this.props.match.params.pathParam2;
    } else {
      d1 = moment().format('YYYY-MM-DD');
    }


    return d1;
  }

  resulttoggle() {
    this.setState({
      resulttoggle: !this.state.resulttoggle
    });
  }

  Lotterysetting = async () => {
    let GetMarketTypes = await AllLotterysetting({ lottery_id: this.props.match.params.id });
    var arrayList = [];
    GetMarketTypes.data.data.map((list) => {
      if (list.lottery_id === this.props.match.params.id && list.bet_type === this.props.match.params.type) {
        arrayList.push(list);
      }
      return true;
    });

    this.setState({
      GetMarketTypes: arrayList
    });
    return true;
  }

  getLottery = async () => {
    let lottryData = await getLottery({ id: this.props.match.params.id });
    this.setState({
      lotteryData: lottryData.data.data
    });
  }
  getBetting = async () => {
    var pagerule = {
      search: this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit: this.state.limit,
      offset: this.state.activePage,
      bet_type: this.props.match.params.type,
      betting_time: this.props.match.params.time,
    };

    pagerule.min_date = this.getDate();
    let BettingData = await getBetting({ id: localStorage.getItem("userId"), lottery_id: this.props.match.params.id }, pagerule);
    var bettinglistaccordingtobetType = [];
    var Betlisttype = [];
    BettingData.data.data.map((list) => {
      if (list.lottery_id === this.props.match.params.id && list.betting_time === this.props.match.params.time) {
        if (typeof bettinglistaccordingtobetType[list.digit] === 'undefined') {
          bettinglistaccordingtobetType[list.digit] = [];
          bettinglistaccordingtobetType[list.digit].push(list);
        } else {
          bettinglistaccordingtobetType[list.digit].push(list);
        }
      } else if (list.lottery_id === this.props.match.params.id && list.bet_type === 'jodi') {
        if (typeof bettinglistaccordingtobetType[list.digit] === 'undefined') {
          bettinglistaccordingtobetType[list.digit] = [];
          bettinglistaccordingtobetType[list.digit].push(list);
        } else {
          bettinglistaccordingtobetType[list.digit].push(list);
        }
      }
      return true;
    });
    var getIndex = Object.keys(bettinglistaccordingtobetType);
    for (var i = 0; i < getIndex.length; i++) {
      var betArray = {
        _id: bettinglistaccordingtobetType[getIndex[i]][0]._id,
        market_name: bettinglistaccordingtobetType[getIndex[i]][0].market_name,
        lottery_id: bettinglistaccordingtobetType[getIndex[i]][0].lottery_id,
        bet_type: bettinglistaccordingtobetType[getIndex[i]][0].bet_type,
        betting_time: bettinglistaccordingtobetType[getIndex[i]][0].betting_time,
        created_at: bettinglistaccordingtobetType[getIndex[i]][0].created_at,
        digit: bettinglistaccordingtobetType[getIndex[i]][0].digit,
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
      BettingData: Betlisttype,
      Metadata: BettingData.data.Metadata
    });
  }


  getpl = async () => {
    var body = {
      lottery_id: this.props.match.params.id,
      betting_time: this.props.match.params.time,
      digit: this.state.digitarray
    };

    body.min_date = this.getDate();
    let plData = await plbyDigit(body);
    this.setState({
      AdminPl: plData.data.data,
      AdminPlload: true
    });

  }
  getsuggetionpl = async (digit) => {
    var body = {
      lottery_id: this.props.match.params.id,
      betting_time: this.props.match.params.time,
      digit: digit
    };

    body.min_date = this.getDate();
    let plsData = await plbysuggestiondigit(body);
    this.setState({
      AdminsuggestionPl: plsData.data.data,
      AdminsuggestionPlload: true
    });

  }

  handleChange = async (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case 'digit':
        var digitlist = findDigitSuggesion(value);


        var batlist = await bettingbydigit({ digit: digitlist, time: this.props.match.params.time, id: this.props.match.params.id, min_date: this.getDate() });

        var bettinglistaccordingtobetType = [];
        var Betlisttype = [];
        batlist.data.data.map(list => {
          if (list.lottery_id === this.props.match.params.id && list.betting_time === this.props.match.params.time) {
            if (typeof bettinglistaccordingtobetType[list.digit] === 'undefined') {
              bettinglistaccordingtobetType[list.digit] = [];
              bettinglistaccordingtobetType[list.digit].push(list);
            } else {
              bettinglistaccordingtobetType[list.digit].push(list);
            }
          }
          return true;
        });
        var getIndex = Object.keys(bettinglistaccordingtobetType);
        for (var i = 0; i < getIndex.length; i++) {
          var betArray = {
            _id: bettinglistaccordingtobetType[getIndex[i]][0]._id,
            market_name: bettinglistaccordingtobetType[getIndex[i]][0].market_name,
            lottery_id: bettinglistaccordingtobetType[getIndex[i]][0].lottery_id,
            bet_type: bettinglistaccordingtobetType[getIndex[i]][0].bet_type,
            betting_time: bettinglistaccordingtobetType[getIndex[i]][0].betting_time,
            created_at: bettinglistaccordingtobetType[getIndex[i]][0].created_at,
            digit: bettinglistaccordingtobetType[getIndex[i]][0].digit,
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
          digitlist: digitlist,
          suggestionList: Betlisttype,
          suggestion: true,
        }, () => {
          this.getsuggetionpl(digitlist);
        });
        break;

      default:
        break;
    }
    this.setState({ [name]: value });
  }
  setbetType = () => {
    if (this.props.match.params.type === 'single') {
      this.setState({
        digitarray: single
      }, () => {
        this.getpl();
      });
    } else if (this.props.match.params.type === 'single-patti' || this.props.match.params.type === 'double-patti' || this.props.match.params.type === 'triple-patti') {
      const arr = [...singlepatti, ...doublepatti, ...tripalpatti];
      this.setState({
        digitarray: arr
      }, () => {
        this.getpl();
      });
    } else if (this.props.match.params.type === 'jodi') {
      this.setState({
        digitarray: jodi
      }, () => {
        this.getpl();
      });
    } else {
      window.location.replace('admin/today/' + this.props.match.params.id);
    }
  }

  handlebetannounce = evt => {

    evt.preventDefault();

    var announcelotterydata =
    {
      lottery_id: this.props.match.params.id,
      betting_time: this.props.match.params.time,
      bet_type: this.props.match.params.type,
      digit: evt.target.elements.digit.value,
      patti: '',
      min_date: this.getDate()
    };
    if (this.props.match.params.type !== 'single' || this.props.match.params.type !== 'jodi') {
      var findDigit = null;
      var digi = evt.target.elements.digit.value;
      var sum = String(digi);
      if (sum.length === 1) {
        findDigit = sum;
      } else {
        var suml = stringSeprator(sum);
        var vt = sumofArray(suml);
        vt = String(vt);

        findDigit = vt.length === 1 ? vt[0] : vt[1];
      }
      announcelotterydata.patti = findDigit;
    }
    var announcelotterydata2 =
    {
      lottery_id: this.props.match.params.id,
      betting_time: this.props.match.params.time,
      bet_type: 'single',
      digit: findDigit,
      min_date: this.getDate()
    };
    const confirm = window.confirm('Are You sure to declare this lottery result?');
    if (confirm) {
      betannounce(announcelotterydata).then(response => {
        betannounce(announcelotterydata2);
        if (response.data.data.ops) {
          this.setState({
            digit: '',
            Successmsg: "Successfully Announce " + response.data.data.ops[0].market_name + " " + this.props.match.params.type + this.props.match.params.time + " time Result",
            Success: true,
          });
        }
        // window.location.reload();
      }).catch(err => {
        console.log(err);
      });
    } else {
      window.location.reload();
    }

  };
  getjodibets = async () => {
    // Check Open Annuunce 
    var pagerule = {
      lottery_id: this.props.match.params.id,
      betting_time: 'open',
      status: {
        $in: ['WIN']
      },
    };
    pagerule.min_date = this.getDate();
    let BettingData = await getbetresult(pagerule);
    var digi = null;
    BettingData.data.data.map(list => {
      digi = list.digit;
      return true;
    })
    if (digi) {

      var findDigit = null;
      var sum = String(digi);
      if (sum.length === 1) {
        findDigit = sum;
      } else {
        var suml = stringSeprator(sum);
        findDigit = suml.length === 1 ? suml[0] : suml[1];
      }
      var baseNum = Number(findDigit) * 10;
      var digiArr = [];
      for (var i = 0; i <= 9; i++) {
        var num = Number(baseNum) + Number(i);
        var j = String(num);
        if (j.length === 1) {
          j = '0' + j
        }
        digiArr.push(j);
      }
      var body = {
        lottery_id: this.props.match.params.id,
        betting_time: 'open',
        digit: digiArr,
        min_date: this.getDate()
      };

      let plData = await plbyDigit(body);
      this.setState({
        JodiPL: plData.data.data,
        JOdiPLload: true
      });
    }

  }

  componentDidMount() {
    this.setbetType();
    this.getLottery();
    this.Lotterysetting();
    this.getBetting();
    this.getjodibets();
  }
  render() {

    const { lotteryData, BettingData, digitarray, Successmsg, Success, suggestionList, suggestion, AdminsuggestionPl, AdminsuggestionPlload, AdminPl, AdminPlload, JodiPL, JOdiPLload } = this.state;
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
    let min, max;
    if (this.props.match.params.type === 'single') {
      min = 1;
      max = 1;
    } else if (this.props.match.params.type === 'jodi') {
      min = 2;
      max = 2;
    } else {
      min = 3;
      max = 3;
    }
    return (
      <>
        <div className="content">
          <Col sm={12} className="px-0">
            <Breadcrum breadcrumb={breadcrumb} />
          </Col>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader className="d-sm-flex">
                  <h2>{lotteryData.market_name} - {this.props.match.params.type} </h2>
                  <NavLink className="btn ml-auto mb-4" to={"/dashboard/today/" + this.props.match.params.id} color="info">Back</NavLink>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12" className="border-right">
                      {Success &&
                        <Alert color="success">{Successmsg}</Alert>
                      }
                      <Form method="POST" onSubmit={this.handlebetannounce}>
                        <FormGroup row>
                          <Label sm={3}>BETTING TIME</Label>
                          <Col sm={9}>
                            <Input type="select" id="Game" disabled>
                              <option defaultValue="open" selected={this.props.match.params.time === 'open' ? 'selected' : ''}>{lotteryData.market_name} Open  ( {lotteryData.open} )</option>
                              <option defaultValue="close" selected={this.props.match.params.time === 'close' ? 'selected' : ''}>{lotteryData.market_name} Close ( {lotteryData.close} )</option>
                            </Input>
                            <input type="hidden" defaultValue={lotteryData.market_name} name="market_name" />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3}>BET TYPE</Label>
                          <Col sm={9}>
                            <Input name="bet_type" defaultValue={this.props.match.params.type} disabled />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3}>Digit</Label>
                          <Col sm={9}>
                            <input className="form-control" type="text" list="pattinumbers" autoComplete={"off"} minLength={min} maxLength={max} name="digit" onChange={this.handleChange} required />
                            <datalist id="pattinumbers">
                              {digitarray && digitarray.map((type, key) => {
                                return (
                                  <option key={key} defaultValue={type}>{type}</option>
                                );
                              })};
                            </datalist>
                          </Col>
                        </FormGroup>
                        <FormGroup check row>
                          <Col sm={{ size: 9, offset: 3 }}>
                            <Button type="submit" className="btn-block">Submit</Button>
                          </Col>
                        </FormGroup>
                      </Form>
                      <Col sm="12" className="px-0 table-responsive">
                        {
                          !BettingData ? <Col className="col-12 text-center my-5"> <ShareSpinner /> </Col> :
                            <Table className="table-bordered table-striped">
                              <thead>
                                <tr className="table-info">
                                  <th>Digit</th>
                                  <th>Bet Type</th>
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
                                        <td>{betting.bet_type}</td>
                                        <td>{moment(betting.created_at).format('DD-MM-YYYY HH:mm')}</td>
                                        <td>{betting.betting_time}</td>
                                        <td>{betting.amount}</td></tr>
                                    </>
                                  );
                                }) : ''}
                              </tbody>
                            </Table>
                        }
                      </Col>
                    </Col>
                    {JOdiPLload ?
                      <Col sm={12}>
                        <div>
                          <h3>Jodi PL Chart</h3>
                          <ul className="profitCard">
                            {JOdiPLload ? JodiPL.map((pl, key) => {
                              return (
                                <>
                                  {(Math.sign(pl.adminprofit) === -1) ?
                                    <li className="card bg-danger" key={key}>
                                      <p className="mb-0 border-bottom"><b>Digit</b>: {pl.digit}</p>
                                      <p className="mb-0 border-bottom"><b>Total</b>: {pl.totalprofit}</p>
                                      <p className="mb-0"><b>Admin</b>: {parseFloat(pl.adminprofit).toFixed(2)}</p>
                                    </li>
                                    :
                                    <li className="card bg-success" key={key}>
                                      <p className="mb-0 border-bottom"><b>Digit</b>: {pl.digit}</p>
                                      <p className="mb-0 border-bottom"><b>Total</b>: {pl.totalprofit}</p>
                                      <p className="mb-0"><b>Admin</b>: {parseFloat(pl.adminprofit).toFixed(2)}</p>
                                    </li>
                                  }
                                </>
                              );
                            })
                              : ''}
                          </ul>
                        </div>
                      </Col>
                      : ''}
                    <Col sm="12">
                      <div>
                        <h3> Profit And Loss Chart</h3>
                        <ul className="profitCard">
                          {AdminPlload ? AdminPl.map((pl, key) => {
                            return (
                              <>
                                {(Math.sign(pl.adminprofit) === -1) ?
                                  <li className="card bg-danger" key={key}>
                                    <p className="mb-0 border-bottom"><b>Digit</b>: {pl.digit}</p>
                                    <p className="mb-0 border-bottom"><b>Total</b>: {pl.totalprofit}</p>
                                    <p className="mb-0"><b>Admin</b>: {parseFloat(pl.adminprofit).toFixed(2)}</p>
                                  </li>
                                  :
                                  <li className="card bg-success" key={key}>
                                    <p className="mb-0 border-bottom"><b>Digit</b>: {pl.digit}</p>
                                    <p className="mb-0 border-bottom"><b>Total</b>: {pl.totalprofit}</p>
                                    <p className="mb-0"><b>Admin</b>: {parseFloat(pl.adminprofit).toFixed(2)}</p>
                                  </li>
                                }
                              </>
                            );
                          })
                            : ''}
                        </ul>
                      </div>
                    </Col>
                  </Row>


                  {suggestion ?
                    <Col sm={12} className="px-0">
                      <div>
                        <h3>Suggestion Digits</h3>
                        <ul className="profitCard">
                          {AdminsuggestionPlload ? AdminsuggestionPl.map((pl, key) => {
                            return (
                              <>
                                {(Math.sign(pl.adminprofit) === -1) ?
                                  <li className="card bg-danger" key={key}>
                                    <p className="mb-0 border-bottom"><b>Digit</b>: {pl.digit}</p>
                                    <p className="mb-0 border-bottom"><b>Total</b>: {pl.totalprofit}</p>
                                    <p className="mb-0"><b>Admin</b>: {parseFloat(pl.adminprofit).toFixed(2)}</p>
                                  </li>
                                  :
                                  <li className="card bg-success" key={key}>
                                    <p className="mb-0 border-bottom"><b>Digit</b>: {pl.digit}</p>
                                    <p className="mb-0 border-bottom"><b>Total</b>: {pl.totalprofit}</p>
                                    <p className="mb-0"><b>Admin</b>: {parseFloat(pl.adminprofit).toFixed(2)}</p>
                                  </li>
                                }
                              </>
                            );
                          })
                            : ''}
                        </ul>
                      </div>
                    </Col>
                    : ''}

                  <h3>Suggestion List</h3>
                  <Col sm="12" className="px-0 table-responsive">
                    {<Table className="table-bordered table-striped">
                      <thead>
                        <tr className="table-info">
                          <th>Type</th>
                          <th>Digit</th>
                          <th>Date</th>
                          <th>Bid</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(suggestion && suggestionList.length > 0) ? suggestionList.map((slist, key) => {
                          return (
                            <>
                              <tr key={key}>
                                <td>{slist.bet_type}</td>
                                <td>{slist.digit}</td>
                                <td>{moment(slist.created_at).format('DD-MM-YYYY HH:mm')}</td>
                                <td>{slist.betting_time}</td>
                                <td>{slist.amount}</td>
                              </tr>
                            </>
                          );
                        }) : <tr><td className="text-center" colSpan="5">No data here..</td></tr>}
                      </tbody>
                    </Table>
                    }
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Betlistbytype;
