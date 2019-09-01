import React, { Component } from 'react';
import Error from '../../modules/Error';

export class Failed extends Component {

  render() {
    return(
      <React.Fragment>
        <Error error="Failed to authenticate. Retry connecting with bungie again with the 'Connect to bungie' button." />
      </React.Fragment>
    );
  }
}

export default Failed;
