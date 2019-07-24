import React, { Component } from 'react';
import Loader from '../modules/Loader';
import Error from '../modules/Error';

import { startUpPageChecks } from './extended/Checks';

export class Activities extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Recent Activites...' },
    data: null
  }

  async componentDidMount() {
    this.startUpChecks();
  }

  async startUpChecks() {
    const checks = await startUpPageChecks();
    if(checks === "Checks OK") {
      this.setState({ status: { status: 'checksOK', statusText: 'Checks Completed' } });
      this.grabActivityData();
    }
    else { this.setState({ status: { status: 'error', statusText: checks } }); }
  }

  async grabActivityData() {
    
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
          <div>Completed</div>
        </div>
      );
    }
    else {
      if(status === 'startUp') { return <Loader statusText={ statusText } /> }
      if(status === 'checksOK') { return <Loader statusText={ statusText } /> }
    }
  }
}

export function checkActivityUpdates() {

}

export default Activities;
