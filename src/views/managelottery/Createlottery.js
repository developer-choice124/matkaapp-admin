import React from "react";

import { NavLink } from "react-router-dom";

import { allusers, getUserByuserid } from './../services/users';
import { AllLottery, deleteLottery, AddLottery, getLottery, UpdateLottery, RemoveSupermaster } from './../services/lottery';
import Select from 'react-select';
import moment from 'moment';
import 'moment/locale/zh-cn';


import Pagination from "react-js-pagination";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form, FormGroup, Label, Input, Alert
} from "reactstrap";

moment.locale('en');
var currentdate = moment().format('YYYY-MM-DD');
var currentTime = parseInt(moment().format('HH')) + 3;

class Createlottery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lottery: false,
      edittoggle: false,
      asignedsupermaster: false,
      fade: false,
      name: "",
      selectedOption: [],
      date: "",
      lotteryData: "",
      getSupermaster: "",
      currentdate: currentdate,
      currentTime: currentTime,
      opentime: "",
      closetime: "",
      lotteryError: "",
      lotteryList: null,
      supermaster: null,
      is_thirdpl: null,
      activePage: 1,
      timeSlot: "",
      search_from: "",
      search_to: "",
      Metadata: 0,
      search: "",
      limit: 3,
      lotteryId: null,
      slotteryId: null,
      errors: {
        date: '',
        opentime: '',
        closetime: '',
      }
    };
    this.asignedsupermaster = this.asignedsupermaster.bind(this);
    this.edittoggle = this.edittoggle.bind(this);
    this.lottery = this.lottery.bind(this);
  };

  getLottery = async (id) => {

    let lottryData = await getLottery({ id: id });
    this.setState({
      lotteryData: lottryData.data.data,
      isLoaded: true
    });
  }

  edittoggle = async (lotteryId = null) => {
    if (lotteryId) {
      await this.getLottery(lotteryId);
    } else {
      this.setState({
        lotteryData: ""
      });
    }
    this.setState({
      edittoggle: !this.state.edittoggle
    });
  }
  asignedsupermaster = async (supermaster = null, lotteryId = null) => {
    if (supermaster.length > 0) {
      var user = await getUserByuserid({ user_ids: supermaster });
      this.setState({
        slotteryId: lotteryId,
        supermaster: user.data.data,
      });
    }
    this.setState({
      asignedsupermaster: !this.state.asignedsupermaster,
    });

  }


  lottery() {
    this.setState({
      lottery: !this.state.lottery
    });
  }
  time(time = 0) {
    var hourCac = [];
    for (var t = time; t < 24; t += 1) {
      hourCac.push(t);
    }

    var times = []
      , hours = hourCac
      , hour = null
      , min = null;

    for (hour in hours) {
      for (min = 0; min < 60; min += 1) {
        times.push(('0' + hours[hour]).slice(-2) + ':' + ('0' + min).slice(-2));
      }
    }
    return times;
  }
  handleChange = (event) => {
    // event.preventDefault();
    const { name, value, checked } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case 'date':
        if (currentdate > value) {
          errors.date = 'please select greater than today date';
        } else if (currentdate === value) {
          errors.date = '';
          this.setState({ timeSlot: this.time(currentTime) });

        } else {
          this.setState({ timeSlot: this.time() });
          errors.date = '';
        }
        break;
      case 'opentime':
        errors.opentime =
          value.length < 0
            ? 'Please Change Your Time!'
            : '';
        break;
      case 'closetime':
        errors.closetime =
          value.length < 0
            ? 'Please Change Your Time'
            : '';
        break;
      default:
        break;
    }

    if (name === 'is_thirdpl') {
      this.setState({ errors, [name]: checked });
    } else {
      this.setState({ errors, [name]: value });
    }
  }
  handleLottery = async (event) => {
    event.preventDefault();
    const lotterydata =
    {
      market_name: this.state.name,
      start_date: this.state.date,
      open: this.state.opentime,
      close: this.state.closetime,
      is_thirdpl: this.state.is_thirdpl,
      supermaster: this.state.selectedOption
    };

    var response = await AddLottery(lotterydata).then(function (response, error) {
      return response;
    }).catch((error) => {
      return error;
    });
    if (response.status === 201 || response.status === 200) {
      window.location.reload();
    } else if (response.response && response.response.data) {
      this.setState({
        lotteryError: response.response.data.errors[0]
      });
    }
  }
  handleEditLottery = async (event) => {
    event.preventDefault();
    const lotterydata =
    {
      market_name: this.state.name ? this.state.name : this.state.lotteryData.market_name,
      start_date: this.state.date ? this.state.date : this.state.lotteryData.start_date,
      open: this.state.opentime ? this.state.opentime : this.state.lotteryData.open,
      close: this.state.closetime ? this.state.closetime : this.state.lotteryData.close,
      is_thirdpl: this.state.is_thirdpl ? this.state.is_thirdpl : this.state.lotteryData.is_thirdpl,
      supermaster: this.state.selectedOption.length > 0 ? this.state.selectedOption : this.state.lotteryData.supermaster,
    };
    var response = await UpdateLottery(lotterydata, this.state.lotteryData._id).then(function (response, error) {
      return response;
    }).catch((error) => {
      return error;
    });
    if (response.status === 201 || response.status === 200) {
      window.location.reload();
    } else if (response.response && response.response.data) {
      this.setState({
        lotteryError: response.response.data.errors[0]
      });
    }
  }

  Lottery = async () => {
    var data = {
      search: this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit: this.state.limit,
      offset: this.state.activePage,
    };
    let lottryData = await AllLottery(data);
    this.setState({
      lotteryList: lottryData.data.data,
      isLoaded: true,
      Metadata: lottryData.data.Metadata
    });
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.Lottery();
    });
  }

  lotterydelete = async (lotteryId, status) => {
    //   var lotteryData = {
    //     lottery_id:lotteryId,
    //     status:"PENDEING",
    //     is_active:false
    //  };
    // var is_active_batting = await getBattingbyLotteryId(lotteryData);
    let Deleteuser = await deleteLottery({ id: lotteryId, status: status });
    return Deleteuser;
  }
  restoreLottery = async (lotteryId, status) => {
    await deleteLottery({ id: lotteryId, status: status });
    this.Lottery();
  }
  removesupermaster = async (supermasterId) => {
    await RemoveSupermaster({ id: this.state.slotteryId, supermasterId: supermasterId });

    window.location.reload();
  }
  async deleteLottery(lotteryId, status) {
    const confirm = window.confirm('Delete the Lottery?');
    if (confirm) {
      await this.lotterydelete(lotteryId, status);
    }

    window.location.reload();
  }


  heandelsearch = async (event) => {
    event.preventDefault();
    var { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      this.Lottery();
    });
  }

  // 
  selectChange = selectedOption => {
    var options = []

    if (selectedOption != null) {
      selectedOption.map(option => {
        options.push(option.value);
        return true;
      })

    }
    this.setState({ selectedOption: options });

  };
  componentDidMount() {
    this.Lottery();
  }
  render() {
    const { errors, lotteryList, isLoaded, timeSlot, lotteryData, lotteryError, supermaster } = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card className="table-responsive">
                <CardHeader className="d-flex">
                  <CardTitle tag="h4">Create Lottery</CardTitle>
                  <div className="ml-auto d-flex">
                    <div>
                      <Button color="danger" onClick={this.lottery}>Add Lottery</Button>
                      <Modal isOpen={this.state.lottery} fade={this.state.fade} toggle={this.lottery}>
                        <ModalHeader toggle={this.lottery}>Add Lottery</ModalHeader>
                        <ModalBody>
                          <Form method="POST" onSubmit={this.handleLottery}>
                            {lotteryError &&
                              <Alert color="danger">{lotteryError}</Alert>
                            }
                            <FormGroup row>
                              <Label sm={3}>Name</Label>
                              <Col sm={9}>
                                <Input type="text" onChange={this.handleChange} name="name" placeholder="Please Enter Name" required />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label sm={3}>Date</Label>
                              <Col sm={9}>
                                <Input type="date" onChange={this.handleChange} name="date" min={this.state.currentdate} placeholder="Please Enter Date" required />
                                {errors.date.length > 0 &&
                                  <span className='error text-danger'>{errors.date}</span>}
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label sm={3}>Bids Open Time</Label>
                              <Col sm={9}>
                                <Input type="text" autoComplete="off" onChange={this.handleChange} list="time" name="opentime" placeholder="Please Select Time" required />
                                {errors.opentime.length > 0 &&
                                  <span className='error text-danger'>{errors.opentime}</span>}
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label sm={3}>Bids Close Time</Label>
                              <Col sm={9}>
                                <Input type="text" autoComplete="off" onChange={this.handleChange} list="time" name="closetime" placeholder="Please Select Time" required />
                                {errors.closetime.length > 0 &&
                                  <span className='error'>{errors.closetime}</span>}
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Supermaster onChange={(e) => { this.selectChange(e); }} />
                            </FormGroup>
                            <FormGroup row>
                              <Col sm={1} className="text-right">
                                <input type="checkbox" name="is_thirdpl" className="mt-2" onChange={this.handleChange} />
                              </Col>
                              <Label sm={11}>This is third party lottery.</Label>
                            </FormGroup>
                            <FormGroup check row>
                              <Col sm={{ size: 10, offset: 2 }}>
                                <Button type="submit" onClick={this.toggle}>Submit</Button>
                              </Col>
                            </FormGroup>
                          </Form>
                        </ModalBody>
                      </Modal>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="table-responsive">
                  <Row className="mb-2">
                    <FormGroup className="col-sm-12">
                      <Label htmlFor="Search" tag="h4" className="my-0">Filter</Label>
                      <Input type="text" id="Search" name="search" onChange={this.heandelsearch} placeholder="Search here..." />
                    </FormGroup>
                  </Row>
                  {isLoaded ?
                    <>
                      <table className="table table-striped">
                        <thead>
                          <tr className="table-info">
                            <th>#</th>
                            <th>Name</th>
                            <th>Opening Bids</th>
                            <th>Closing Bids</th>
                            <th>Third Party Lottery</th>
                            <th>Date</th>
                            <th>status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lotteryList ? lotteryList.map((list, key) => {
                            let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                            return (
                              <tr key={key}>
                                <td>{index}</td>
                                <td>{list.market_name}</td>
                                <td>{list.open}</td>
                                <td>{list.close}</td>
                                <td>{list.is_thirdpl === true ? 'YES' : 'NO'}</td>
                                <td>{list.start_date}</td>
                                <td>{list.is_active ? "Active" : "Deactive"}</td>
                                {list.is_active ?
                                  <td>
                                    <Button onClick={() => this.edittoggle(list._id)}
                                      className="btn-round btn-icon mx-2"
                                      outline={String("true")}
                                      color="warning"
                                      size="sm"
                                    >
                                      <i className="fa fa-edit" />
                                    </Button>
                                    <Button onClick={() => this.asignedsupermaster(list.supermaster, list._id)}
                                      className="btn-round btn-icon mx-2"
                                      outline={String("true")}
                                      color="warning"
                                      size="sm"
                                      title="View Asigned Supermaster"
                                    >
                                      <i className="fa fa-eye" />
                                    </Button>
                                    <Button
                                      className="btn-round btn-icon mx-2"
                                      outline={String("true")}
                                      color="danger"
                                      size="sm"
                                      onClick={() => this.deleteLottery(list._id, false)}
                                    >
                                      <i className="fa fa-trash" />
                                    </Button> <br></br>
                                    <NavLink to={"/dashboard/setting/" + list._id}
                                      className="btn-round btn-icon small m-0 p-1"
                                      outline={String("true")}
                                      color="danger"
                                      size="sm"
                                    >
                                      Lottery Setting
                                    </NavLink>
                                  </td>
                                  :
                                  <td>
                                    <Button
                                      className="btn btn-outline={'true'}-danger btn-round py-2 m-2"
                                      onClick={() => this.restoreLottery(list._id, true)}
                                    >
                                      Restore Lottery
                                    </Button>
                                  </td>
                                }
                              </tr>
                            );
                          }) : <tr><td colSpan="6">No Data Here.</td></tr>}
                        </tbody>
                      </table>
                      <Pagination
                        className="mt-2"
                        itemClass="page-item"
                        linkClass="page-link"
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.limit}
                        totalItemsCount={this.state.Metadata ? this.state.Metadata.totalCount : 0}
                        pageRangeDisplayed={4}
                        onChange={this.handlePageChange.bind(this)}
                      />
                    </>
                    : <h3>Loading....</h3>}
                </CardBody>
              </Card>

              <Modal isOpen={this.state.edittoggle} fade={this.state.fade} toggle={this.edittoggle}>
                <ModalHeader toggle={() => this.edittoggle("")}>Edit Lottery</ModalHeader>
                <ModalBody>
                  <Form method="POST" onSubmit={this.handleEditLottery} >
                    <FormGroup row>
                      <Label sm={3}>Name</Label>
                      <Col sm={9}>
                        <Input type="text" name="name" onChange={this.handleChange} defaultValue={lotteryData.market_name} placeholder="Please Enter Name" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={3}>Date</Label>
                      <Col sm={9}>
                        <Input type="date" onChange={this.handleChange} name="date" min={moment(lotteryData.start_date).format('DD-MM-YYYY HH:mm')} defaultValue={lotteryData.start_date} placeholder="Please Enter Date" />
                        {errors.date.length > 0 &&
                          <span className='error text-danger'>{errors.date}</span>}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={3}>Bids Open Time</Label>
                      <Col sm={9}>
                        <Input type="text" autoComplete="off" onChange={this.handleChange} defaultValue={lotteryData.open} list="time" name="opentime" placeholder="Please Select Date" required />
                        {errors.opentime.length > 0 &&
                          <span className='error text-danger'>{errors.opentime}</span>}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={3}>Bids Close Time</Label>
                      <Col sm={9}>
                        <Input type="text" autoComplete="off" onChange={this.handleChange} defaultValue={lotteryData.close} list="time" name="closetime" placeholder="Please Select Date" required />
                        {errors.closetime.length > 0 &&
                          <span className='error'>{errors.closetime}</span>}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Supermaster onChange={(e) => { this.selectChange(e); }} />
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={1} className="text-right">
                        <input type="checkbox" name="is_thirdpl" className="mt-2" onChange={this.handleChange} defaultChecked={lotteryData.is_thirdpl} />
                      </Col>
                      <Label sm={11}>This is third party lottery.</Label>
                    </FormGroup>
                    <FormGroup check row>
                      <Col sm={{ size: 10, offset: 2 }}>
                        <Button type="submit" onClick={this.toggle}>Submit</Button>
                      </Col>
                    </FormGroup>
                  </Form>
                </ModalBody>
              </Modal>
              <Modal className="dialog-lg" isOpen={this.state.asignedsupermaster} fade={this.state.fade} toggle={this.asignedsupermaster}>
                <ModalHeader toggle={() => this.asignedsupermaster("", "")}>Asigned Supermaster</ModalHeader>
                <ModalBody>
                  <Row>
                    {(supermaster && supermaster.length > 0) ? supermaster.map((superMaster, key) => {
                      return (
                        <Col sm={4} className="mb-2" key={key}><span className="p-2 border">{superMaster.username}</span>
                          <Button onClick={() => this.removesupermaster(superMaster._id)} className="delete-btn" title={"Delete " + superMaster.username}>
                            <i className="fa fa-times-circle" />
                          </Button>
                        </Col>
                      );
                    }) : <h4 className="mx-auto">Not Assigned</h4>}
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </div>
        <datalist id="time">
          {timeSlot ? timeSlot.map((time, key) => {
            var t = new Date("2021-2-15 "+time);
            moment.locale('en');
            var r = moment(t).format('h:mm a');
            return (
              <option value={r} key={key} />
            );
          }) : <option />
          }
        </datalist>
      </>
    );
  }
}

export default Createlottery;


function Supermaster(props) {
  const options = [];
  var pagerule = {
    search: "",
    from: "",
    to: "",
    limit: 10000,
    offset: 1,
  };
  var data = {};
  allusers({ role: 'supermaster' }, pagerule).then(res => {
    let superuserdata = res.data.data;
    superuserdata.map((list) => {
      data = {
        label: list.name,
        value: list._id
      }
      options.push(data);
      return true;
    })
    return options;
  });

  return (
    <>
      <Label className="col-3">Select Supermaster</Label>
      <Select className="col-9"
        value={props.value}
        options={options}
        name='supermasterId'
        isMulti={true}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
      />
    </>
  );
}