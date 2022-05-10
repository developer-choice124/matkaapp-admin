
import React from "react";

import {AllLotterysetting } from './../services/lottery_setting';
import {getLottery} from './../services/lottery';
import {checkresultchart} from './../services/chart';
import {Betplace,getBetting} from './../services/betting';
import Pagination from "react-js-pagination";

import ShareSpinner from "../SharedComponent/Spinner";
// reactstrap components
import {
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button, Form, FormGroup, Label, Input, Table, CardHeader 
} from "reactstrap";

import moment from 'moment';
import 'moment/locale/zh-cn';

import { single, singlepatti, doublepatti, tripalpatti, jodi, currentdate } from './../../components/variable/global';
import { i18n } from "components/i18n/hindi";

var now = new Date()
var closetime = moment(now).add(20, "minutes").format('HH:mm');

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          lotteryData:"",
          BettingData:"",
          isLoaded:"",
          GetMarketTypes:"",
          name: "",
          amount: "",
          min_stake:(this.props.location.minStake !== undefined) ? this.props.location.minStake : localStorage.getItem('maxStake'),
          max_stake:(this.props.location.maxStake !== undefined) ? this.props.location.maxStake : localStorage.getItem('minStake'),
          rate:(this.props.location.rate !== undefined) ? this.props.location.rate : localStorage.getItem('rate'),
          digitarray:single,
          selectedDigit:[],
          singletype:"",
          singlepattitype:null,
          doublepattitype:null,
          triplepattitype:null,
          joditype:null,
          bet_type:"single",
          betting_time:"",
          isBattingLoaded:false,
          isLoading:false,
          activePage:1,
          search_from: "",
          search_to: "",
          search: "",
          lastresult: "",
          limit: 10,
          language: localStorage.getItem('language')
        };
      };
      
      handleNameChange = evt => {
          this.setState({ name: evt.target.value });
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
            offset:this.state.activePage
          };
          var d1;
          if(this.props.match.params.pathParam2 || this.props.match.params.pathParam2 !== undefined){
            d1 = this.props.match.params.pathParam2;
          }else{
            d1 = moment().format('YYYY-MM-DD');
        
          }
          pagerule.min_date=d1;
        let BettingData = await getBetting({id:localStorage.getItem("userId"),lottery_id:this.props.match.params.id}, pagerule);
        this.setState({
            BettingData : BettingData.data.data,
            isBattingLoaded:true,
            Metadata:BettingData.data.Metadata
        });
      }
      GetMarketTypes = async () => {
          let GetMarketTypes =await AllLotterysetting({lottery_id:this.props.match.params.id});
          GetMarketTypes.data.data.map((type) => {
            if(type.bet_type === "single"){
                this.setState({
                    singletype:type
                  }); 
            }else if(type.bet_type === "single-patti"){
                this.setState({
                    singlepattitype:type
                  }); 
            }else if(type.bet_type === "double-patti"){
                this.setState({
                    doublepattitype:type
                  }); 
            }else if(type.bet_type === "triple-patti"){
                this.setState({
                    triplepattitype:type
                  }); 
            }else if(type.bet_type === "jodi"){
                this.setState({
                    joditype:type
                  }); 
            }
            
            return true;
          });
          this.setState({
            GetMarketTypes : GetMarketTypes.data.data,
            isLoaded:true
          }); 
        }
        getResult = async () => {
            // getTodayResult = await this.getResult();
            var checkrule = {
                from: moment().format('YYYY-MM-DD'),
                to: moment().format('YYYY-MM-DD'),
                lottery_id:this.props.match.params.id,
                bet_type:this.state.bet_type,
                bedding_time:'open',
            };
        
            await checkresultchart(checkrule);
        }

    handlebetplace = async (evt) => {
        this.setState({ isLoading: true });
        evt.preventDefault();
        if(!evt.target.elements.stack.value ||evt.target.elements.stack.value < this.state.minStake){
            alert("This Bet can not be placed!");
            window.location.reload();
        }else{
            const digitlist = this.state.selectedDigit.map((digit, idx) => {
                return {
                    digit:digit,
                    amount:evt.target.elements.stack.value
                };
            });
            const placelotterydata = 
                {
                    market_name:this.state.lotteryData.market_name,
                    bet_type:this.state.bet_type,
                    betting_time:evt.target.elements.betting_time.value,
                    rate:this.state.rate,
                    user_id: localStorage.getItem("userId"),
                    lottery_id: this.state.lotteryData._id,
                    digitlist:digitlist
                };
    
                var checkrule = {
                    from: moment().format('YYYY-MM-DD'),
                    to: moment().format('YYYY-MM-DD'),
                    lottery_id:this.props.match.params.id,
                    bet_type:this.state.bet_type,
                };
                checkrule[evt.target.elements.betting_time.value] = { $exists: true};
                let lottryChartData =await checkresultchart(checkrule);
               if((lottryChartData && lottryChartData.data.data)){
                   alert("This Bet can not be placed!");
                   window.location.reload();
                }else{
                    Betplace(placelotterydata).then(function(response, error) {
                        window.location.reload();
                    }).catch(err => {
                        alert(err.response.data.msg);
                        window.location.reload();
                    });
               }
        }
        this.setState({
            isLoading: false
          });
        };

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        switch (name) {
            case 'bet_type': 
                switch(value){
                    case 'single':
                        this.setState({
                            digitarray:single,
                            rate:this.state.singletype.rate,
                            min_stake:this.state.singletype.min_stake,
                            max_stake:this.state.singletype.max_stake,
                        });
                        break;
                    case 'single-patti':
                        this.setState({
                            digitarray:singlepatti,
                            rate:this.state.singlepattitype.rate,
                            min_stake:this.state.singlepattitype.min_stake,
                            max_stake:this.state.singlepattitype.max_stake,
                        });
                        break;
                    case 'double-patti':
                        this.setState({
                            digitarray:doublepatti,
                            rate:this.state.doublepattitype.rate,
                            min_stake:this.state.doublepattitype.min_stake,
                            max_stake:this.state.doublepattitype.max_stake,
                        });
                        break;
                    case 'triple-patti':
                        this.setState({
                            digitarray:tripalpatti,
                            rate:this.state.triplepattitype.rate,
                            min_stake:this.state.triplepattitype.min_stake,
                            max_stake:this.state.triplepattitype.max_stake,
                        });
                        break;
                    case 'jodi':
                        this.setState({
                            digitarray:jodi,
                            rate:this.state.joditype.rate,
                            min_stake:this.state.joditype.min_stake,
                            max_stake:this.state.joditype.max_stake,
                        });
                        break;
                    
                    default:
                        break;
                }
                break;
            case 'betting_time':
            switch(value){
                case 'open':
                    this.GetMarketTypes();
                break;
                case 'close':
                    let marketType = [];
                    this.state.GetMarketTypes.map((type) => { 
                        if(type.bet_type !== "jodi"){
                            marketType.push(type);
                        }
                        return true;
                        });
                        this.setState({
                        GetMarketTypes:marketType
                    });
                break;
                default:
                break;
            }
            break;
            default:
                break;
            }
        this.setState({[name]: value});
    }
    handledigitChange = (event) => {
        const { value, checked } = event.target;
        var digiar = this.state.selectedDigit;
        if(checked){
            digiar.push(value)
        }else{
            var index = digiar.indexOf(value);
            digiar.splice(index, 1) ;
        }
        this.setState({selectedDigit: digiar});
    }
        
handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
        this.getBetting();
    });
  }
  
  heandelsearch = async (event) => {
    event.preventDefault();
    var { name, value } = event.target;
    this.setState({ [name]: value }, () => {
        this.getBetting();
    });
  }

      componentDidMount() {
        this.GetMarketTypes();
        this.getLottery();
        this.getBetting();
        this.getResult();
        if(this.props.location.maxStake){
            localStorage.setItem("maxStake", `${this.props.location.maxStake}`);
            localStorage.setItem("minStake", `${this.props.location.minStake}`);
            localStorage.setItem("rate", `${this.props.location.rate}`);
        }
      }
  render() {
      if(localStorage.getItem("is_blocked") === "true" || localStorage.getItem("role") !== "user"){
        window.location.replace('/');
      }
      const { isLoaded ,lotteryData,GetMarketTypes,min_stake, max_stake, rate,digitarray,BettingData, isBattingLoaded} = this.state;
    return (
      <>
        <div className="content">
          <Row className="py-5 my-5">
            <Col sm="12">
                <Card>
                    <CardHeader className="border-bottom pb-2"><h2 className="mb-0"><b>{lotteryData.market_name}</b></h2></CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={5}>
                                {isLoaded &&
                                    <Form className="py-3" onSubmit={this.handlebetplace}>
                                        <Row className="mx-0">
                                            <Col sm={6} className="px-0 px-sm-2 mb-3">
                                                <FormGroup>
                                                    <Input type="select" name="select" id="gameDate" >
                                                        <option value={currentdate}>{currentdate}</option>
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col sm={6} className="px-0 mb-3">
                                                <FormGroup>
                                                    <Input type="select" name="betting_time" id="Game" onChange={this.handleChange} required>
                                                        {!moment(new Date("2021-07-16 " +lotteryData.open)).isBefore(new Date("2021-07-16 " +closetime))
                                                        // (closetime < lotteryData.open) 
                                                        ?
                                                            <option value="open" selected>{lotteryData.market_name} {this.state.language === "hin" ? i18n.GAMES.OPEN.hindi : i18n.GAMES.OPEN.english}  ( {lotteryData.open} )</option>
                                                            : ''
                                                        }
                                                        <option value="close">{lotteryData.market_name} {this.state.language === "hin" ? i18n.GAMES.CLOSE.hindi : i18n.GAMES.CLOSE.english} ( {lotteryData.close} )</option>
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col sm={12} className="px-0 px-sm-2 mb-3">
                                                <FormGroup className="row mx-0">
                                                    <Label for="GameType" className="uppercase col-sm-6 px-0"><legend><small className="uppercase">{this.state.language === "hin" ? i18n.GAMES.BETS_TYPE.hindi : i18n.GAMES.BETS_TYPE.english}</small></legend></Label>
                                                    <Input type="select" className="col-sm-6 uppercase" name="bet_type" id="GameType" onChange={this.handleChange} required>
                                                        <option value="">{this.state.language === "hin" ? i18n.GAMES.SELECT.hindi : i18n.GAMES.SELECT.english}</option>
                                                        {GetMarketTypes && GetMarketTypes.map((type) => {//console.log("type.bet_type: ",type)
                                                            return (
                                                                <>
                                                                {moment(new Date("2021-07-16 " +lotteryData.open)).isBefore(new Date("2021-07-16 " +closetime)) && type.bet_type === "jodi" ?  ""
                                                                : <option value={type.bet_type}>{type.bet_type}</option>}
                                                                
                                                                {/* <option vlue={type.bet_type}>{moment(new Date("2021-07-16 " +lotteryData.open)).isBefore(new Date("2021-07-16 " +closetime)) && type.bet_type === "jodi" ? "" : type.bet_type}</option> */}
                                                                </>
                                                            )
                                                        })};
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col sm={12} className="px-2">
                                                <FormGroup className="row mx-0">
                                                    <Label className="uppercase col-6 px-0"><legend><small className="uppercase">{this.state.language === "hin" ? i18n.GAMES.RATE.hindi : i18n.GAMES.RATE.english}:</small></legend></Label>
                                                    <Label className="uppercase col-6"><h4 className="m-0">{rate}</h4></Label>
                                                </FormGroup>
                                            </Col>
                                            <Col sm={12} className="px-2">
                                                <FormGroup className="row mx-0">
                                                    <Label className="uppercase col-6 px-0"><legend><small>{this.state.language === "hin" ? i18n.GAMES.STAKES_MIN.hindi : i18n.GAMES.STAKES_MIN.english} :</small></legend></Label>
                                                    <Label className="uppercase col-6"><h4 className="m-0">{min_stake}-{max_stake}</h4></Label>
                                                </FormGroup>
                                            </Col>
                                            <hr />
                                                <Row className="mobile-card px-2 px-sm-0 mx-0">
                                                    <Col sm={12} className="px-0">
                                                        <FormGroup className="row mx-0">
                                                            <Label for="digit" className="uppercase col-sm-12 px-0"><legend><small className="uppercase">{this.state.language === "hin" ? i18n.GAMES.DIGIT.hindi : i18n.GAMES.DIGIT.english} :</small></legend></Label>
                                                            {/* <Input type="select" className="col-sm-6" value={"name"} id="digit" required>
                                                                <option value="">select</option>
                                                            </Input> */}
                                                            <ul className="digit-selection-arr">
                                                                {digitarray && digitarray.map((type,key) => {
                                                                    return (
                                                                        <>
                                                                        <li key={key}>
                                                                            <input type="checkbox" name={type} onChange={this.handledigitChange} defaultValue={type} id={type}/>
                                                                            <label htmlFor={type}>{type}</label>
                                                                        </li>
                                                                        </>
                                                                    )
                                                                })}
                                                            </ul>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col sm={12} className="px-0">
                                                        <FormGroup className="row mx-0">
                                                            <Label for="digit" className="uppercase col-sm-12 px-0"><legend><small className="uppercase">{this.state.language === "hin" ? i18n.GAMES.STAKE.hindi : i18n.GAMES.STAKE.english} :</small></legend></Label>  
                                                            <Input type="number" className="col-sm-12" name={"stack"} min={min_stake} max={max_stake} id="exampleFile" required/>
                                                        </FormGroup>
                                                    </Col>
                                                   
                                                </Row>

                                            <Button type="submit" className="mx-auto btn-md w-100 theme-btn rounded submit-btn-spninner" disabled={this.state.isLoading}>
                                                {this.state.isLoading ? <span className="w-25"><ShareSpinner as="span" animation="grow" size="xs" role="status" aria-hidden="true" /> Loading...</span> : <>{this.state.language === "hin" ? i18n.GAMES.PLACE_BET.hindi : i18n.GAMES.PLACE_BET.english}</>}
                                            </Button>
                                        </Row>
                                    </Form>
                                }
                            </Col>
                            <Col md={7} className="py-2 border-left table-responsive">
                                <Table className="table-striped" responsive size="sm">
                                    <thead className="table-info">
                                        <tr>
                                            <th>{this.state.language === "hin" ? i18n.GAMES.ROUND_ID.hindi : i18n.GAMES.ROUND_ID.english}</th>
                                            <th>{this.state.language === "hin" ? i18n.GAMES.DIGIT.hindi : i18n.GAMES.DIGIT.english}</th>
                                            <th>{this.state.language === "hin" ? i18n.GAMES.BETTING_TIME.hindi : i18n.GAMES.BETTING_TIME.english}</th>
                                            <th>{this.state.language === "hin" ? i18n.GAMES.BETS_TYPE.hindi : i18n.GAMES.BETS_TYPE.english}</th>
                                            <th>{this.state.language === "hin" ? i18n.GAMES.AMOUNT.hindi : i18n.GAMES.AMOUNT.english}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isBattingLoaded && BettingData.map((lottery,key) => {
                                            let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                                            return (
                                                <tr key={++key}>
                                                    <th scope="row">{index}</th>
                                                    <td>{lottery.digit}</td>
                                                    <td>{lottery.betting_time}</td>
                                                    <td>{lottery.bet_type}</td>
                                                    <td>{lottery.bet_amount}</td>
                                                    <td></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
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
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                    <hr />
                    </CardFooter>
                </Card>
              </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Game;
