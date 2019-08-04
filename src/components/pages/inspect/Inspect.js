import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as bungie from '../../requests/BungieReq';

export class Inspect extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading text here...' },
    data: null
  }

  async componentDidMount() {
    const { membershipInfo } = this.props;
    this.setState({ status: { status: 'lookingForAccount', statusText: 'Looking for account...' } });
    if(!membershipInfo) { this.setState({ status: { status: 'error', statusText: 'Nobody to inspect... Try going back home and using searching for someone.' } }); }
    else {
      var membershipType = membershipInfo.split('/')[0];
      var membershipId = membershipInfo.split('/')[1];
      if(membershipType && membershipId) {
        if(!isNaN(membershipType) && (membershipType === '1' || membershipType === '2' || membershipType === '3' || membershipType === '4' || membershipType === '5' || membershipType === '10' || membershipType === '254')) {
          if(!isNaN(membershipId) && membershipId.length >= 19) {
            this.setState({ status: { status: 'grabbingAccountInfo', statusText: 'Inspecting their account...' } });
            const profileData = await bungie.GetProfile(membershipType, membershipId, '200,202,600,800');
            this.setState({ status: { status: 'ready', statusText: 'Finished the inspection!' }, data: profileData });
          }
          else { this.setState({ status: { status: 'error', statusText: 'The membershipId entered was not a valid length.' } }); }
        }
        else { this.setState({ status: { status: 'error', statusText: 'Not a valid membershipType. Must be either: 1,2,3,4,5,10,254' } }); }
      }
      else { this.setState({ status: { status: 'error', statusText: 'Something is wrong with the URL. Must contain: /{MembershipType}/{MembershipId}' } }); }
    }
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { membershipId } = this.props;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      const profileInfo = this.state.data;
      return (
        <div id="data_div" className="scrollbar">
          <div>{ JSON.stringify(profileInfo) }</div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Inspect;
