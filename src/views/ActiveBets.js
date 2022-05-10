import React, { Component } from 'react';
import { get_currnet_bets } from './services/betting';
import { i18n } from "components/i18n/hindi";
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
} from "reactstrap";
import moment from 'moment';

class ActiveBets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentBets: {},            
      language: localStorage.getItem('language')
        }
    }
    getCurrentBets = async () => {
        var id = localStorage.getItem("userId");
        var body = { id }
        await get_currnet_bets(body)
            .then(res => {
                this.setState({ currentBets: res.data })
            }).catch(error => {
                console.log(error);
            })
    }

    componentDidMount() {
        this.getCurrentBets();
    }
    render() {
        const currentBets = this.state.currentBets.data;
        return (
            <>
                <div className="content">
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">{this.state.language === "hin" ? i18n.ACTIVE_BETS.CURRENT_ACTIVE_BETS.hindi : i18n.ACTIVE_BETS.CURRENT_ACTIVE_BETS.english}</CardTitle>
                                </CardHeader>
                                {/* {this.state.language === "hin" ? i18n.ACTIVE_BETS.ACTIVE_BETS.hindi : i18n.ACTIVE_BETS.ACTIVE_BETS.english} */}
                                <CardBody className="table-responsive">
                                    {currentBets ?
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">{this.state.language === "hin" ? i18n.ACTIVE_BETS.S_NO.hindi : i18n.ACTIVE_BETS.S_NO.english}</th>
                                                    <th scope="col">{this.state.language === "hin" ? i18n.ACTIVE_BETS.MARKET_NAME.hindi : i18n.ACTIVE_BETS.MARKET_NAME.english}</th>
                                                    <th scope="col">{this.state.language === "hin" ? i18n.ACTIVE_BETS.BETS_TYPE.hindi : i18n.ACTIVE_BETS.BETS_TYPE.english}</th>
                                                    <th scope="col">{this.state.language === "hin" ? i18n.ACTIVE_BETS.DIGIT.hindi : i18n.ACTIVE_BETS.DIGIT.english}</th>
                                                    <th scope="col">{this.state.language === "hin" ? i18n.ACTIVE_BETS.BETTING_TIME.hindi : i18n.ACTIVE_BETS.BETTING_TIME.english}</th>
                                                    <th scope="col">{this.state.language === "hin" ? i18n.ACTIVE_BETS.BET_AMOUNT.hindi : i18n.ACTIVE_BETS.BET_AMOUNT.english}</th>
                                                    <th scope="col">{this.state.language === "hin" ? i18n.ACTIVE_BETS.DATE.hindi : i18n.ACTIVE_BETS.DATE.english}</th>
                                                    <th scope="col">{this.state.language === "hin" ? i18n.ACTIVE_BETS.STATUS.hindi : i18n.ACTIVE_BETS.STATUS.english}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentBets && currentBets.map((bet, idx) => (
                                                    <tr key={idx}>
                                                        <th scope="row">{idx + 1}</th>
                                                        <td>{bet.market_name}</td>
                                                        <td>{bet.bet_type}</td>
                                                        <td>{bet.digit}</td>
                                                        <td>{bet.betting_time}</td>
                                                        <td>{bet.bet_amount}</td>
                                                        <td>{moment(bet.created_at).format('DD-MM-YYYY HH:mm')}</td>
                                                        <td>{bet.is_active ? "Active" : "Deactive"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        : "No Active Bets"}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>

        )
    }
}

export default ActiveBets;