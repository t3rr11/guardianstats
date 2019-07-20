import React, { Component } from 'react';

export class Error extends Component {

  render() {
    return(
      <div className='error-container'>{ this.props.error }</div>
    );
  }
}

export default Error;
