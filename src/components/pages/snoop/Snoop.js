import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

import { startUpPageChecks } from '../../scripts/Checks';

export class Snoop extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading text here...' },
  }

  async componentDidMount() {
    const { membershipId } = this.props;
    this.setState({ status: { status: 'lookingForAccount', statusText: 'Looking for account...' } });
    if(!membershipId) { this.setState({ status: { status: 'error', statusText: 'Nobody to snoop on... Try going back home and using searching for someone.' } }); }
    else if(membershipId.length < 19) { this.setState({ status: { status: 'error', statusText: 'The membershipId entered was not a valid length.' } }); }
    else if(isNaN(membershipId)) { this.setState({ status: { status: 'error', statusText: 'The membershipId entered was not valid as a membershipId can only contain numbers.' } }); }
    else {
      this.setState({ status: { status: 'grabbingAccountInfo', statusText: 'Snooping their account...' } });
    }
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { membershipId } = this.props;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      return (
        <div id="data_div" className="scrollbar">
          <div>Completed: { membershipId } </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Snoop;
