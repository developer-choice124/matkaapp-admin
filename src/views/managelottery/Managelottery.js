
import React from "react";
import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import Lottery from "./components/Lottery.js";



class Managelottery extends React.Component {
 
  render() {
    return (
      <>
      <div className="content">
        <Card>
          <CardHeader>
            <h3>Today Lottery List</h3>
          </CardHeader>
          <CardBody>
            <Row>
              <Col sm={12}>
                <Lottery />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </>
    );
  }
}
export {Managelottery};