
import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';

import {getChiphistory} from './services/chips';

import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from 'jquery';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

class ChipsTransaction extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      ChipsTransactionData :"",
      isLoaded :false
    }
  }

  getChiphistory = async () => {
    var id = 0;
    if(this.props.match.params.id){
      id=this.props.match.params.id;
    }else{
      id=localStorage.getItem("userId");
    }
   var ChipsTransactionData =await getChiphistory({id:id});
    this.setState({
        ChipsTransactionData : ChipsTransactionData.data.data,
        isLoaded:true
    }); 
  }

componentDidMount() {
    this.getChiphistory();
}
  render() {
    
    const {isLoaded , ChipsTransactionData} = this.state;
    $(document).ready(function () {
      $("#Datatablelist").DataTable();
  });
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Chips Transaction</CardTitle>
                </CardHeader>
                <CardBody  className="table-responsive">
                {isLoaded &&
                  <table id="Datatablelist">
                    <thead className="text-primary">
                      <tr>
                        <th>S.No</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Credit</th>
                        <th>Debit</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                    {ChipsTransactionData && ChipsTransactionData.map((transection, key) => {
                            return(
                              <tr key={key}>
                                <td>{++key}</td>
                                <td>{moment(transection.created_at).format('DD-MM-YYYY')}</td>
                                <td>{transection.description}</td>
                                <td className="text-success">{transection.credit}</td>
                                <td className="text-danger">{transection.debit}</td>
                                <td><span className="btn btn-success">{transection.balance}</span></td>
                              </tr>
                            );
                    })}
                    </tbody>
                  </table>
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

export default ChipsTransaction;
