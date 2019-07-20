import React, { Component } from 'react';
import * as bungie from '../requests/BungieReq';
import Loader from '../modules/Loader';
import Error from '../modules/Error';

export class Activities extends Component {

  state = {
    Profile: [{ Data: [], Completed: false, Error: null }]
  }

  componentDidMount() {
    this.grabData();
  }

  grabData = async() => {
    bungie.GetProfile('4', '4611686018471334813', '200,202,600,800').then(
      (result) => { this.setState({ Profile: { Completed: true, Data: result } }) },
      (error) => { this.setState({ Profile: { Completed: true, Error: error } }) }
    );
  }

  render() {
    //Define Consts and Variables
    const { Data, Completed, Error } = this.state.Profile;

    //Check for errors, show loader, or display content.
    if(!Completed) { return <Loader /> }
    else if(Error) { return <Error error={Error} /> }
    else {
      let objects = Object.keys(Data);
      return (
        <div>
          <p>Finished loading...</p>
          { objects.map(item => ( <li key={item}> { item } </li> )) }
          <div style={{ wordBreak: 'break-word' }}>{ JSON.stringify(Data) }</div>
        </div>
      );
    }
  }
}

export async function CheckActivityUpdates() {

}

export default Activities;
