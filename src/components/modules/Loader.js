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
          <p> { this.props.statusText } </p>
        </div>
      </div>
    );
  }
}

export default Loader;
