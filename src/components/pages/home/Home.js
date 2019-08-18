import React, { Component } from 'react';
import Search from '../../modules/Search';
import * as bungie from '../../requests/BungieReq';
import Inspect from '../../pages/inspect/Inspect';

export class Home extends Component {

  inspectPlayer = async (player, platform) => {
    const membershipInfo = await bungie.GetMembershipId(encodeURIComponent(player));
    if(membershipInfo.length > 0) {
      console.log(player);
      console.log(membershipInfo[0].membershipId);
      window.history.pushState("", "", `/inspect/${ platform }/${ membershipInfo[0].membershipId }`);
      window.location.reload();
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
