import React, { Component } from 'react';
import Axios from 'axios';

export class GetProfile extends Component {
  //The data is stored inside the profile array inside the state of this component
  state = { error: null, isLoaded: false, profile: [] }

  //As far as i know this is where you call the axios/fetch methods to grab data
  componentDidMount() {
    Axios({
      method: 'GET',
      url: 'https://www.bungie.net/Platform/Destiny2/4/Profile/4611686018471334813/?components=100,200,800,900',
      headers: { 'X-API-KEY': 'fc1f06b666154eeaa8f89d91f32c23e7', 'Content-Type': 'application/json' }
    })
    .then(
      (result) => { this.setState({ isLoaded: true, profile: result.data.Response }) },
      (error) => { this.setState({ isLoaded: true, error: error }); }
    );
  }

  //The render will check for erros and will check the isLoaded value and if all are ok will then proceed to render the page
  render() {
    const { error, isLoaded, profile } = this.state;
    if (error) { return <div>Error: {error.message}</div>; }
    else if (!isLoaded) { return <div>Loading...</div>; }
    else {
      console.log(profile);
      return (
        <div>
          <p>Finished loading...</p>
          { profile.profile.data.characterIds.map(id => ( <li key={id}> { id } </li> )) }
        </div>
      );
    }
  }
}
export default GetProfile;
