
import React from "react";

import {AddLotterysetting, AllLotterysetting,getLotterySetting, UpdateLottery} from './../services/lottery_setting';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form, FormGroup, Label, Input, Alert
} from "reactstrap";

class Lotterysetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        edittoggle: false,
        LotterySettingData: "",
        settingError:"",
        fade: false,
        bet_type:"",
        min_stake:"",
        max_stake:"",
        rate:"",
        lotteryList:"",
        isLoaded:false,
        isLoadedLottery:false
    };
    this.edittoggle = this.edittoggle.bind(this);
};
handleChange = (event) => {
  event.preventDefault();
  const { name, value } = event.target;
  this.setState({[name]: value});
  }
  handlelotterySettingCreate = async (event) => {
    event.preventDefault();
      const setting = 
      {
        bet_type:this.state.bet_type,
        min_stake:this.state.min_stake,
        max_stake:this.state.max_stake,
        rate:this.state.rate,
        lottery_id:this.props.match.params.id
      };
      var response =await AddLotterysetting(setting).catch((error) => {
        return error;
      });
      if(response.status === 201 || response.status === 200){
        this.Lotterysetting();
      }else if(response.response && response.response.data){
        this.setState({
          settingError:response.response.data.errors[0]
        });
      }
    }
    handlelotterySettingEdit = async (event) => {
    event.preventDefault();
      const setting = 
      {
        _id:this.state.LotterySettingData[0]._id,
        min_stake:event.target.elements.min_stake.value,
        max_stake:event.target.elements.max_stake.value,
        rate:event.target.elements.rate.value,
      };
      UpdateLottery(setting);
      this.setState({
          edittoggle: !this.state.edittoggle,
          LotterySettingData:"",
          isLoadedLottery: false
      });
      this.Lotterysetting();
    }


    getLotterySetting = async (id) => {
      let LotterySettingData = await getLotterySetting({id:id});
      this.setState({
        LotterySettingData : LotterySettingData.data.data,
        isLoadedLottery:true
      });
    }
edittoggle(LotterySettingId=null) {
  console.log(LotterySettingId);
  if(LotterySettingId){
    this.getLotterySetting(LotterySettingId);
  }else{
    this.setState({
      LotterySettingData:"",
      isLoadedLottery: false
    });
  }
    this.setState({
        edittoggle: !this.state.edittoggle
    });
}
Lotterysetting = async () => {
  let lottryData =await AllLotterysetting({lottery_id:this.props.match.params.id});
  this.setState({
      lotteryList : lottryData.data.data,
      isLoaded:true
  }); 
}

componentDidMount() {
  this.Lotterysetting();
}
render() {
  const {isLoaded, lotteryList, LotterySettingData, isLoadedLottery,settingError} = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Lottery Setting</CardTitle>   
                </CardHeader>
                <CardBody>
                {settingError && 
                        <Alert className="bg-danger">{settingError}</Alert>
                      }
                    <Form method="POST" onSubmit={this.handlelotterySettingCreate}>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>BET TYPE</Label>
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
                                <Label>Min Stake</Label>
                                  <Input type="number" name="min_stake" onChange={this.handleChange} min="0" placeholder="Please Enter Min Stake" />
                              </FormGroup>
                            </Col>
                            <Col sm={4}>
                              <FormGroup>
                                <Label>Max Stake</Label>
                                <Input type="number" name="max_stake" min="0" onChange={this.handleChange} placeholder="Please Enter Max Stake" />
                              </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                <Label>Rate</Label>
                                <Input type="text" name="rate" onChange={this.handleChange} placeholder="Please Enter Rate" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup className="text-right">
                            <Button type="submit" className="btn-lg" onClick={this.toggle}>Submit</Button>
                        </FormGroup>
                    </Form> 
                </CardBody>
              </Card>
            </Col>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Setting</CardTitle>   
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Bet type</th>
                        <th>Min Stake</th>
                        <th>Max Stake</th>
                        <th>Rate</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {isLoaded && lotteryList.map((list,key) => {
                        return(
                          <tr key={key}>
                            <td>{list.bet_type}</td>
                            <td>{list.min_stake}</td>
                            <td>{list.max_stake}</td>
                            <td>{list.rate}</td>
                            <td>
                                <Button onClick={() => this.edittoggle(list._id)}
                                className="btn-round btn-icon mx-2"
                                color="warning"
                                outline
                                size="sm"
                              >
                                <i className="fa fa-edit" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <Modal isOpen={this.state.edittoggle} fade={this.state.fade}  toggle={() => this.edittoggle()}>
                    {isLoadedLottery &&
                      <>
                        <ModalHeader toggle={() => this.edittoggle()}>Edit Lottery</ModalHeader>
                        <ModalBody>   
                          <Form method="POST" onSubmit={this.handlelotterySettingEdit}>
                            <FormGroup>
                                <Label>Min Stake</Label>
                                <Input type="number" name="min_stake" min="0" onChange={this.handleChange} defaultValue={LotterySettingData[0].min_stake} placeholder="Please Enter Min Stake" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Max Stake</Label>
                                <Input type="number" name="max_stake" min="0" onChange={this.handleChange} defaultValue={LotterySettingData[0].max_stake} placeholder="Please Enter Max Stake" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Rate</Label>
                                <Input type="number" min="0" onChange={this.handleChange} defaultValue={LotterySettingData[0].rate} name="rate" placeholder="Please Enter Rate" />
                            </FormGroup>
                            <FormGroup>
                                <Button type="submit" className="btn-lg" onClick={this.toggle}>Submit</Button>
                            </FormGroup>
                          </Form>                     
                        </ModalBody>
                        </>
                      }
                    </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Lotterysetting;

