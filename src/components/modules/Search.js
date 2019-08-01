import React, { Component } from 'react';
import * as bungie from '../requests/BungieReq';

export class Search extends Component {

  state = {
    users: null
  }

  async searchForUser(input) {
    const searchPlatform = document.getElementById('membership-type').value;
    const returnedUsers = await bungie.SearchUsers(input);
    var users = [];
    for(var i in returnedUsers) {
      if(searchPlatform === 'ALL') { users.push({ userInfo: returnedUsers[i] }); }
      else if(searchPlatform === 'BNET') { if(returnedUsers[i].blizzardDisplayName){ users.push({ userInfo: returnedUsers[i], platformName: returnedUsers[i].blizzardDisplayName }); } }
      else if(searchPlatform === 'PSN') { if(returnedUsers[i].psnDisplayName) { users.push({ userInfo: returnedUsers[i], platformName: returnedUsers[i].psnDisplayName }); } }
      else if(searchPlatform === 'XBL') { if(returnedUsers[i].xboxDisplayName) { users.push({ userInfo: returnedUsers[i], platformName: returnedUsers[i].xboxDisplayName }); } }
      else if(searchPlatform === 'STADIA') if(returnedUsers[i].stadiaDisplayName) { { users.push({ userInfo: returnedUsers[i], platformName: returnedUsers[i].stadiaDisplayName }); } }
      else if(searchPlatform === 'STEAM') if(returnedUsers[i].steamDisplayName) { { users.push({ userInfo: returnedUsers[i], platformName: returnedUsers[i].steamDisplayName }); } }
    }
    this.setState({ users });
  }

  render() {
    const { users } = this.state;
    return(
      <div className="search-container">
        <div className="search-input">
          <select name="membership-type" id="membership-type" type="dropdown" className="input-group-text disable-hl custom" placeholder="ALL" data-lpignore="true" style={{ backgroundImage: 'url("../images/icons/caret.png")', backgroundSize: '150px, 200px' }}>
            <option value="ALL">ALL</option>
            <option value="BNET">BNET</option>
            <option value="PSN">PSN</option>
            <option value="XBL">XBL</option>
            <option value="Stadia">Stadia</option>
            <option value="Steam">Steam</option>
          </select>
          <input id="username" type="text" className="form-control" placeholder="Username..." aria-label="Username..." data-lpignore="true" onKeyPress={ event => { if(event.key === 'Enter'){ this.searchForUser(event.target.value); } } } />
        </div>
        <div className="search-output">
          {
            users !== null ?
            (users.length !== 0 ?
              (users.platformName ?
                users.map(user => ( <div> { user.platformName } </div> )) : users.map(user => ( <div> { user.userInfo.displayName } </div> ))
              ) : 'No users found with that name on this platform.'
            ) : null
          }
        </div>
      </div>
    );
  }
}

export default Search;
