import React from 'react';
import { Link } from 'react-router-dom';
import * as auth from '../requests/BungieAuth';
import * as pf from '../scripts/Platforms';
import * as checks from '../scripts/Checks';
import * as profileHelper from '../scripts/ProfileHelper';
import * as Misc from '../Misc';

function GotoAuth() { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24178&response_type=code&state=1'; }

export class Header extends React.Component {

  state = {
    platform: { platform: null, platforms: null },
    showSettings: false
  }

  toggleSettings = () => { this.setState({ showSettings: !this.state.showSettings }); }

  async componentDidMount() {
    this.startUpChecks();
  }

  async startUpChecks() {
    if(await checks.checkLogin()) {
      var platformInfo = await pf.getPlatform(this.props.accountInfo);
      this.setState({ platform: { platform: platformInfo.platformUsername, platforms: platformInfo.platforms } });
    }
  }

  async setPlatform () {
    var selectBox = document.getElementById('LoginBtn');
    var platform = selectBox.options[selectBox.selectedIndex].value;
    localStorage.setItem('SelectedAccount', platform);
    if(platform === 'BNET') { this.getPlatformReponse("4"); }
    else if(platform === 'PSN') { this.getPlatformReponse("2"); }
    else if(platform === 'XBL') { this.getPlatformReponse("1"); }
    else if(platform === 'STADIA') { this.getPlatformReponse("5"); }
    else if(platform === 'STEAM') { this.getPlatformReponse("3"); }
  }
  async getPlatformReponse(membershipType) { await auth.SetCurrentMembershipInfo(this.props.accountInfo.membershipId, membershipType).then(response => { window.location.reload(); }) }
  async changeCharacter(characterId) { console.log(characterId); localStorage.setItem('SelectedCharacter', characterId); window.location.reload(); }
  toggleMenuSlider(ignore) {
    if(window.screen.width < 800 && !ignore) {
      document.getElementById("menu").classList.toggle("show"); document.getElementById("title-bar").classList.toggle("show");
    }
  }

  render() {
    const { accountInfo } = this.props;
    const { platform, platforms } = this.state.platform;
    var characters, characterIds, selectedCharacter = null;
    if(localStorage.getItem('ProfileInfo')) {
      characters = JSON.parse(localStorage.getItem('ProfileInfo')).characters.data;
      characterIds = JSON.parse(localStorage.getItem('ProfileInfo')).profile.data.characterIds;
      selectedCharacter = localStorage.getItem('SelectedCharacter');
    }
    const defaultMenuItems = (
      <React.Fragment>
        <li className="menu-item Home" id="Home"><Link to="/home" onClick={ (() => this.toggleMenuSlider()) }>Home</Link></li>
        <li className="menu-item-disabled" id="Profile"><span>Profile</span></li>
        <li className="menu-item-disabled" id="Activities"><span>Activities</span></li>
        <li className="menu-item-disabled" id="Exotics"><span>Exotics</span></li>
        <li className="menu-item-disabled" id="Vendors"><span>Vendors</span></li>
      </React.Fragment>
    );
    const menuItems = (
      <React.Fragment>
        <li className="menu-item Home" id="Home"><Link to="/home" onClick={ (() => this.toggleMenuSlider()) }>Home</Link></li>
        <li className="menu-item" id="Profile"><Link to="/profile" onClick={ (() => this.toggleMenuSlider()) }>Profile</Link></li>
        <li className="menu-item" id="Activities"><Link to="/activities" onClick={ (() => this.toggleMenuSlider()) }>Activities</Link></li>
        <li className="menu-item" id="Items"><Link to="/items" onClick={ (() => this.toggleMenuSlider()) }>Exotics</Link></li>
        <li className="menu-item" id="Vendors"><Link to="/vendors" onClick={ (() => this.toggleMenuSlider()) }>Vendors</Link></li>
      </React.Fragment>
    );
    const SelectPlatformHeader = () => (
      <header className="title-bar" id="title-bar">
        <Link to="/home" onClick={ (() => this.toggleMenuSlider(true)) } style={{ textDecoration: "none" }}>
          <div className="logo-container"><img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span></div>
        </Link>
        <div className="menu-container" id="menu">
          <div className="settings-cog" style={{ backgroundImage: 'url("./images/icons/cog.png")' }} onClick={ (() => this.toggleSettings()) }></div>
          <div className="settings-container" style={{ display: `${ this.state.showSettings ? 'grid' : 'none'}` }}>
            <p>Add another account</p>
            <p>Settings</p>
            <p onClick={ (() => Misc.logout()) }>Logout</p>
          </div>
          <select name="LoginBtn" type="dropdown" className='btn btn-warning custom' id="LoginBtn" defaultValue="Please Select Platform" onChange={() => { this.setPlatform(); this.setState(this.state); }} style={{ backgroundImage: 'url("../images/icons/blackcaret.png")' }}>
            <option value="Please Select Platform">Please Select Platform</option>
            { platforms.map(plat => ( <option key={ plat.platform } value={ plat.platform }> { plat.platform + ': ' + plat.name } </option> )) }
          </select>
          <div className="menu-bar disable-hl"> { menuItems } </div>
        </div>
        <div className="menu-switch-icon" onClick={() => { this.toggleMenuSlider() }} >≡</div>
      </header>
    );
    const HeaderWithPlatform = () => (
      <header className="title-bar" id="title-bar">
        <Link to="/home" onClick={ (() => this.toggleMenuSlider(true)) } style={{ textDecoration: "none" }}>
          <div className="logo-container"><img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span></div>
        </Link>
        <div className="menu-container" id="menu">
          <div className="settings-cog" style={{ backgroundImage: 'url("./images/icons/cog.png")' }} onClick={ (() => this.toggleSettings()) }></div>
          <div className="settings-container" style={{ display: `${ this.state.showSettings ? 'grid' : 'none'}` }}>
            <p>Add another account</p>
            <p>Settings</p>
            <p onClick={ (() => Misc.logout()) }>Logout</p>
          </div>
          <select name="LoginBtn" type="dropdown" className='btn btn-info custom' id="LoginBtn" defaultValue={ localStorage.getItem('SelectedAccount') } onChange={() => { this.setPlatform(); this.setState(this.state); }} style={{ backgroundImage: 'url("../images/icons/caret.png")' }}>
            { platforms.map(plat => ( <option value={ plat.platform } key={ plat.platform }> { plat.platform + ': ' + plat.name } </option> )) }
          </select>
          <div id="character_select">
            <div key={ selectedCharacter } className="character_data" id={ selectedCharacter }>
              <div className="innerDiv" style={{ backgroundImage: `url("https://bungie.net${characters[selectedCharacter].emblemBackgroundPath}")` }}>
                <span id="left_span">{ profileHelper.getClassName(characters[selectedCharacter].classType) }</span>
                <span id="right_span">✦ { characters[selectedCharacter].light }</span>
              </div>
            </div>
            { characterIds.map(function(charId) {
              if(charId !== selectedCharacter) {
                return (
                  <div key={ charId } className="character_data" id={ charId } onClick={ (() => this.changeCharacter(charId)) }>
                    <div className="innerDiv" style={{ backgroundImage: `url("https://bungie.net${characters[charId].emblemBackgroundPath}")` }}>
                      <span id='left_span'>{ profileHelper.getClassName(characters[charId].classType) }</span>
                      <span id='right_span'>✦ { characters[charId].light }</span>
                    </div>
                  </div>
                );
              }
              else { return null; }
            }, this) }
          </div>
          <div className="menu-bar disable-hl"> { menuItems } </div>
        </div>
        <div className="menu-switch-icon" onClick={() => { this.toggleMenuSlider() }} >≡</div>
      </header>
    );
    const DefaultHeader = () => (
      <header className="title-bar" id="title-bar">
        <Link to="/home" onClick={ (() => this.toggleMenuSlider(true)) } style={{ textDecoration: "none" }}>
          <div className="logo-container"><img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span></div>
        </Link>
        <div className="menu-container" id="menu">
          <button type="button" className="btn btn-info" id="LoginBtn" onClick={() => { GotoAuth() }} style={{ marginRight: '5px' }}>Connect with Bungie.net</button>
          <div className="menu-bar disable-hl"> { defaultMenuItems } </div>
        </div>
        <div className="menu-switch-icon" onClick={() => { this.toggleMenuSlider() }} >≡</div>
      </header>
    );
    if(accountInfo) {
      if(platforms !== null) {
        if(platform === null) { return( SelectPlatformHeader() ); }
        else {
          if(localStorage.getItem("ProfileInfo")) {
            return( HeaderWithPlatform() );
          }
          else {
            return( SelectPlatformHeader() );
          }
        }
      }
      else { return( DefaultHeader() ); }
    }
    else { return( DefaultHeader() ); }
  }
}

export default Header;
