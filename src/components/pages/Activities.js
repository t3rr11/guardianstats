import React, { Component } from 'react';
import * as bungie from '../requests/BungieReq';

export class Activities extends Component {

  state = {
    error: null,
    isLoaded: false,
    profile: []
  }

  componentDidMount() {
    this.grabData();
  }

  grabData = async() => {
    bungie.GetProfile('4', '4611686018471334813', '200,202,600,800').then(
      (result) => { this.setState({ isLoaded: true, profile: result }) },
      (error) => { this.setState({ isLoaded: true, error }); }
    );
  }

  render() {
    const { error, isLoaded, profile } = this.state;
    if (error) { return <div>Error: {error.message}</div>; }
    else if (!isLoaded) { return <div>Loading...</div>; }
    else {
      let objects = Object.keys(profile);
      return (
        <div>
          <p>Finished loading...</p>
          { objects.map(item => ( <li key={item}> { item } </li> )) }
          <div style={{ wordBreak: 'break-word' }}>{ JSON.stringify(profile) }</div>
        </div>
      );
    }
  }
}

export async function CheckActivityUpdates() {

}

export default Activities;
