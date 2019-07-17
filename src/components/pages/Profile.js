import React, { Component } from 'react';

export class GetProfile extends Component {
  render() {
    const { error, isLoaded, profile } = this.props;
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
export default GetProfile;
