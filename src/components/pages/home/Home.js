import React, { Component } from 'react';
import Search from '../../modules/Search';
import Loader from '../../modules/Loader';
import * as Checks from '../../scripts/Checks';

export class Home extends Component {

  state = { isConnected: null }

  async componentDidMount() {
    if(await Checks.checkLogin()) { this.setState({ isConnected: true }); }
    else { this.setState({ isConnected: false }); }
  }
  GotoAuth() { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24178&response_type=code&state=1'; }
  GotoTwitch() { window.open('https://twitch.tv/Terrii_Dev', '_blank'); }
  foundUser = (mbmID) => { this.props.foundUser(mbmID); }

  render() {
    if(this.state.isConnected !== null) {
      return(
        <React.Fragment>
          <div className="home-content">
            <h1 className="home-title disable-hl">Guardianstats</h1>
            <div className="searchDesc">Feel free to search below or consider connecting with bungie to get the full experience from Guardianstats!<p>Press Enter to Search.</p></div>
            <Search foundUser={ this.foundUser } />
          </div>
          <div className="btn btn-dark getMarvinBtn" onClick={ (() => this.props.getMarvin()) }>Get Marvin</div>
        </React.Fragment>
      );
    }
    else { return <Loader statusText={ "Loading..." } /> }
  }
}

export default Home;
