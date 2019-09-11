import React, { Component } from 'react';
import Search from '../../modules/Search';
import Loader from '../../modules/Loader';
import Changelog from '../../../changelog.json';
import Donators from '../../../donators.json';
import * as Checks from '../../scripts/Checks';
import * as bungie from '../../requests/BungieReq';
import * as Misc from '../../Misc';

export class Home extends Component {

  state = {
    isConnected: null,
    changelogVisible: false,
    TWABs: null,
  }

  async componentDidMount() {
    if(await Checks.checkLogin()) {
      const TWABs = (await bungie.GetTWABs()).categories[0].entries.results;
      this.setState({ isConnected: true, TWABs });
    }
    else {
      const TWABs = (await bungie.GetTWABs()).categories[0].entries.results;
      this.setState({ isConnected: false, TWABs });
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

  foundUser = (platform, mbmID) => {
    this.props.foundUser(platform, mbmID);
  }

  render() {

    const getMathColor = (input) => {
      if(input === "=") { return "yellow" }
      else if(input === "+") { return "lime" }
      else if(input === "-") { return "tomato" }
    }

    const homeContent = () => {
      return(
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
      );
    }
    const devContent = () => {
      return (
        <div className="dev-content">
          <div className="supporters-content">
            <h4>Supporters</h4>
            { Donators.map(function(donator) { if(donator.name !== "Terrii") { return ( <div className="donar">{ donator.name }</div> ); } }) }
            <p>You guys are actually the best. You help keep the website ad free and keep the lights on. I love all of you!</p>
            <div className="donate-links">
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" class="donateBtn">
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input type="hidden" name="hosted_button_id" value="PJXJYXDR2DGJE" />
                <input type="image" class="paypalBtn" src="/images/donate.png" border="0" name="submit" width="90px" alt="PayPal – The safer, easier way to pay online!" />
              </form>
              <a href="https://www.patreon.com/Terrii" target="_blank"><img className="patreonBtn" src="/images/patreon.png" /></a>
            </div>
          </div>
        </div>
      );
    }
    const bungieContent = () => {
      return (
        <div className="bungie-content">
          <h4>Recent Bungie News</h4>
          <div className="bungie-articles">
            {
              this.state.TWABs.slice(0, 10).map(function(article) {
                return (
                  <div className="bungie-article">
                    <div className="article-image"><a href={`https://bungie.net${article.link}`} target="_blank"><img src={`https://bungie.net${ article.image }`} /></a></div>
                    <div className="article-name-date">
                      <a href={`https://bungie.net${article.link}`} target="_blank">
                        <div className="article-name">{ article.displayName.includes("This Week At Bungie") ? "This Week At Bungie" : article.displayName }</div>
                        <div className="article-date">{ Misc.convertTimeToDate(article.creationDate) }</div>
                      </a>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      );
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
          <div className="home-container homeScrollbar">
            { devContent() }
            { homeContent() }
            { bungieContent() }
            { this.state.changelogVisible ? changelogContent() : null }
            <div className="btn btn-dark changelogBtn" onClick={() => { this.toggleChangeLog() }}>View Changelog</div>
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
