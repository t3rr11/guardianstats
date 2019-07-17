import React from 'react';
import { Link } from 'react-router-dom';

function toggleMenuSlider() {

}

function Header() {
  return(
    <header className="title-bar">
      <img className="logo" src='./images/logo.png' /><span id="logo_title" href="#">Guardianstats</span>
      <form className="form-inline" id="search-form" style={{ margin: '0px' }}>
        <div id="character_select"></div>
        <button type="button" className="btn btn-info" id="LoginBtn">Connect with Bungie.net</button>
        <div className="input-group">
          <div className="input-group-prepend"><span className="input-group-text disable-hl" id="search-term">BNET</span></div>
          <input id="username-field" type="text" className="form-control" placeholder="Search for player..." aria-label="Search for player..." data-lpignore="true" />
        </div>
      </form>
      <div className="menu-switch-icon" onClick={ toggleMenuSlider() }>≡</div>
      <div className="menu-bar disable-hl">
        <li className="menu-item Home" id="Home"><Link to="/home">Home</Link></li>
        <li className="menu-item Profile" id="Profile"><Link to="/profile">Profile</Link></li>
        <li className="menu-item Activities" id="Activities"><Link to="/activities">Activities</Link></li>
        <li className="menu-item Items" id="Items"><Link to="/items">Items</Link></li>
        <li className="menu-item Triumphs" id="Triumphs"><Link to="/triumphs">Triumphs</Link></li>
        <li className="menu-item-disabled Vendors" id="Vendors"><span>Vendors</span></li>
        <li className="menu-item Tools" id="Tools"><Link to="/tools">Tools</Link></li>
      </div>
      <div className="mobile-menu-bar disable-hl">
        <li className="menu-item Home" id="Home"><Link to="/home">Home</Link></li>
        <li className="menu-item Profile" id="Profile"><Link to="/profile">Profile</Link></li>
        <li className="menu-item Activities" id="Activities"><Link to="/activities">Activities</Link></li>
        <li className="menu-item Items" id="Items"><Link to="/items">Items</Link></li>
        <li className="menu-item Triumphs" id="Triumphs"><Link to="/triumphs">Triumphs</Link></li>
        <li className="menu-item-disabled Vendors" id="Vendors"><Link to="/vendors">Vendors</Link></li>
        <li className="menu-item Tools" id="Tools"><Link to="/tools">Tools</Link></li>
      </div>
    </header>
  )
}

export default Header;
