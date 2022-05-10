
import React from "react";
import { NavLink } from "react-router-dom";

import { Breadcrum } from "./Breadcrum.js";

import { Card, CardBody, Row, Col } from 'reactstrap';

import { lotteryfilterd } from './../../services/lottery';
import { checkresultchart } from './../../services/chart';
import { get_live_books } from './../../services/betting';
import ShareSpinner from "./../../SharedComponent/Spinner";

import moment from 'moment';
import 'moment/locale/zh-cn';

class Lottery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            lotteryData: "",
            reftime : "",
        };
    };

    todayLottery = async () => {
        let lotteryData = await lotteryfilterd({ slug: "today" });
        lotteryData.data.data.map(async (lottery, key) => {
            var checkrule = {
                from: moment().format('YYYY-MM-DD'),
                to: moment().format('YYYY-MM-DD'),
                lottery_id: lottery._id,
                bedding_time: 'open',
                bet_type: 'single-patti'
            };
            let lottryChartData = await checkresultchart(checkrule);
            if (lottryChartData.data.data) {
                lotteryData.data.data[key].result = lottryChartData.data.data;
            } else {
                lotteryData.data.data[key].result = '';
            }
            let betsData = await get_live_books({ admin_id: localStorage.getItem("userId"), lottery_id: lottery._id });
            if (betsData.data.data) {
                lotteryData.data.data[key].bets = betsData.data.data;
            } else {
                lotteryData.data.data[key].bets = '';
            }
        });
        this.setState({
            lotteryData: lotteryData.data.data,
            isLoaded: true
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
        const breadcrumb = [
            {
                name: "Today Lottery",
                path: null,
                isactive: true
            }
        ];
        const { isLoaded, lotteryData } = this.state;

        return (
            <>
                <Col sm={12} className="px-0">
                    <Breadcrum breadcrumb={breadcrumb} />
                </Col>
                <Card>
                    <CardBody>
                        <Row>
                            {
                                !isLoaded && <Col className="col-12 text-center my-5"> <ShareSpinner /> </Col>
                            }
                            {isLoaded && lotteryData.map((list, key) => {
                                return (
                                    <Col sm={4} className="px-2" key={key}>
                                        <Card className="border lottery-card text-center">
                                            <CardBody className="py-0">
                                                <div className="lottery-inner pb-2">
                                                    <Row className="cardHeaderBottomBorder">
                                                        <div className="icon col-2 px-0">
                                                            <i className="nc-icon nc-planet" />
                                                        </div>
                                                        <span className={"live"}>
                                                            {list.bets != 0 ? "LIVE" : ""}
                                                        </span>
                                                        <h5 className="col-7 mb-0 d-flex text-right px-1 date py-2 ml-auto">
                                                            <marquee className="d-inline-block w-75">{list.result ? <>Open Patti: {list.result.open + "-" + list.result.patti} </> : ''}</marquee>
                                                            <NavLink className="btn btn-warning text-dark px-1 py-1 m-0 mr-2 w-50" to={"/dashboard/last-result/" + list._id}><small>Last Result</small></NavLink>
                                                        </h5>
                                                    </Row>
                                                    <h4 className="my-2 uppercase">{list.market_name}</h4>
                                                    <Row>
                                                        <h6 className="col-6 mb-2 description uppercase">Open {list.open}</h6>
                                                        <h6 className="col-6 mb-2 description uppercase">Close {list.close}</h6>
                                                    </Row>
                                                    <NavLink className="btn theme-btn btn-block" to={"/dashboard/today/" + list._id} color="danger">Show Details</NavLink>

                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>

                    </CardBody>
                </Card>
            </>
        );
    }
}
export default Lottery;