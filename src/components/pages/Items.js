import React, { Component } from 'react';
import * as bungie from '../requests/BungieReq';
import Loader from '../modules/Loader';
import Error from '../modules/Error';

export class Items extends Component {

  state = {
    Profile: [{ Data: [], Completed: false, isError: null }]
  }

  componentDidMount() {
    this.grabData();
  }

  grabData = async() => {
    const { displayName, membershipId, membershipType } = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
    bungie.GetProfile(membershipType, membershipId, '200,202,600,800').then(
      (result) => { this.setState({ Profile: { Completed: true, Data: result } }) },
      (error) => { this.setState({ Profile: { Completed: true, isError: error } }) }
    );
  }

  render() {
    //Define Consts and Variables
    const { Data, Completed, isError } = this.state.Profile;

    //Check for errors, show loader, or display content.
    if(!Completed) { return <Loader /> }
    else if(isError) { return <Error error={isError} /> }
    else {
      try {
        let objects = Object.keys(Data);
        return (
          <div>
            <p>Finished loading...</p>
            { objects.map(item => ( <li key={item}> { item } </li> )) }
            <div style={{ wordBreak: 'break-word' }}>{ JSON.stringify(Data) }</div>
          </div>
        );
      }
      catch (err) {
        return (
          <div> { Data } </div>
        );
      }
    }
  }
}

export default Items;
