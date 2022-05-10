
import React from "react";

// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";

const operatorId = 29;
class Casino extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded:false,
        };
    };
 
  render() {
    var tokenString = localStorage.getItem("token");
    var token = tokenString.split(" ");
    if(token.length === 0){
      token[1]= "";
    }
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardBody className="overflow-hidden">
                    <Row className="mx-0">
                        <iframe src={"https://faas.sports999.in/#/fs?token="+token[1]+"&operatorId="+operatorId+"&language=en"} width="1216" className="border-0" title="casino"></iframe>
                    </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Casino;
