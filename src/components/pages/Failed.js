import React, { Component } from 'react';

export class Failed extends Component {

  render() {
    return(
      <React.Fragment>
        <p>Failed to authenticate. Retry connecting with bungie again with the 'Connect to bungie' button.</p>
      </React.Fragment>
    );
  }
}

export default Failed;
