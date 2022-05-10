
import React from "react";

import moment from 'moment';
import 'moment/locale/zh-cn';
import {getLottery} from './services/lottery';
import {getChartbyLotteryId} from './services/chart';
import Pagination from "react-js-pagination";

import ShareSpinner from "./SharedComponent/Spinner";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col, FormGroup, Label, Input
} from "reactstrap";

class LotteryResult extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      market :"",
      bet_type :"",
      bedding_time :"",
      digit :"",
      patti :"",
      chartError :"",
      LotterychartList :"",
      chartId :"",
      isLoaded :false,
      isChartLoaded :false,
      chartEditLoaded :false,
      activePage:1,
      search_from: "",
      search_to: "",
      search: "",
      Metadata: 0,
      limit: 10,
    }
    
  }
  
  getLottery = async () => {
   
    let lottryData = await getLottery({id:this.props.match.params.id});
    this.setState({
        lotteryData : lottryData.data.data,
        isLoaded:true
    });
  }
  Lotterychart = async () => {
    var pagerule = {
      search:this.state.search,
      from: this.state.search_from,
      to: this.state.search_to,
      limit:this.state.limit,
      offset:this.state.activePage,
      lottery_id:this.props.match.params.id
    };
    let lottryChartData =await getChartbyLotteryId(pagerule);
    this.setState({
        LotterychartList : lottryChartData.data.data,
        isChartLoaded:true,
        Metadata:lottryChartData.data.Metadata
    }); 
}

handlePageChange(pageNumber) {
  this.setState({ activePage: pageNumber }, () => {
      this.getChiphistory();
  });
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
  this.getLottery();
}
  render() {
    
    const {isLoaded ,LotterychartList,isChartLoaded, lotteryData} = this.state;
    return (
      <>
        <div className="content">

          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                    <CardTitle tag="h4">{isLoaded && lotteryData.market_name + " -"} Last Result</CardTitle>
                </CardHeader>
                <CardBody>
                {
                      !isChartLoaded && <Col className="col-12 text-center my-5"> <ShareSpinner  /> </Col>
                }
                  {isChartLoaded && 
                  <>
                    <Row className="mb-2">
                        <FormGroup className="col-sm-4">
                          <Label htmlFor="Search">Filter</Label>
                          <Input type="text" id="Search" name="search" onChange={this.heandelsearch} placeholder="Search here..." />
                        </FormGroup>
                        <FormGroup className="col-sm-4">
                          <Label htmlFor="from">From</Label>
                          <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="from" name="search_from" />
                        </FormGroup>
                        <FormGroup className="col-sm-4">
                          <Label htmlFor="to">TO</Label>
                          <Input type="date" max={moment().format('YYYY-MM-DD')} onChange={this.heandelsearch} id="to" name="search_to" />
                        </FormGroup>
                      </Row>
                    <Col sm="12" className="px-0 table-responsive">
                      <Table className="table table-striped">
                      <thead>
                            <tr className="table-info">
                              <th>S.No</th>
                              <th>Market Name</th>
                              <th>Result</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isChartLoaded && LotterychartList.length > 0 && (LotterychartList.map((list, key) => {
                              let index = (Number(this.state.activePage)-1) * Number(this.state.limit) + Number(++key)
                              return (
                                <tr key={key}>
                                  <td>{index}</td>
                                  <td>{list.lotteryDetail && list.lotteryDetail.market_name}</td>
                                  <td>{list.open}-{list.patti}{list.close ? '-'+list.close : ''}</td>
                                  <td>{moment(list.created_at).format('DD-MM-YYYY')}</td>
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
                            totalItemsCount={this.state.Metadata? this.state.Metadata.totalCount: 0}
                            pageRangeDisplayed={10}
                            onChange={this.handlePageChange.bind(this)}
                            />
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

export default LotteryResult;
