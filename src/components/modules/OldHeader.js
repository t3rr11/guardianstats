import React from 'react';
import { Link } from 'react-router-dom';
import * as bungie from '../requests/BungieReq';
import * as auth from '../requests/BungieAuth';
import * as pf from '../scripts/Platforms';
import * as checks from '../scripts/Checks';
import * as profileHelper from '../scripts/ProfileHelper';
import * as Misc from '../Misc';
import Settings from './Settings';

function GotoAuth() { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24178&response_type=code&state=1'; }

export class Header extends React.Component {

  state = {
    platform: { platform: null, platforms: null },
    showSettings: false,
    showSettingsModal: false
  }

  toggleSettingsBtn = () => { this.setState({ showSettings: !this.state.showSettings }); }
  toggleSettingsModal = () => { this.setState({ showSettings: !this.state.showSettings, showSettingsModal: !this.state.showSettingsModal }); }
  hideSettingsModal = () => { this.setState({ showSettingsModal: false }); }

  async componentDidMount() {
    this.startUpChecks();
  }

  async startUpChecks() {
    if(await checks.checkLogin()) {
      var platformInfo = await pf.getPlatform(this.props.accountInfo);
      if(platformInfo.platforms.length === 1) {
        var platformType = null;
        localStorage.setItem('SelectedAccount', platformInfo.platforms[0].platform);
        if(platformInfo.platforms[0].platform === 'BNET') { platformType = "4" }
        else if(platformInfo.platforms[0].platform === 'PSN') { platformType = "2" }
        else if(platformInfo.platforms[0].platform === 'XBL') { platformType = "1" }
        else if(platformInfo.platforms[0].platform === 'STADIA') { platformType = "5" }
        else if(platformInfo.platforms[0].platform === 'STEAM') { platformType = "3" }
        await this.getPlatformReponse(platformType);
        this.setState({ platform: { platform: platformInfo.platforms[0].name, platforms: platformInfo.platforms } });
      }
      else {
        this.setState({ platform: { platform: platformInfo.platformUsername, platforms: platformInfo.platforms } });
      }
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
  async getPlatformReponse(membershipType) {
    await auth.SetCurrentMembershipInfo(this.props.accountInfo.membershipId, membershipType).then(async basicMembershipInfo => {
      await bungie.GetProfile(basicMembershipInfo.membershipType, basicMembershipInfo.membershipId, '100,200').then(response => {
        const characters = response.characters.data;
        var lastOnlineCharacter = 0;
        for(var i in characters) { if(new Date(characters[i].dateLastPlayed) > lastOnlineCharacter) { lastOnlineCharacter = characters[i]; } }
        if(localStorage.getItem('SelectedCharacter') === null) { localStorage.setItem('SelectedCharacter', lastOnlineCharacter.characterId); }
        localStorage.setItem('ProfileInfo', JSON.stringify(response));
        this.setState(this.state);
      });
    })
  }
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
        <li className="menu-item" id="Exotics"><Link to="/exotics" onClick={ (() => this.toggleMenuSlider()) }>Exotics</Link></li>
        <li className="menu-item" id="Vendors"><Link to="/vendors" onClick={ (() => this.toggleMenuSlider()) }>Vendors</Link></li>
      </React.Fragment>
    );
    const settings = (
      <React.Fragment>
        <div className="settings-cog" style={{ backgroundImage: 'url("./images/icons/cog.png")' }} onClick={ (() => this.toggleSettingsBtn()) }></div>
        <div className="settings-container" style={{ display: `${ this.state.showSettings ? 'grid' : 'none'}` }}>
          <p style={{ color: "#aaa" }}>Add another account</p>
          <p onClick={ (() => this.toggleSettingsModal()) }>Settings</p>
          <p onClick={ (() => Misc.logout()) }>Logout</p>
        </div>
      </React.Fragment>
    );
    const SelectPlatformHeader = () => (
      <header className="title-bar" id="title-bar">
        <Link to="/home" onClick={ (() => this.toggleMenuSlider(true)) } style={{ textDecoration: "none" }}>
          <div className="logo-container"><img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span></div>
        </Link>
        <div className="menu-container" id="menu">
          { settings }
          <select name="LoginBtn" type="dropdown" className='btn btn-warning custom' id="LoginBtn" defaultValue="Please Select Platform" onChange={() => { this.setPlatform(); this.setState(this.state); }} style={{ backgroundImage: 'url("../images/icons/blackcaret.png")' }}>
            <option value="Please Select Platform">Please Select Platform</option>
            { platforms.map(plat => ( <option key={ plat.platform } value={ plat.platform }> { plat.platform + ': ' + plat.name } </option> )) }
          </select>
          <div className="menu-bar disable-hl"> { menuItems } </div>
        </div>
        <div className="menu-switch-icon" onClick={() => { this.toggleMenuSlider() }} >≡</div>
        { this.state.showSettingsModal ? (<Settings hideSettings={ this.hideSettingsModal } />) : null }
      </header>
    );
    const HeaderWithPlatform = () => (
      <header className="title-bar" id="title-bar">
        <Link to="/home" onClick={ (() => this.toggleMenuSlider(true)) } style={{ textDecoration: "none" }}>
          <div className="logo-container"><img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span></div>
        </Link>
        <div className="menu-container" id="menu">
          { settings }
          <select name="LoginBtn" type="dropdown" className='btn custom' id="UsernameBtn" defaultValue={ localStorage.getItem('SelectedAccount') } onChange={() => { this.setPlatform(); this.setState(this.state); }} style={{ backgroundImage: 'url("../images/icons/caret.png")' }}>
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
        { this.state.showSettingsModal ? (<Settings hideSettings={ this.hideSettingsModal } />) : null }
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
        { this.state.showSettingsModal ? (<Settings hideSettings={ this.hideSettingsModal } />) : null }
      </header>
    );
    if(accountInfo) {
      if(platforms !== null) {
        if(platform === null) {
          return( SelectPlatformHeader() );
        }
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