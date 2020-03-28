import React, { Component } from 'react';
import Search from '../../modules/Search';
import Loader from '../../modules/Loader';
import * as Checks from '../../scripts/Checks';

export class Home extends Component {

  state = { isConnected: null }

  async componentDidMount() {
    document.title = "Home - Guardianstats";
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
            <h4 className="homeh4Titles">Welcome to Guardianstats</h4>
            <div className="briefDesc">Our focus is on providing Guardians with the best Destiny 2 Stats available. Most of our stats are obtained thanks to the awesome guys behind the Bungie API. We are also the home of Marvin the Destiny 2 discord clan bot with his main focus is based around helping grow the clan communities for this game. Definitely head on over and check out his features by clicking the Get Marvin button. </div>            
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
