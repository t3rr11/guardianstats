import React from 'react';
import { Link } from 'react-router-dom';
import * as Misc from '../Misc';
import Settings from './Settings';

function GotoAuth() { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24178&response_type=code&state=1'; }

export class Header extends React.Component {

  state = {
    showSettingsWheel: false,
    showSettingsModal: false,
    loggedIn: false,
    platforms: null
  }

  toggleSettingsWheel = () => { this.setState({ showSettingsWheel: !this.state.showSettingsWheel }); }
  toggleSettingsModal = () => { this.setState({ showSettingsWheel: !this.state.showSettingsWheel, showSettingsModal: !this.state.showSettingsModal }); }
  hideSettingsModal = () => { this.setState({ showSettingsModal: false }); }
  toggleMenuSlider = (ignore) => { if(window.screen.width < 800 && !ignore) { document.getElementById("menu").classList.toggle("show"); document.getElementById("title-bar").classList.toggle("show"); } }
  alertID = () => {
    if(!localStorage.getItem("SelectedAccount")) { alert("Please choose platform first."); }
    else { alert(JSON.parse(localStorage.getItem("SelectedAccount")).id); }
  }

  async componentDidMount() {
    this.getPlatforms();
  }

  getPlatforms() {
    const { BungieMemberships } = this.props;
    if(BungieMemberships !== null && BungieMemberships !== undefined) {
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
  setPlatform() {
    var selectBox = document.getElementById("PlatformSelection");
    var platform = selectBox.options[selectBox.selectedIndex].value;
    var platforms = this.state.platforms;
    for(var i in platforms) {
      if(platforms[i].platform === platform) {
        localStorage.setItem("SelectedAccount", JSON.stringify(platforms[i]));
      }
    }
    this.setState(this.state);
    this.props.platformChange();
  }

  render() {
    const { loggedIn, platforms } = this.state;
    const menuItems = (
      loggedIn ? (
        <React.Fragment>
          <li className="menu-item Home" id="Home"><Link to="/home" onClick={ (() => this.toggleMenuSlider()) }>Home</Link></li>
          <li className="menu-item" id="Profile"><Link to="/profile" onClick={ (() => this.toggleMenuSlider()) }>Profile</Link></li>
          <li className="menu-item" id="Activities"><Link to="/activities" onClick={ (() => this.toggleMenuSlider()) }>Activities</Link></li>
          <li className="menu-item" id="Exotics"><Link to="/exotics" onClick={ (() => this.toggleMenuSlider()) }>Exotics</Link></li>
          <li className="menu-item" id="Vendors"><Link to="/vendors" onClick={ (() => this.toggleMenuSlider()) }>Vendors</Link></li>
          <li className="menu-item-disabled" id="News"><span>News</span></li>
        </React.Fragment>
      )
      : (
        <React.Fragment>
          <li className="menu-item Home" id="Home"><Link to="/home" onClick={ (() => this.toggleMenuSlider()) }>Home</Link></li>
          <li className="menu-item-disabled" id="Profile"><span>Profile</span></li>
          <li className="menu-item-disabled" id="Activities"><span>Activities</span></li>
          <li className="menu-item-disabled" id="Exotics"><span>Exotics</span></li>
          <li className="menu-item-disabled" id="Vendors"><span>Vendors</span></li>
          <li className="menu-item-disabled" id="News"><span>News</span></li>
        </React.Fragment>
      )
    );
    const platformSelect = (
      //Check for account Info (basically determines if someone is logged in or not)
      loggedIn ? (
        //They are logged in since there is account info. Next check to see if they have selected a platform
        localStorage.getItem("SelectedAccount") ? (
          //If they have not selected a platform return with a warning selection box
          localStorage.getItem("SelectedAccount") === "Please Select Platform" ? (
            <select type="dropdown" className='btn btn-warning custom loginBtn' id="PlatformSelection" defaultValue="Please Select Platform" onChange={() => { this.setPlatform(); }} style={{ backgroundImage: 'url("../images/icons/blackcaret.png")' }}>
              <option value="Please Select Platform">Please Select Platform</option>
              { platforms.map(plat => ( <option key={ plat.platform } value={ plat.platform }> { plat.platform + ': ' + plat.name } </option> )) }
            </select>
          ) : (
            //If they have selected a platform then return with a normal downdown menu that they can use to swap accounts if need be
            <select type="dropdown" className='btn custom usernameBtn' id="PlatformSelection" onChange={() => { this.setPlatform(); }} style={{ backgroundImage: 'url("../images/icons/caret.png")' }}>
              { platforms.map(plat => (<option key={ plat.platform } value={ plat.platform } selected={ plat.name === JSON.parse(localStorage.getItem("SelectedAccount")).name ? "selected" : null }> { plat.platform + ': ' + plat.name } </option>)) }
            </select>
          )
        ) : ( null )
      ) : (
        //If they are not logged in return with a login button
        <button type="button" className="btn btn-info" id="PlatformSelection" onClick={() => { GotoAuth() }} style={{ margin: "5px", float: "right" }}>Connect with Bungie.net</button>
      )
    );
    const settings = (
      <React.Fragment>
        <div className="settings-cog" style={{ backgroundImage: 'url("./images/icons/cog.png")' }} onClick={ (() => this.toggleSettingsWheel()) }></div>
        <div className="settings-container" style={{ display: `${ this.state.showSettingsWheel ? 'grid' : 'none'}` }}>
          <p onClick={ (() => this.alertID()) }>Get Membership ID</p>
          <p onClick={ (() => this.toggleSettingsModal()) }>Settings</p>
          <p onClick={ (() => Misc.logout()) }>Logout</p>
        </div>
      </React.Fragment>
    );

    return (
      <header className="title-bar" id="title-bar">
        <Link to="/home" onClick={ (() => this.toggleMenuSlider(true)) } style={{ textDecoration: "none" }}><div className="logo-container"><img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span></div></Link>
        <div className="menu-container" id="menu">
          <div className="menu-bar disable-hl"> { menuItems } </div>
          { loggedIn ? settings : null }
          { platformSelect }
        </div>
        <div className="menu-switch-icon" onClick={() => { this.toggleMenuSlider() }} >≡</div>
        { this.state.showSettingsModal ? (<Settings hideSettings={ this.hideSettingsModal } />) : null }
      </header>
    );
  }
}

export default Header;
