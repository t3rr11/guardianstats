import React, { Component } from 'react';
import Loader from '../modules/Loader';
import Error from '../modules/Error';

import * as checks from './extended/Checks';
import * as extendedItems from './extended/Items';

export class Activities extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Recent Activites...' },
    data: null
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { data } = this.state;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'completed') {
      return (
        <div id="actvities" className="scrollbar">

        </div>
      );
    }
    else {
      if(status === 'startUp') { return(<div>Completed</div>) }
      return <Loader statusText={ statusText } />
    }
  }
}

export function checkActivityUpdates() {

}

export default Activities;
