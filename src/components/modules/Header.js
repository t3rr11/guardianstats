import React from 'react';
import { Link } from 'react-router-dom';
import * as auth from '../requests/BungieAuth';
import * as pf from '../scripts/Platforms';
import * as checks from '../scripts/Checks';
import * as profileHelper from '../scripts/ProfileHelper';

function toggleMenuSlider() { console.log('Toggled'); }
function GotoAuth() { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24048&response_type=code&state=1'; }

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
    var plaform = selectBox.options[selectBox.selectedIndex].value;
    localStorage.setItem('SelectedAccount', plaform);
    if(plaform === 'BNET') { await auth.SetCurrentMembershipInfo(this.props.accountInfo.blizzardDisplayName.replace('#', '%23')); window.location.reload(); }
    else if(plaform === 'PSN') { await auth.SetCurrentMembershipInfo(this.props.accountInfo.psnDisplayName); window.location.reload(); }
    else if(plaform === 'XBL') { await auth.SetCurrentMembershipInfo(this.props.accountInfo.xboxDisplayName); window.location.reload(); }
    else if(plaform === 'STADIA') { await auth.SetCurrentMembershipInfo(this.props.accountInfo.stadiaDisplayName); window.location.reload(); }
    else if(plaform === 'STEAM') { await auth.SetCurrentMembershipInfo(this.props.accountInfo.steamDisplayName); window.location.reload(); }
  }

  async changeCharacter(characterId) { console.log(characterId); localStorage.setItem('SelectedCharacter', characterId); window.location.reload(); }

  render() {
    const { accountInfo } = this.props;
    const { platform, platforms } = this.state.platform;
    const characters = JSON.parse(localStorage.getItem('ProfileInfo')).characters.data;
    const characterIds = JSON.parse(localStorage.getItem('ProfileInfo')).profile.data.characterIds;
    const selectedCharacter = localStorage.getItem('SelectedCharacter');
    const menuItems = (
      <React.Fragment>
        <li className="menu-item Home" id="Home"><Link to="/home">Home</Link></li>
        <li className="menu-item-disabled" id="Profile"><span>Profile</span></li>
        <li className="menu-item" id="Activities"><Link to="/activities">Activities</Link></li>
        <li className="menu-item" id="Items"><Link to="/items">Items</Link></li>
        <li className="menu-item-disabled" id="Triumphs"><span>Triumphs</span></li>
        <li className="menu-item-disabled" id="Vendors"><span>Vendors</span></li>
        <li className="menu-item-disabled" id="Tools"><span>Tools</span></li>
      </React.Fragment>
    );
    const SelectPlatformHeader = () => (
      <header className="title-bar">
        <img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span>
        <div className="settings-cog" style={{ backgroundImage: 'url("./images/icons/cog.png")' }} onClick={ (() => this.toggleSettings()) }></div>
        <div className="settings-container" style={{ display: `${ this.state.showSettings ? 'block' : 'none'}` }}>
          <p style={{ textAlign: 'center' }}>Settings</p>
          <p style={{ textAlign: 'center' }}>Logout</p>
        </div>
        <select name="LoginBtn" type="dropdown" className='btn btn-warning custom' id="LoginBtn" defaultValue="Please Select Platform" onChange={() => { this.setPlatform(); this.setState(this.state); }} style={{ backgroundImage: 'url("../images/icons/blackcaret.png")' }}>
          <option value="Please Select Platform">Please Select Platform</option>
          { platforms.map(plat => ( <option key={ plat.platform } value={ plat.platform }> { plat.platform + ': ' + plat.name } </option> )) }
        </select>
        <div className="menu-switch-icon" onClick={() => { toggleMenuSlider() }} >≡</div>
        <div className="menu-bar disable-hl"> { menuItems } </div>
        <div className="mobile-menu-bar disable-hl"> { menuItems } </div>
      </header>
    );
    const HeaderWithPlatform = () => (
      <header className="title-bar">
        <img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span>
        <div className="settings-cog" style={{ backgroundImage: 'url("./images/icons/cog.png")' }} onClick={ (() => this.toggleSettings()) }></div>
        <div className="settings-container" style={{ display: `${ this.state.showSettings ? 'block' : 'none'}` }}>
          <p style={{ textAlign: 'center' }}>Settings</p>
          <p style={{ textAlign: 'center' }}>Logout</p>
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
          }, this) }
        </div>
        <div className="menu-switch-icon" onClick={() => { toggleMenuSlider() }} >≡</div>
        <div className="menu-bar disable-hl"> { menuItems } </div>
        <div className="mobile-menu-bar disable-hl"> { menuItems } </div>
      </header>
    );
    const DefaultHeader = () => (
      <header className="title-bar">
        <img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span>
        <button type="button" className="btn btn-info" id="LoginBtn" onClick={() => { GotoAuth() }} style={{ marginRight: '5px' }}>Connect with Bungie.net</button>
        <div className="menu-switch-icon" onClick={() => { toggleMenuSlider() }} >≡</div>
        <div className="menu-bar disable-hl"> { menuItems } </div>
        <div className="mobile-menu-bar disable-hl"> { menuItems } </div>
      </header>
    );

    if(accountInfo) {
      if(platforms !== null) {
        if(platform === null) { return( SelectPlatformHeader() ); }
        else { return( HeaderWithPlatform() ); }
      }
      else { return( DefaultHeader() ); }
    }
    else { return( DefaultHeader() ); }
  }
}

export default Header;
