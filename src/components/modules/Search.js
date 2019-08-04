import React, { Component } from 'react';
import * as bungie from '../requests/BungieReq';

export class Search extends Component {

  state = {
    users: null
  }

  inspectPlayer = (player, platform) => {
    this.props.inspectPlayer(player, platform);
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
            <option value="STADIA">STADIA</option>
            <option value="STEAM">STEAM</option>
          </select>
          <input id="username" type="text" className="form-control" placeholder="Username..." aria-label="Username..." data-lpignore="true" onKeyPress={ event => { if(event.key === 'Enter'){ this.searchForUser(event.target.value); } } } />
        </div>
        <div className="search-output">
          {
            users !== null ?
            (users.length !== 0 ?
              (users.platformName ?
                users.map(user => ( <div> { user.platformName } </div> )) : users.map(user => {
                  return(
                    <React.Fragment>
                      {user.userInfo.blizzardDisplayName ? <div className='searchResultContainer BNET' onClick={ (() => this.inspectPlayer(user.userInfo.blizzardDisplayName, '4')) } ><div className='searchResultIcon BNET'></div><div className='searchResultName BNET'>{user.userInfo.blizzardDisplayName}</div></div> : null}
                      {user.userInfo.psnDisplayName ? <div className='searchResultContainer PSN' onClick={ (() => this.inspectPlayer(user.userInfo.psnDisplayName, '2')) } ><div className='searchResultIcon PSN'></div><div className='searchResultName PSN'>{user.userInfo.psnDisplayName}</div></div> : null}
                      {user.userInfo.xboxDisplayName ? <div className='searchResultContainer XBL' onClick={ (() => this.inspectPlayer(user.userInfo.xboxDisplayName, '1')) } ><div className='searchResultIcon XBL'></div><div className='searchResultName XBL'>{user.userInfo.xboxDisplayName}</div></div> : null}
                      {user.userInfo.stadiaDisplayName ? <div className='searchResultContainer STADIA' onClick={ (() => this.inspectPlayer(user.userInfo.stadiaDisplayName, '5')) } ><div className='searchResultIcon STADIA'></div><div className='searchResultName STADIA'>{user.userInfo.stadiaDisplayName}</div></div> : null}
                      {user.userInfo.steamDisplayName ? <div className='searchResultContainer STEAM' onClick={ (() => this.inspectPlayer(user.userInfo.steamDisplayName, '3')) } ><div className='searchResultIcon STEAM'></div><div className='searchResultName STEAM'>{user.userInfo.steamDisplayName}</div></div> : null}
                    </React.Fragment>
                  )
                })
              ) : 'No users found with that name on this platform.'
            ) : null
          }
        </div>
      </div>
    );
  }
}

export default Search;
