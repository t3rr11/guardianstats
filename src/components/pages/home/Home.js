import React, { Component } from 'react';
import Search from '../../modules/Search';
import Loader from '../../modules/Loader';
import Changelog from '../../../changelog.json';
import * as Checks from '../../scripts/Checks';
import uuid from  'uuid';

export class Home extends Component {

  state = {
    isConnected: null,
    changelogVisible: false,
    supportersVisible: true,
    background: null,
    bgPos: null,
    donators: null
  }

  async componentDidMount() {
    this.setBackground();
    await this.getDonators();
    if(await Checks.checkLogin()) { this.setState({ isConnected: true }); }
    else { this.setState({ isConnected: false }); }
  }
  async getDonators() {
    if(process.env.NODE_ENV === 'development') {
      const donators = await fetch(`./donators.json`).then(a => a.json());
      this.setState({ donators });
    }
    else {
      const donators = await fetch(`https://guardianstats.com/donators.json`).then(a => a.json());
      this.setState({ donators });
    }
  }
  setBackground() {
    const Settings = JSON.parse(localStorage.getItem("Settings"));
    if(Settings !== null) {
      if(Settings.background === "vex") { this.setState({ background: Settings.background, bgPos: "center" }); }
      else { this.setState({ background: Settings.background, bgPos: "top center" }); }

    }
    else { this.setState({ background: "vex" }); }
  }
  GotoAuth() { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24178&response_type=code&state=1'; }
  GotoTwitter() { window.open('https://twitter.com/Guardianstats', '_blank'); }
  GotoTwitch() { window.open('https://twitch.tv/Terrii_Dev', '_blank'); }
  toggleChangeLog() {
    if(this.state.changelogVisible) { this.setState({ changelogVisible: false }); }
    else { this.setState({ changelogVisible: true }); }
  }
  foundUser = (platform, mbmID) => { this.props.foundUser(platform, mbmID); }

  render() {
    document.body.style.backgroundImage = "var(--DarkNavyBlue)";

    const { isLive } = this.props;
    const getMathColor = (input) => {
      if(input === "=") { return "yellow" }
      else if(input === "+") { return "lime" }
      else if(input === "-") { return "tomato" }
    }
    const homeContent = () => {
      return (
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
                  return (
                    <div key={ uuid.v4() } className="donar">
                      <div className="donarName">{ donator.name }</div>
                      <div className="donationTypes">
                        {
                          donator.type.map(function(type) {
                            return (
                              <div key={ uuid.v4() } className={ type }>
                                <div className={`donatorBox ${ type }`}>
                                  <div className={ type } style={{ height: "50px", width: "50px", marginTop: "5px" }}></div>
                                  <div className="donationTypeTitle">
                                    {
                                      type === "twitch" ? "This person has earned the twitch badge for supporting my work though a twitch subscription" : (
                                      type === "paypal" ? "This person has earned the paypal badge for supporting my work though a $5 or more paypal donation" : (
                                      type === "patreon" ? "This person has earned the twitch badge for supporting my work though a $5 or more patreon subscription" : null ))
                                    }
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  );
                }
                else { return null }
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
              <a href="https://www.patreon.com/Terrii" target="_blank" rel="noopener noreferrer"><img className="patreonBtn" src="/images/patreon.png" alt="patreonBtn" /></a>
            </div>
          </div>
        );
      }
    }
    const changelogContent = () => {
      return (
        <div className="changelog-content scrollbar" id="changelog">
          <h4>Changelog</h4>
          <div className="changelogs">
            {
              Object.keys(Changelog).map(function(log) {
                return (
                  Object.keys(Changelog[log]).map(function(version) {
                    if(log === "0"){
                      return (
                        <div className="version">Current Version: { Object.keys(Changelog[log]) }
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
                    }
                    else {
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
                    }
                  })
                );
              })
            }
          </div>
        </div>
      );
    }

    if(this.state.isConnected !== null) {
      return(
        <React.Fragment>
          <div className="home-container" style={{ backgroundImage: `url("/images/backgrounds/${ this.state.background }.jpg")`, backgroundPosition: this.state.bgPos }}>
            { homeContent() }
            { this.state.supportersVisible ? supportersContent() : null }
            { this.state.changelogVisible ? changelogContent() : null }
            { isLive === true ? (
              <div className="btn btn-dark isLive" onClick={() => { this.GotoTwitch() }}>I'm live <div className="clickMeLiveBtn">Come check me out, Click the button</div></div>
            ) : null }
            <div className="btn btn-dark changelogBtn" onClick={() => { this.toggleChangeLog() }}>View Changelog</div>
            <div className="btn btn-dark reportBugs" onClick={() => { this.GotoTwitter() }}>Report Bugs</div>
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
