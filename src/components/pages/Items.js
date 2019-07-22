import React, { Component } from 'react';
import * as bungie from '../requests/BungieReq';
import * as db from '../requests/db/Database';
import Loader from '../modules/Loader';
import Error from '../modules/Error';

export class Items extends Component {

  state = {
    status: { error: null, status: 'startup', statusText: 'Loading Items...' },
    data: [],
    manifest: null
  }

  componentDidMount() {
    this.checkPlatform();
  }

  async checkPlatform() {
    if(localStorage.getItem('SelectedAccount') !== 'Please Select Platform') { await this.setManifest(); this.getItems(); }
    else { this.setState({ status: { error: 'NotSelectedPlatform', status: 'error', statusText: 'You have not selected your platform yet.' } }) }
  }

  async setManifest() { this.setState({ manifest: await db.getManifest() }) }

  async getItems() {
    const ExoticNode = 1068557105;
    console.log('Got items!');
    console.log(this.state.manifest);
  }

  grabData = async() => {
    const { displayName, membershipId, membershipType } = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
    bungie.GetProfile(membershipType, membershipId, '200,202,600,800').then(
      (result) => { this.setState({ data: result, status: { error: null, status: 'completed', statusText: 'Finshed Loading Items' } }) },
      (error) => { this.setState({ status: { error: error, status: 'error', statusText: 'Error getting profile data from bungie.' } }) }
    );
  }

  render() {
    //Define Consts and Variables
    const { status, statusText, error } = this.state.status;
    const { data } = this.state;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status !== 'completed') {
      return <Loader statusText={ statusText } />
    }
    else {
      try {
        let objects = Object.keys(data);
        return (
          <div>
            <p>Finished loading...</p>
            { objects.map(item => ( <li key={item}> { item } </li> )) }
            <div style={{ wordBreak: 'break-word' }}>{ JSON.stringify(data) }</div>
          </div>
        );
      }
      catch (err) { return <Error error={ err } /> }
    }
  }
}

export default Items;
