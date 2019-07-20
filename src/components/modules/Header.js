import React from 'react';
import { Link } from 'react-router-dom';

function toggleMenuSlider() { console.log('Toggled'); }
function setPlatform() {
  var selectBox = document.getElementById('LoginBtn');
  localStorage.setItem('SelectedAccount', selectBox.options[selectBox.selectedIndex].value);
}
function GotoAuth() { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24048&response_type=code&state=1'; }

export class Header extends React.Component {

  state = { temp: '' }

  render() {
    const { accountInfo } = this.props;
    const selectedAccount = localStorage.getItem('SelectedAccount');
    var platforms = [];
    var platformUsername = null;

    if(Object.keys(accountInfo).includes('blizzardDisplayName')) { platforms.push({ 'platform': 'BNET', 'name': accountInfo.blizzardDisplayName }); }
    if(Object.keys(accountInfo).includes('psnDisplayName')) { platforms.push({ 'platform': 'PSN', 'name': accountInfo.psnDisplayName }); }
    if(Object.keys(accountInfo).includes('xboxDisplayName')) { platforms.push({ 'platform': 'XBL', 'name': accountInfo.xboxDisplayName }); }
    if(Object.keys(accountInfo).includes('stadiaDisplayName')) { platforms.push({ 'platform': 'STADIA', 'name': accountInfo.stadiaDisplayName }); }
    if(Object.keys(accountInfo).includes('steamDisplayName')) { platforms.push({ 'platform': 'STEAM', 'name': accountInfo.steamDisplayName }); }
    for(var i in platforms){ if(selectedAccount === platforms[i].platform) { platformUsername = platforms[i].name; } }

    if(accountInfo) {
      if(selectedAccount === 'Please Select Platform') {
        //Return logged in but has not yet selected platform header
        return(
          <header className="title-bar">
            <img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span>
            <select name="LoginBtn" type="dropdown" className='btn btn-warning' id="LoginBtn" onChange={() => { setPlatform(); this.setState(this.state); }}>
              <option value="Please Select Platform">Please Select Platform</option>
              { platforms.map(plat => ( <option value={ plat.platform }> { plat.platform + ': ' + plat.name } </option> )) }
            </select>
            <div className="menu-switch-icon" onClick={() => { toggleMenuSlider() }} >≡</div>
            <div className="menu-bar disable-hl"> { menuItems } </div>
            <div className="mobile-menu-bar disable-hl"> { menuItems } </div>
          </header>
        );
      }
      else {
        //Return logged in and selected platform header
        return(
          <header className="title-bar">
            <img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span>
            <select name="LoginBtn" type="dropdown" className='btn btn-info' id="LoginBtn" onChange={() => { setPlatform(); this.setState(this.state); }}>
              { platforms.map(plat => ( <option value={ plat.platform } key={ plat.platform }> { plat.platform + ': ' + plat.name } </option> )) }
            </select>
            <div className="menu-switch-icon" onClick={() => { toggleMenuSlider() }} >≡</div>
            <div className="menu-bar disable-hl"> { menuItems } </div>
            <div className="mobile-menu-bar disable-hl"> { menuItems } </div>
          </header>
        );
      }
    }
    else {
      //Return not logged in Header
      return(
        <header className="title-bar">
          <img className="logo" alt='Logo' src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span>
          <button type="button" className="btn btn-info" id="LoginBtn" onClick={() => { GotoAuth() }}>Connect with Bungie.net</button>
          <div className="menu-switch-icon" onClick={() => { toggleMenuSlider() }} >≡</div>
          <div className="menu-bar disable-hl"> { menuItems } </div>
          <div className="mobile-menu-bar disable-hl"> { menuItems } </div>
        </header>
      );
    }
  }
}

const menuItems = (
  <React.Fragment>
    <li className="menu-item Home" id="Home"><Link to="/home">Home</Link></li>
    <li className="menu-item Profile" id="Profile"><Link to="/profile">Profile</Link></li>
    <li className="menu-item Activities" id="Activities"><Link to="/activities">Activities</Link></li>
    <li className="menu-item Items" id="Items"><Link to="/items">Items</Link></li>
    <li className="menu-item Triumphs" id="Triumphs"><Link to="/triumphs">Triumphs</Link></li>
    <li className="menu-item-disabled Vendors" id="Vendors"><span>Vendors</span></li>
    <li className="menu-item Tools" id="Tools"><Link to="/tools">Tools</Link></li>
  </React.Fragment>
);

export default Header;
