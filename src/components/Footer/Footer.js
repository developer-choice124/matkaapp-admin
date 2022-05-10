import React from "react";
import { Container, Row } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

import { getUser } from './../../views/services/users';

class Footer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ParentDetail:null
    }
  }

  Parent = async () => {
    if(localStorage.getItem("masterId") !== '0'){
      let ParentData = await getUser({ id: localStorage.getItem("masterId") });
      this.setState({
        ParentDetail: ParentData.data.data,
      });
    }else{
      this.setState({
        ParentDetail: "",
      });
    }
  }

  
  componentDidMount() {
    this.Parent();
  }
  render() {
    const {ParentDetail} = this.state;
    return (
      <footer
        className={"footer" + (this.props.default ? " footer-default" : "")}
      >
        <>
        {ParentDetail ? 
          <a href={"https://wa.me/91" + ParentDetail.number} className="footer-contact-icon" title="Chat with Master" target="_blank" rel="noopener noreferrer">
            <img src={require('../../assets/img/whatsapp.png')} alt="Chat with Master" className="mw-100 p-0" />
          </a> 
        : ''
        }
        </>
        <Container fluid={this.props.fluid ? true : false}>
          <Row>
            <div className="credits ml-auto">
              <div className="copyright">
                &copy; {1900 + new Date().getYear()}
              </div>
            </div>
          </Row>
        </Container>
      </footer>
    );
  }
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
