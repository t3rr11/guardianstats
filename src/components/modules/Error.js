import React, { Component } from 'react';

export class Error extends Component {

  render() {
    return(
      <div className="error-container">
        <div className="error-icon" style={{ backgroundImage: 'url("./images/icons/error.png")' }}></div>
        <h5>{ this.props.error }</h5>
      </div>
    );
  }
}

export default Error;
