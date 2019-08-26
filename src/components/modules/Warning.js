import React, { Component } from 'react';

export class Error extends Component {

  render() {
    return(
      <div className="warning-container">
        <div className="warning-icon" style={{ backgroundImage: 'url("./images/icons/warning.png")' }}></div>
        <p style={{ marginTop: '-15px' }}>{ this.props.warning }</p>
      </div>
    );
  }
}

export default Error;
