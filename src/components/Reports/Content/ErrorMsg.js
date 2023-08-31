import React from 'react';
import { Alert } from '@mui/material';

class ErrorMsg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        if(this.props.formikProps.errors?.[this.props.tag] !== undefined) {
            return (
                <Alert variant="fieldErr" severity="error">{this.props.formikProps.errors?.[this.props.tag]}</Alert>
            )
        }
    }
}

export default ErrorMsg;