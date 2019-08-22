import React, { Component } from 'react';
import Search from '../../modules/Search';
import * as bungie from '../../requests/BungieReq';
import Inspect from '../../pages/inspect/Inspect';

export class Home extends Component {

  inspectPlayer = async (userId, player, platform) => {
    const membershipInfo = await bungie.GetMembershipsById(userId, platform);
    if(membershipInfo.destinyMemberships.length > 0) {
      for(var i in membershipInfo.destinyMemberships) {
        if(membershipInfo.destinyMemberships[i].membershipType == platform) {
          window.history.pushState("", "", `/inspect/${ platform }/${ membershipInfo.destinyMemberships[i].membershipId }`);
          window.location.reload();
        }
      }
    }
    else {
      console.log('User private or not found.');
    }
  }

  render() {
    return(
      <React.Fragment>
        <div className="home-container">
          <div className="home-content">
            <h1 className="home-title">Welcome to Guardianstats</h1>
            <p className="home-text">Try out our features by connecting with bungie to see your own personal stats or by searching for a player below!</p>
            <Search inspectPlayer={ this.inspectPlayer } />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
