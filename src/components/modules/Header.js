import React from 'react';
import { Link } from 'react-router-dom';
import * as Misc from '../Misc';

function GotoAuth() { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24178&response_type=code&state=1'; }

export class Header extends React.Component {

  state = {
    loggedIn: false,
    showCopied: false,
    platforms: null
  }

  async componentDidMount() {
    this.getPlatforms();
  }

  getPlatforms() {
    if(localStorage.getItem("DestinyMemberships")) {
      var BungieMemberships = JSON.parse(localStorage.getItem("DestinyMemberships"));
      var platforms = [];
      for(var i in BungieMemberships) {
        platforms.push({
          "platform": Misc.getPlatformName(BungieMemberships[i].membershipType),
          "name": BungieMemberships[i].displayName,
          "id": BungieMemberships[i].membershipId
        });
      }
      this.setState({ loggedIn: true, platforms });
    }
  }
  setPlatform(event) {
    var selectedMbmId = event.target.id;
    localStorage.setItem("SelectedAccount", JSON.stringify(this.state.platforms.find(e => e.id === selectedMbmId)));
    this.setState(this.state);
  }

  toggleMenuSlider() { console.log("Toggled Menu"); }
  toggleSettingsModal() {
    console.log("Toggled");
    this.props.toggleSettingsModal();
  }
  showMembershipId() {
    this.setState({ showCopied: true, });
    setTimeout(() => { this.setState({ showCopied: false, }); }, 10000);
  }

  render() {
    const { loggedIn, platforms } = this.state;

    //Pre-Render
    const menuItems = (
      loggedIn ? (
        <React.Fragment>
          <Link to="/home" style={{ textDecoration: "none" }}><img className="logo" alt='Logo' src='./images/logo.png' /></Link>
          <li className="menu-item" id="Home"><Link to="/home" onClick={ (() => this.toggleMenuSlider()) }>Home</Link></li>
          <li className="menu-item" id="Profile"><Link to="/profile" onClick={ (() => this.toggleMenuSlider()) }>Profile</Link></li>
          <li className="menu-item" id="Activities"><Link to="/activities" onClick={ (() => this.toggleMenuSlider()) }>Activities</Link></li>
          <li className="menu-item" id="Marvin"><Link to="/marvin" onClick={ (() => this.toggleMenuSlider()) }>Marvin</Link></li>
          <li className="menu-item" id="Clans"><Link to="/clans" onClick={ (() => this.toggleMenuSlider()) }>Clans{ new Date().getTime() < (1583318165570 + 604800000) ? (<span>New</span>) : null }</Link></li>
        </React.Fragment>
      )
      : (
        <React.Fragment>
          <Link to="/home" style={{ textDecoration: "none" }}><img className="logo" alt='Logo' src='./images/logo.png' /></Link>
          <li className="menu-item" id="Home"><Link to="/home" onClick={ (() => this.toggleMenuSlider()) }>Home</Link></li>
          <li className="menu-item-disabled" id="Profile" title="Login to see this content"><span>Profile</span></li>
          <li className="menu-item-disabled" id="Activities" title="Login to see this content"><span>Activities</span></li>
          <li className="menu-item" id="Marvin"><Link to="/marvin" onClick={ (() => this.toggleMenuSlider()) }>Marvin</Link></li>
          <li className="menu-item" id="Clans"><Link to="/clans" onClick={ (() => this.toggleMenuSlider()) }>Clans<span>New</span></Link></li>
        </React.Fragment>
      )
    );

    //Actual Render
    return (
      <header className="header" id="header">
        <div className="menu-container" id="menu">
          <div className="menu-bar disable-hl"> { menuItems } </div>
          <div className="menu-bar">
            {
              loggedIn ? (
                <div className="usernameBtn">
                  {
                    localStorage.getItem("SelectedAccount") === "Please Select Platform" ? ( <div>{ localStorage.getItem("SelectedAccount") }</div> ) :
                    (
                      <div className="platformSelection">
                        <div className="platformName">
                          <img alt="platformLogo" src={`./images/icons/platforms/${ (JSON.parse(localStorage.getItem("SelectedAccount")).platform).toLowerCase() }.png`} />
                          <div onClick={ () => this.showMembershipId() }>{ JSON.parse(localStorage.getItem("SelectedAccount")).name }</div>
                        </div>
                        <div className={ this.state.showCopied ? 'platformMbmId show' : 'platformMbmId' }>{ JSON.parse(localStorage.getItem("SelectedAccount")).id }</div>
                      </div>
                    )
                  }
                  {
                    localStorage.getItem("SelectedAccount") === "Please Select Platform" ? (
                      platforms.map(function(platform) {
                        return (
                          <div className="platformSelection">
                            <img alt="platformLogo" src={`./images/icons/platforms/${ (platform.platform).toLowerCase() }.png`} />
                            <div onClick={ ((e) => this.setPlatform(e)) } id={ platform.id }>{ platform.name }</div>
                          </div>
                        )
                      }, this)
                    ) : null
                  }
                </div>
              ) :
              (
                <div className="connectBtn" onClick={ (() => GotoAuth()) }>Connect with bungie</div>
              )
            }
          </div>
          { ( loggedIn ? ( <div className="menu-bar disable-hl"><div className="settingsBtn" onClick={ (() => this.toggleSettingsModal()) }></div></div> ) : ( null ) ) }
        </div>
      </header>
    );
  }
}

export default Header;
