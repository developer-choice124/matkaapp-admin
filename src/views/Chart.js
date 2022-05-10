
import React from "react";

import moment from 'moment';
import 'moment/locale/zh-cn';

import { stringSeprator, sumofArray } from './services/helper/helper';
import { AllLottery } from './services/lottery';
import { AllLotterychart, AddLotterychart, getChart, update, deleteChart } from './services/chart';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col, Modal,
  ModalHeader,
  ModalBody,
  Form, FormGroup, Label, Input, Button, Alert
} from "reactstrap";

import Pagination from "react-js-pagination";
import {i18n} from "components/i18n/hindi";
class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      market: "",
      success: "",
      bet_type: "",
      open: "",
      close: "",
      patti: "",
      lotteryList: [],
      chartError: "",
      LotterychartList: "",
      chartId: "",
      isLoaded: false,
      isChartLoaded: false,
      chartEditLoaded: false,
      activePage: 1,
      search_from: "",
      search_to: "",
      search: "",
      Metadata: 0,
      limit: 10,
      language: localStorage.getItem('language')
    }

    this.editChart = this.editChart.bind(this);
  }

  Lottery = async () => {
    let lottryData = await AllLottery();
    this.setState({
      lotteryList: lottryData.data.data,
      isLoaded: true
    });
  }
  Lotterychart = async () => {
    var pagerule = {
      search: this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit: this.state.limit,
      offset: this.state.activePage
    };

    let lottryChartData = await AllLotterychart(pagerule);
    this.setState({
      LotterychartList: lottryChartData.data.data,
      isChartLoaded: true,
      Metadata: lottryChartData.data.Metadata
    });
  }
  editChart = async (chartId) => {

    if (chartId) {
      let chartData = await getChart({ id: chartId });
      this.setState({
        chartData: chartData.data.data,
        chartEditLoaded: true,
        editChart: !this.state.editChart,
      });

    } else {
      this.setState({
        chartData: "",
        chartEditLoaded: false,
        editChart: !this.state.editChart,
      });
    }
  }
  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case 'open':
        var openDigit = null;
        var digi = value;
        var sum = String(digi);
        if (sum.length === 1) {
          openDigit = sum;
        } else {
          var suml = stringSeprator(sum);
          var vt = sumofArray(suml);
          vt = String(vt);

          openDigit = vt.length === 1 ? vt[0] : vt[1];
        }
        this.setState({
          open: value,
          patti: openDigit
        });
        break;
      case 'close':
        var closeDigit = null;
        var cdigi = value;
        if (cdigi) {
          var csum = String(cdigi);
          if (csum.length === 1) {
            closeDigit = csum;
          } else {
            var csuml = stringSeprator(csum);
            var cvt = sumofArray(csuml);
            cvt = String(cvt);

            closeDigit = cvt.length === 1 ? cvt[0] : cvt[1];
          }
        } else {
          closeDigit = '';
        }
        this.setState({
          close: value,
          patti: String(this.state.patti) + String(closeDigit)
        });
        break;
      default:
        break;
    }
    this.setState({ [name]: value });
  }
  handlechart = async (event) => {
    event.preventDefault();
    const chart =
    {
      lottery_id: this.state.market,
      bet_type: this.state.bet_type,
      open: this.state.open,
      patti: this.state.patti,
      is_active: false
    };
    if (this.state.close) {
      chart.close = this.state.close;
      chart.is_active = true;
    }
    var response = await AddLotterychart(chart).catch((error) => {
      return error;
    });
    if (response.status === 201 || response.status === 200) {
      window.location.reload(false);

    } else if (response.response && response.response.data) {
      this.setState({
        chartError: response.response.data.errors[0]
      });
    }
  }
  handleeditChart = async (event) => {
    event.preventDefault();
    const chart =
    {
      lottery_id: this.state.market ? this.state.market : this.state.chartData.lottery_id,
      bet_type: this.state.bet_type ? this.state.bet_type : this.state.chartData.bet_type,
      open: this.state.open ? this.state.open : this.state.chartData.open,
      close: this.state.close ? this.state.close : this.state.chartData.close,
      patti: this.state.patti ? this.state.patti : this.state.chartData.patti,
    };

    var response = await update(chart, this.state.chartData._id).catch((error) => {
      return error;
    });
    if (response.status === 201 || response.status === 200) {
      window.location.reload(false);

      this.setState({
        editChart: !this.state.editChart,
      });
    } else if (response.response && response.response.data) {
      this.setState({
        chartError: response.response.data.errors[0]
      });
    }
  }


  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.Lotterychart();
    });
  }
  deleteChart = async (chart_id) => {
    const confirm = window.confirm('Are You sure to delete this result?');
    if (confirm) {
      await deleteChart({ id: chart_id });
      this.setState({
        success: 'Result Deleted Successfully'
      }, () => {
        this.Lotterychart();
      });
    }
  }

  heandelsearch = async (event) => {
    event.preventDefault();
    var { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      this.Lotterychart();
    });
  }
  componentDidMount() {
    this.Lotterychart();
    this.Lottery();
  }
  render() {

    const { isLoaded, lotteryList, LotterychartList, isChartLoaded, chartError, chartData, chartEditLoaded, success } = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                {localStorage.getItem('role') === "user" ? 
                  <CardTitle tag="h4">{this.state.language === "hin" ? i18n.CHART.CHART.hindi : i18n.CHART.CHART.english}</CardTitle>
                  : <CardTitle tag="h4">{i18n.CHART.CHART.english}</CardTitle>}
                </CardHeader>
                <CardBody>
                  {localStorage.getItem("role") === "admin" &&
                    <Form method="POST" className="border-bottom mb-3" onSubmit={this.handlechart}>
                      <Row>
                        <Col sm={4}>
                          <FormGroup>
                            <Label>Market</Label>
                            <select className="form-control" name="market" onChange={this.handleChange}>
                              <option value="">Select Market</option>
                              {isLoaded && lotteryList.map((list, key) => {
                                return (
                                  <option value={list._id} key={key}>{list.market_name}</option>
                                );
                              })}
                            </select>
                          </FormGroup>
                        </Col>
                        <Col sm={4}>
                          <FormGroup>
                            <Label>Result</Label>
                            <select className="form-control" name="bet_type" onChange={this.handleChange}>
                              <option value="">Select Bet Type</option>
                              <option value="single">Single</option>
                              <option value="single-patti">Single Patti</option>
                              <option value="double-patti">Double Patti</option>
                              <option value="triple-patti">Triple Patti</option>
                              <option value="jodi">Jodi</option>
                            </select>
                          </FormGroup>
                        </Col>
                        <Col sm={4}>
                          <FormGroup>
                            <Label>Open Patti</Label>
                            <Input type="number" min="0" name="open" onBlur={this.handleChange} defaultValue={this.state.open} placeholder="Please Enter Open result" />
                          </FormGroup>
                        </Col>
                        <Col sm={4}>
                          <FormGroup>
                            <Label>Result</Label>
                            <Input type="text" name="patti" onChange={this.handleChange} defaultValue={this.state.patti} placeholder="Please Enter Patti" />
                          </FormGroup>
                        </Col>
                        <Col sm={4}>
                          <FormGroup>
                            <Label>Close Patti</Label>
                            <Input type="number" min="0" name="close" onBlur={this.handleChange} defaultValue={this.state.close} placeholder="Please Enter Close result" />
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup className="text-left">
                        <Button type="submit" className="btn-lg theme-btn" onClick={this.toggle}>Submit</Button>
                      </FormGroup>
                    </Form>
                  }
                  {isChartLoaded &&
                    <>
                      {success &&
                        <Alert color="success">{success}</Alert>
                      }
                      <Row className="mb-2 mx-0">
                        <FormGroup className="col-sm-4">
                        {localStorage.getItem('role') === "user" ? <Label htmlFor="Search">{this.state.language === "hin" ? i18n.CHART.FILTER.hindi : i18n.CHART.FILTER.english}</Label>
                        : <Label htmlFor="Search">{i18n.CHART.FILTER.english}</Label>}
                          <Input type="text" id="Search" name="search" onChange={this.heandelsearch} placeholder="Search here..." />
                        </FormGroup>
                        <FormGroup className="col-sm-4">
                        {localStorage.getItem('role') === "user" ? <Label htmlFor="from">{this.state.language === "hin" ? i18n.CHART.FROM.hindi : i18n.CHART.FROM.english}</Label>
                        : <Label htmlFor="from">{i18n.CHART.FROM.english}</Label>}
                          <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="from" name="search_from" />
                        </FormGroup>
                        <FormGroup className="col-sm-4">
                        {localStorage.getItem('role') === "user" ? <Label htmlFor="to">{this.state.language === "hin" ? i18n.CHART.TO.hindi : i18n.CHART.TO.english}</Label>
                        : <Label htmlFor="to">{i18n.CHART.TO.english}</Label>}
                          <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="to" name="search_to" />
                        </FormGroup>
                      </Row>
                      <Col sm={12} className="table-responsive">
                        <Table className="table-striped">
                          <thead>
                            <tr className="table-info">
                            {localStorage.getItem('role') === "user" ? 
                            <>
                              <th>{this.state.language === "hin" ? i18n.CHART.S_NO.hindi : i18n.CHART.S_NO.english}</th>
                              <th>{this.state.language === "hin" ? i18n.CHART.MARKET_NAME.hindi : i18n.CHART.MARKET_NAME.english}</th>
                              <th>{this.state.language === "hin" ? i18n.CHART.RESULT.hindi : i18n.CHART.RESULT.english}</th>
                              <th>{this.state.language === "hin" ? i18n.CHART.DATE.hindi : i18n.CHART.DATE.english}</th>
                              </>
                              : <>
                              <th>{i18n.CHART.S_NO.english}</th>
                              <th>{i18n.CHART.MARKET_NAME.english}</th>
                              <th>{i18n.CHART.RESULT.english}</th>
                              <th>{i18n.CHART.DATE.english}</th>
                              </>}
                              {localStorage.getItem("role") === "admin" &&
                                <th>Action</th>
                              }
                            </tr>
                          </thead>
                          <tbody>
                            {isChartLoaded && LotterychartList.length > 0 && (LotterychartList.map((list, key) => {
                              let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                              return (
                                <tr key={key}>
                                  <td>{index}</td>
                                  <td>{list.lotteryDetail && list.lotteryDetail.market_name}</td>
                                  <td>{list.open}-{list.patti}{list.close ? '-' + list.close : ''}</td>
                                  <td>{moment(list.created_at).format('DD-MM-YYYY')}</td>
                                  {localStorage.getItem("role") === "admin" &&
                                    <td>
                                      <Button onClick={() => this.editChart(list._id)} className="btn btn-outline-info btn-round p-2 m-2" title="Change Chart">
                                        <i className="fa fa-edit" />
                                      </Button>
                                      <Button onClick={() => this.deleteChart(list._id)} className="btn btn-outline-danger btn-round p-2 m-2" title="Delete Result">
                                        <i className="fa fa-trash" />
                                      </Button>
                                    </td>
                                  }
                                </tr>
                              );
                            }) ||
                              <tr>
                                <td colSpan="6">No Data Available</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Col>
                      <Pagination
                        className="mt-2"
                        itemClass="page-item"
                        linkClass="page-link"
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.limit}
                        totalItemsCount={this.state.Metadata ? this.state.Metadata.totalCount : 0}
                        pageRangeDisplayed={10}
                        onChange={this.handlePageChange.bind(this)}
                      />
                      <Modal size="lg" isOpen={this.state.editChart} fade={this.state.fade} toggle={this.editChart}>
                        <ModalHeader toggle={() => this.editChart("")}>Edit Chart</ModalHeader>
                        <ModalBody>
                          <Form method="POST" onSubmit={this.handleeditChart}>
                            {chartError &&
                              <Alert color="danger">{chartError}</Alert>
                            }
                            <Row>
                              <Col sm={6}>
                                <FormGroup>
                                  <Label>Market</Label>
                                  <select className="form-control" name="market" onChange={this.handleChange}>
                                    <option value="">Select Market</option>
                                    {isLoaded && lotteryList.map((list, key) => {
                                      return (
                                        <option value={list._id} key={key}>{list.market_name}</option>
                                      );
                                    })}
                                  </select>
                                </FormGroup>
                              </Col>
                              <Col sm={6}>
                                <FormGroup>
                                  <Label>Bet Type</Label>
                                  <select className="form-control" name="bet_type" onChange={this.handleChange}>
                                    <option value="">Select Bet Type</option>
                                    <option value="single">Single</option>
                                    <option value="single-patti">Single Patti</option>
                                    <option value="double-patti">Double Patti</option>
                                    <option value="triple-patti">Triple Patti</option>
                                    <option value="jodi">Jodi</option>
                                  </select>
                                </FormGroup>
                              </Col>
                              <Col sm={6}>
                                <FormGroup>
                                  <Label>Open Time</Label>
                                  <Input type="number" min="0" name="open" onBlur={this.handleChange} defaultValue={chartEditLoaded && chartData.open} placeholder="Please Enter Open result" />
                                </FormGroup>
                              </Col>
                              <Col sm={6}>
                                <FormGroup>
                                  <Label>Patti</Label>
                                  <Input type="text" name="patti" onChange={this.handleChange} defaultValue={chartEditLoaded && chartData.patti} placeholder="Please Enter Patti" />
                                </FormGroup>
                              </Col>
                              <Col sm={6}>
                                <FormGroup>
                                  <Label>Close Time</Label>
                                  <Input type="number" min="0" name="close" onBlur={this.handleChange} defaultValue={chartEditLoaded && chartData.close} placeholder="Please Enter Close result" />
                                </FormGroup>
                              </Col>
                            </Row>
                            <FormGroup check row>
                              <Col sm={{ size: 4 }}>
                                <Button type="submit" className="btn-block theme-btn" >Submit</Button>
                              </Col>
                            </FormGroup>
                          </Form>
                        </ModalBody>
                      </Modal>
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

export default Chart;
