import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

import { startUpPageChecks } from '../../scripts/Checks';

export class Profile extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading text here...' },
  }

  async componentDidMount() {
    this.startUpChecks();
  }

  async startUpChecks() {
    const checks = await startUpPageChecks();
    if(checks === "Checks OK") {
      this.setState({ status: { status: 'checksOK', statusText: 'Checks Completed' } });
      //Checks completed, Next function here:
      this.grabExampleData();
    }
    else { this.setState({ status: { status: 'error', statusText: checks } }); }
  }
  async grabExampleData() {
    this.finishedGettingExampleData();
  }
  async finishedGettingExampleData() { this.setState({ status: { status: 'ready', statusText: 'Ready to rock and roll!' } }); }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    //const { membershipId } = this.props;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      return (
        <div id="data_div" className="scrollbar">
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

export default Profile;
