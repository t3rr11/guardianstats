import React, { Component } from 'react';

export class Loader extends Component {

  render() {
    return(
      <div className="loaderContainer">
        <div className='loader'>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="loaderText">
          <h5> { this.props.statusText } </h5>
        </div>
      </div>
    );
  }
}

export default Loader;
