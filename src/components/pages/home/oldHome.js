import React, { Component } from 'react';
import Search from '../../modules/Search';
import Loader from '../../modules/Loader';
import * as Checks from '../../scripts/Checks';

export class Home extends Component {

  state = {
    isConnected: null,
  }

  async componentDidMount() {
    if(await Checks.checkLogin()) { this.setState({ isConnected: true }); }
    else { this.setState({ isConnected: false }); }
  }

  GotoAuth() { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24178&response_type=code&state=1'; }
  defaultConnectWindow() {
    return(
      <div className="home-content" style={{ width: '300px' }}>
        <p style={{ fontSize: '15px', paddingTop: '5px' }}>Try connecting with bungie to unlock great features such as the activity tracker, item checklist and more...</p>
        <button type="button" className="btn btn-info" id="ConnectWithBungieBTN" onClick={() => { this.GotoAuth() }} style={{ float: 'none', padding: '10px' }}>Connect with Bungie.net</button>
      </div>
    );
  }

  foundUser = (platform, mbmID) => {
    this.props.foundUser(platform, mbmID);
  }

  render() {

    if(this.state.isConnected !== null) {
      return(
        <React.Fragment>
          <div className="home-container">
            <div className="home-content">
              <h1 className="home-title">Welcome to Guardianstats</h1>
              {
                this.state.isConnected === false ? (
                  <p style={{ fontSize: "14px" }}>Feel free to search below or consider connecting with bungie to get the full experience from Guardianstats!</p>
                ): null
              }
              <Search foundUser={ this.foundUser } />
              {
                this.state.isConnected === false ? (
                  <button type="button" className="btn btn-info" id="ConnectWithBungieBTN" onClick={() => { this.GotoAuth() }} style={{ float: 'none', padding: '10px' }}>Connect with Bungie.net</button>
                ): null
              }
            </div>
            <div className="imgCredit">© Bungie, Inc. All rights reserved. Destiny, the Destiny Logo, Bungie and the Bungie logo are among the trademarks of Bungie, Inc.</div>
          </div>
        </React.Fragment>
      );
    }
    else {
      return <Loader />
    }
  }
}

export default Home;

//<p className="home-text">Try out our features by connecting with bungie to see your own personal stats or by searching for a player below!</p>
