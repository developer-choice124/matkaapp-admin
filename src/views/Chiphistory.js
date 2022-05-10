
import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

class Chiphistory extends React.Component {
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Chip History</CardTitle>
                </CardHeader>
                <CardBody>
                 <Col sm="12" className="px-0 table-responsive">
                    <Table className="table table-striped">
                        <thead>
                            <tr className="table-info">
                            <th>S.No</th>
                            <th>Bet Type</th>
                            <th>User</th>
                            <th>Description</th>
                            <th>Stake</th>
                            <th>Date</th>
                            <th>Profit</th>
                            <th>Loss</th>
                            <th>Status</th>
                            <th>IP</th>
                            <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                          <tr>
                              <td>1.</td>
                              <td>Single</td>
                              <td>User1</td>
                              <td>Kuber Night</td>
                              <td>1000</td>
                              <td>2020-Mar-14 18:40:17 pm</td>
                              <td>0</td>
                              <td className="text-denger">1000</td>
                              <td>Settled</td>
                              <td>47.247.129.43</td>
                              <td>97</td>
                          </tr>
                      </tbody>
                    </Table>
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

export default Chiphistory;
