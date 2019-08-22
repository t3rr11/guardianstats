import React, { Component } from 'react';
import * as bungie from '../requests/BungieReq';
import uuid from  'uuid';

export class Search extends Component {

  state = {
    users: null
  }

  inspectPlayer = (userId, player, platform) => {
    this.props.inspectPlayer(userId, player, platform);
  }

  async searchForUser(input) {
    const searchPlatform = document.getElementById('membership-type').value;
    const returnedUsers = await bungie.SearchUsers(input);
    var users = [];
    for(var i in returnedUsers) {
      if(searchPlatform === 'ALL') {
        users.push({
          userId: returnedUsers[i].membershipId,
          searchPlatform: "ALL",
          blizzardDisplayName: returnedUsers[i].blizzardDisplayName,
          psnDisplayName: returnedUsers[i].psnDisplayName,
          xboxDisplayName: returnedUsers[i].xboxDisplayName,
          stadiaDisplayName: returnedUsers[i].stadiaDisplayName,
          steamDisplayName: returnedUsers[i].steamDisplayName
        });
      }
      else if(searchPlatform === 'BNET') { if(returnedUsers[i].blizzardDisplayName){ users.push({ userId: returnedUsers[i].membershipId, searchPlatform: "BNET", blizzardDisplayName: returnedUsers[i].blizzardDisplayName }); } }
      else if(searchPlatform === 'PSN') { if(returnedUsers[i].psnDisplayName){ users.push({ userId: returnedUsers[i].membershipId, searchPlatform: "PSN", psnDisplayName: returnedUsers[i].psnDisplayName }); } }
      else if(searchPlatform === 'XBL') { if(returnedUsers[i].xboxDisplayName) { users.push({ userId: returnedUsers[i].membershipId, searchPlatform: "XBL", xboxDisplayName: returnedUsers[i].xboxDisplayName }); } }
      else if(searchPlatform === 'STADIA') { if(returnedUsers[i].stadiaDisplayName) { users.push({ userId: returnedUsers[i].membershipId, searchPlatform: "STADIA", stadiaDisplayName: returnedUsers[i].stadiaDisplayName }); } }
      else if(searchPlatform === 'STEAM') { if(returnedUsers[i].steamDisplayName) { users.push({ userId: returnedUsers[i].membershipId, searchPlatform: "STEAM", steamDisplayName: returnedUsers[i].steamDisplayName }); } }
    }
    this.setState({ users });
  }

  returnSearchPlatformUsers = (users) => {
    return users.map((user, index) => {
      if(user.searchPlatform === "ALL") {
        return (
          <React.Fragment key={ uuid.v4() }>
            {user.blizzardDisplayName ? <div key={ uuid.v4() } className='searchResultContainer BNET' onClick={ (() => this.inspectPlayer(user.userId, user.blizzardDisplayName, '4')) } ><div className='searchResultIcon BNET'></div><div className='searchResultName BNET'>{user.blizzardDisplayName}</div></div> : null}
  					{user.psnDisplayName ? <div key={ uuid.v4() } className='searchResultContainer PSN' onClick={ (() => this.inspectPlayer(user.userId, user.psnDisplayName, '2')) } ><div className='searchResultIcon PSN'></div><div className='searchResultName PSN'>{user.psnDisplayName}</div></div> : null}
  					{user.xboxDisplayName ? <div key={ uuid.v4() } className='searchResultContainer XBL' onClick={ (() => this.inspectPlayer(user.userId, user.xboxDisplayName, '1')) } ><div className='searchResultIcon XBL'></div><div className='searchResultName XBL'>{user.xboxDisplayName}</div></div> : null}
  					{user.stadiaDisplayName ? <div key={ uuid.v4() } className='searchResultContainer STADIA' onClick={ (() => this.inspectPlayer(user.userId, user.stadiaDisplayName, '5')) } ><div className='searchResultIcon STADIA'></div><div className='searchResultName STADIA'>{user.stadiaDisplayName}</div></div> : null}
  					{user.steamDisplayName ? <div key={ uuid.v4() }className='searchResultContainer STEAM' onClick={ (() => this.inspectPlayer(user.userId, user.steamDisplayName, '3')) } ><div className='searchResultIcon STEAM'></div><div className='searchResultName STEAM'>{user.steamDisplayName}</div></div> : null}
          </React.Fragment>
        )
      }
      else if(user.searchPlatform === "BNET") {
        return (
          <div className="searchResultContainer BNET" onClick={ (() => this.inspectPlayer(user.blizzardDisplayName, "4")) } >
            <div className='searchResultIcon BNET'></div>
            <div className='searchResultName BNET'>{ user.blizzardDisplayName }</div>
          </div>
        );
      }
      else if(user.searchPlatform === "PSN") {
        return (
          <div className="searchResultContainer PSN" onClick={ (() => this.inspectPlayer(user.psnDisplayName, "2")) } >
            <div className='searchResultIcon PSN'></div>
            <div className='searchResultName PSN'>{ user.psnDisplayName }</div>
          </div>
        );
      }
      else if(user.searchPlatform === "XBL") {
        return (
          <div className="searchResultContainer XBL" onClick={ (() => this.inspectPlayer(user.xblDisplayName, "1")) } >
            <div className='searchResultIcon XBL'></div>
            <div className='searchResultName XBL'>{ user.xblDisplayName }</div>
          </div>
        );
      }
      else if(user.searchPlatform === "STADIA") {
        return (
          <div className="searchResultContainer STADIA" onClick={ (() => this.inspectPlayer(user.stadiaDisplayName, "5")) } >
            <div className='searchResultIcon STADIA'></div>
            <div className='searchResultName STADIA'>{ user.stadiaDisplayName }</div>
          </div>
        );
      }
      else if(user.searchPlatform === "STEAM") {
        return (
          <div className="searchResultContainer STEAM" onClick={ (() => this.inspectPlayer(user.steamDisplayName, "3")) } >
            <div className='searchResultIcon STEAM'></div>
            <div className='searchResultName STEAM'>{ user.steamDisplayName }</div>
          </div>
        );
      }
    });
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
            (users.length !== 0 ? this.returnSearchPlatformUsers(users) : "No users found with that name on this platform."
            ) : null
          }
        </div>
      </div>
    );
  }
}

export default Search;
