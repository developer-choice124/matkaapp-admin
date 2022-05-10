import React from 'react';

import {
    Spinner 
} from 'reactstrap';

import PropTypes from "prop-types";

export default class ShareSpinner extends React.PureComponent {
    render(){
        return <Spinner
            style={{width: this.props.width, height: this.props.height}}
            color={this.props.color}
            variant={this.props.variant}
        />
    }
}

ShareSpinner.defaultProps = {
    color: 'primary',
    variant: "grow",
    height: '3rem',
    width: '3rem'
}

ShareSpinner.propTypes = {
    style: PropTypes.object,
    color: PropTypes.string,
    variant: PropTypes.string
}