import React, { Component } from 'react';
import Search from '../../modules/Search';
import * as bungie from '../../requests/BungieReq';
import Inspect from '../../pages/inspect/Inspect';

export class Home extends Component {

  render() {
    return(
      <React.Fragment>
        <div className="home-container">
          <div className="home-content">
            <h1 className="home-title">Welcome to Guardianstats</h1>
            <p className="home-text">Try out our features by connecting with bungie to see your own personal stats or by searching for a player below!</p>
            <Search />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
