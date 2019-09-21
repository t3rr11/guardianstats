import React, { Component } from 'react';
import Search from '../../modules/Search';
import Loader from '../../modules/Loader';
import Changelog from '../../../changelog.json';
import * as Checks from '../../scripts/Checks';
import * as bungie from '../../requests/BungieReq';
import * as Misc from '../../Misc';

export class Home extends Component {

  state = {
    isConnected: null,
    changelogVisible: false,
    supportersVisible: true,
    background: null,
    donators: null
  }

  async componentDidMount() {
    this.setBackground();
    await this.getDonators();
    if(await Checks.checkLogin()) { this.setState({ isConnected: true }); }
    else { this.setState({ isConnected: false }); }
  }

  setBackground() {
    const Settings = JSON.parse(localStorage.getItem("Settings"));
    this.setState({ background: Settings.background });
  }

  async getDonators() {
    if(process.env.NODE_ENV === 'development') {
      const donators = await fetch(`https://cors-anywhere.herokuapp.com/https://guardianstats.com/donators.json`).then(a => a.json());
      this.setState({ donators });
    }
    else {
      const donators = await fetch(`https://guardianstats.com/donators.json`).then(a => a.json());
      this.setState({ donators });
    }
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
  toggleChangeLog() {
    if(this.state.changelogVisible) { this.setState({ changelogVisible: false }); }
    else { this.setState({ changelogVisible: true }); }
  }
  foundUser = (platform, mbmID) => { this.props.foundUser(platform, mbmID); }

  render() {

    const getMathColor = (input) => {
      if(input === "=") { return "yellow" }
      else if(input === "+") { return "lime" }
      else if(input === "-") { return "tomato" }
    }
    const homeContent = () => {
      return(
        <div className="home-content">
          <h1 className="home-title">Welcome Guardian</h1>
          {
            this.state.isConnected === false ? (
              <p style={{ fontSize: "14px", margin: "auto", maxWidth: "500px" }}>Feel free to search below or consider connecting with bungie to get the full experience from Guardianstats! Press Enter to Search.</p>
            ): null
          }
          <Search foundUser={ this.foundUser } />
        </div>
      );
    }
    const supportersContent = () => {
      const Donators = this.state.donators;
      if(Donators !== null) {
        return (
          <div className="supporters-content">
            <div className="donators"><h5>Supporters / Donators</h5></div>
            {
              Donators.map(function(donator) {
                if(donator.name !== "Terrii") {
                  if(donator.type === "Patreon") { return ( <div className="donar patreon">{ donator.name }</div> ); }
                  else { return ( <div className="donar paypal">{ donator.name }</div> ); }
                }
              })
            }
            <p>Thank you guys so much!</p>
            <div className="donate-links">
              <div className="paypalDiv">
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" className="donateBtn">
                  <input type="hidden" name="cmd" value="_s-xclick" />
                  <input type="hidden" name="hosted_button_id" value="PJXJYXDR2DGJE" />
                  <input type="image" className="paypalBtn" src="/images/donate.png" border="0" name="submit" width="90px" alt="PayPal – The safer, easier way to pay online!" />
                </form>
              </div>
              <a href="https://www.patreon.com/Terrii" target="_blank"><img className="patreonBtn" src="/images/patreon.png" /></a>
            </div>
          </div>
        );
      }
    }
    const changelogContent = () => {
      return (
        <div className="changelog-content" id="changelog">
          <h4>Changelog</h4>
          {
            Object.keys(Changelog).map(function(log) {
              return (
                Object.keys(Changelog[log]).map(function(version) {
                  return (
                    <div className="version"> { Object.keys(Changelog[log]) }
                     {
                       Object.keys(Changelog[log][version]).map(function(entry) {
                         return (
                           <div className="entry">
                             <span style={{ color: getMathColor(Changelog[log][version][entry].slice(0, 1)) }}>{ `${ Changelog[log][version][entry].slice(0, 1) }`}</span>
                             <span>{ `${ Changelog[log][version][entry].slice(1) }`}</span>
                           </div>
                         );
                       })
                     }
                    </div>
                  );
                })
              );
            })
          }
        </div>
      );
    }

    if(this.state.isConnected !== null) {
      return(
        <React.Fragment>
          <div className="home-container" style={{ backgroundImage: `url("/images/backgrounds/${ this.state.background }.jpg")` }}>
            { homeContent() }
            { this.state.supportersVisible ? supportersContent() : null }
            { this.state.changelogVisible ? changelogContent() : null }
            <div className="btn btn-dark changelogBtn" onClick={() => { this.toggleChangeLog() }}>View Changelog</div>
            <div className="imgCredit">© Bungie, Inc. All rights reserved. Destiny, the Destiny Logo, Bungie and the Bungie logo are among the trademarks of Bungie, Inc.</div>
          </div>
        </React.Fragment>
      );
    }
    else {
      return <Loader statusText={ "Loading..." } />
    }
  }
}

export default Home;

//<p className="home-text">Try out our features by connecting with bungie to see your own personal stats or by searching for a player below!</p>
