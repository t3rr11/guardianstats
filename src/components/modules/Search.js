import React, { Component } from 'react';
import * as bungie from '../requests/BungieReq';
import * as Checks from '../scripts/Checks';
import * as Misc from '../Misc';
import uuid from  'uuid';

export class Search extends Component {

  state = {
    users: null,
    suggestedUsers: null,
    error: null
  }
  async componentDidMount() {
    if(await Checks.checkLogin()) { this.prefillSearch() }
  }
  async foundUser(platform, mbmID) {
    this.props.foundUser(platform, mbmID);
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
          psnDisplayName: returnedUsers[i].psnDisplayName,
          xboxDisplayName: returnedUsers[i].xboxDisplayName,
          stadiaDisplayName: returnedUsers[i].stadiaDisplayName,
          steamDisplayName: returnedUsers[i].steamDisplayName
        });
      }
      if(searchPlatform === 'PSN') { if(returnedUsers[i].psnDisplayName){ users.push({ userId: returnedUsers[i].membershipId, searchPlatform: "PSN", psnDisplayName: returnedUsers[i].psnDisplayName }); } }
      else if(searchPlatform === 'XBL') { if(returnedUsers[i].xboxDisplayName) { users.push({ userId: returnedUsers[i].membershipId, searchPlatform: "XBL", xboxDisplayName: returnedUsers[i].xboxDisplayName }); } }
      else if(searchPlatform === 'STADIA') { if(returnedUsers[i].stadiaDisplayName) { users.push({ userId: returnedUsers[i].membershipId, searchPlatform: "STADIA", stadiaDisplayName: returnedUsers[i].stadiaDisplayName }); } }
      else if(searchPlatform === 'STEAM') { if(returnedUsers[i].steamDisplayName) { users.push({ userId: returnedUsers[i].membershipId, searchPlatform: "STEAM", steamDisplayName: returnedUsers[i].steamDisplayName }); } }
    }
    this.setState({ users });
    if(!users.length > 0) {
      this.setState({ error: "Doing a deeper scan. Please wait." });
      this.searchDeeperForUser(input);
    }
  }
  async searchDeeperForUser(input) {
    const searchPlatform = document.getElementById('membership-type').value;
    const returnedUsers = await bungie.SearchDestinyPlayer(input);
    var users = [];
    if(returnedUsers.length > 0) {
      for(var i in returnedUsers) {
        var platform = Misc.getPlatformName(returnedUsers[i].membershipType);
        if(platform === "PSN") { users.push({ userId: null, searchPlatform: searchPlatform, psnDisplayName: returnedUsers[i].displayName, membershipId: returnedUsers[i].membershipId, membershipType: returnedUsers[i].membershipType }); }
        else if(platform === "XBL") { users.push({ userId: null, searchPlatform: searchPlatform, xboxDisplayName: returnedUsers[i].displayName, membershipId: returnedUsers[i].membershipId, membershipType: returnedUsers[i].membershipType }); }
        else if(platform === "STADIA") { users.push({ userId: null, searchPlatform: searchPlatform, stadiaDisplayName: returnedUsers[i].displayName, membershipId: returnedUsers[i].membershipId, membershipType: returnedUsers[i].membershipType }); }
        else if(platform === "STEAM") { users.push({ userId: null, searchPlatform: searchPlatform, steamDisplayName: returnedUsers[i].displayName, membershipId: returnedUsers[i].membershipId, membershipType: returnedUsers[i].membershipType }); }
      }
      this.setState({ error: null, users });
    }
    else { this.setState({ error: "Failed to find any users with that username." }); }
  }
  returnSearchPlatformUsers = (users) => {
    // eslint-disable-next-line
    return users.map((user, index) => {
      if(user.searchPlatform === "ALL") {
        return (
          <React.Fragment key={ uuid.v4() }>
            {user.blizzardDisplayName ? <div key={ uuid.v4() } className='searchResultContainer BNET' onClick={ (() => this.inspectPlayer(user, '4')) } ><div className='searchResultIcon BNET'></div><div className='searchResultName BNET'>{user.blizzardDisplayName}</div></div> : null}
  					{user.psnDisplayName ? <div key={ uuid.v4() } className='searchResultContainer PSN' onClick={ (() => this.inspectPlayer(user, '2')) } ><div className='searchResultIcon PSN'></div><div className='searchResultName PSN'>{user.psnDisplayName}</div></div> : null}
  					{user.xboxDisplayName ? <div key={ uuid.v4() } className='searchResultContainer XBL' onClick={ (() => this.inspectPlayer(user, '1')) } ><div className='searchResultIcon XBL'></div><div className='searchResultName XBL'>{user.xboxDisplayName}</div></div> : null}
  					{user.stadiaDisplayName ? <div key={ uuid.v4() } className='searchResultContainer STADIA' onClick={ (() => this.inspectPlayer(user, '5')) } ><div className='searchResultIcon STADIA'></div><div className='searchResultName STADIA'>{user.stadiaDisplayName}</div></div> : null}
  					{user.steamDisplayName ? <div key={ uuid.v4() }className='searchResultContainer STEAM' onClick={ (() => this.inspectPlayer(user, '3')) } ><div className='searchResultIcon STEAM'></div><div className='searchResultName STEAM'>{user.steamDisplayName}</div></div> : null}
          </React.Fragment>
        )
      }
      else if(user.searchPlatform === "BNET") {
        return (
          <div key={ `search_${user.userId}` } className="searchResultContainer BNET" onClick={ (() => this.inspectPlayer(user, "4")) } >
            <div className='searchResultIcon BNET'></div>
            <div className='searchResultName BNET'>{ user.blizzardDisplayName }</div>
          </div>
        );
      }
      else if(user.searchPlatform === "PSN") {
        return (
          <div key={ `search_${user.userId}` } className="searchResultContainer PSN" onClick={ (() => this.inspectPlayer(user, "2")) } >
            <div className='searchResultIcon PSN'></div>
            <div className='searchResultName PSN'>{ user.psnDisplayName }</div>
          </div>
        );
      }
      else if(user.searchPlatform === "XBL") {
        return (
          <div key={ `search_${user.userId}` } className="searchResultContainer XBL" onClick={ (() => this.inspectPlayer(user, "1")) } >
            <div className='searchResultIcon XBL'></div>
            <div className='searchResultName XBL'>{ user.xblDisplayName }</div>
          </div>
        );
      }
      else if(user.searchPlatform === "STADIA") {
        return (
          <div key={ `search_${user.userId}` } className="searchResultContainer STADIA" onClick={ (() => this.inspectPlayer(user, "5")) } >
            <div className='searchResultIcon STADIA'></div>
            <div className='searchResultName STADIA'>{ user.stadiaDisplayName }</div>
          </div>
        );
      }
      else if(user.searchPlatform === "STEAM") {
        return (
          <div key={ `search_${user.userId}` } className="searchResultContainer STEAM" onClick={ (() => this.inspectPlayer(user, "3")) } >
            <div className='searchResultIcon STEAM'></div>
            <div className='searchResultName STEAM'>{ user.steamDisplayName }</div>
          </div>
        );
      }
      else if(user.searchPlatform === "CUSTOM") {
        return (
          <div key={ `search_${user.userId}` } className={`searchResultContainer ${ user.membershipType }`} onClick={ (() => this.inspectPlayer(user, "-1")) } >
            <div className={`searchResultIcon ${ user.membershipType }`}></div>
            <div className={`searchResultName ${ user.membershipType }`}>{ user.displayName }</div>
          </div>
        );
      }
    });
  }
  inspectPlayer = async (user, platform) => {
    if(user.userId === null) {
      if(await bungie.GetProfile(platform, user.membershipId, "100")) {
        this.foundUser(platform, user.membershipId);
      }
      else { this.setState({ error: "This account does not own Destiny 2 but has linked to bungie." }); }
    }
    else {
      const membershipInfo = await bungie.GetMembershipsById(user.userId, platform);
      if(membershipInfo.destinyMemberships.length > 0) {
        var found = false;
        for(var i in membershipInfo.destinyMemberships) {
          // eslint-disable-next-line
          if(membershipInfo.destinyMemberships[i].membershipType == platform) {
            found = true;
            if(await bungie.GetProfile(platform, membershipInfo.destinyMemberships[i].membershipId, "100")) {
              this.foundUser(platform, membershipInfo.destinyMemberships[i].membershipId);
            }
            else { this.setState({ error: "This account does not own Destiny 2 but has linked to bungie." }); }
          }
        }
        if(found === false) { this.setState({ error: "Account not found. (Possibly in transfer at the moment, try again later)" }); }
      }
      else { this.setState({ error: "No destiny membershipIds were found for this account. Making it impossible to display their stats." }); }
    }
  }
  prefillSearch = async () => {
    if(localStorage.getItem("ProfileInfo")) {
      const ProfileInfo = JSON.parse(localStorage.getItem("ProfileInfo"));
      const mostRecentCharacter = (ProfileInfo) => {
        var lastPlayedTimes = new Date(ProfileInfo.characters.data[Object.keys(ProfileInfo.characters.data)[0]].dateLastPlayed).getTime();
        var lastPlayedCharacter = Object.keys(ProfileInfo.characters.data)[0];
        for(var i in ProfileInfo.characters.data) { if(new Date(ProfileInfo.characters.data[i].dateLastPlayed).getTime() > lastPlayedTimes) { lastPlayedCharacter = i; } }
        return lastPlayedCharacter;
      }
      const recentActivities = await bungie.GetActivityHistory(ProfileInfo.profile.data.userInfo.membershipType, ProfileInfo.profile.data.userInfo.membershipId, mostRecentCharacter(ProfileInfo), 3, 0);
      var recentPlayers = [];
      for(var i in recentActivities.activities) {
        const pgcr = await bungie.GetPGCR(recentActivities.activities[i].activityDetails.instanceId);
        for(var j in pgcr.entries) {
          if(pgcr.entries[j].player.bungieNetUserInfo) {
            if(pgcr.entries[j].player.bungieNetUserInfo.displayName !== ProfileInfo.profile.data.userInfo.displayName) {
              // eslint-disable-next-line
              if(!recentPlayers.find(player => player.userId === pgcr.entries[j].player.bungieNetUserInfo.membershipId)) {
                var platform, crossSave = null;
                if(pgcr.entries[j].player.destinyUserInfo.membershipType === 1) { platform = "XBL" }
                else if(pgcr.entries[j].player.destinyUserInfo.membershipType === 2) { platform = "PSN" }
                else if(pgcr.entries[j].player.destinyUserInfo.membershipType === 3) { platform = "STEAM" }
                else if(pgcr.entries[j].player.destinyUserInfo.membershipType === 4) { platform = "BNET" }
                else if(pgcr.entries[j].player.destinyUserInfo.membershipType === 5) { platform = "STADIA" }
                if(pgcr.entries[j].player.destinyUserInfo.crossSaveOverride !== 0){ crossSave = true } else { crossSave = false }
                if(recentPlayers.length < 15) {
                  recentPlayers.push({
                    userId: pgcr.entries[j].player.bungieNetUserInfo.membershipId,
                    searchPlatform: "CUSTOM",
                    displayName: pgcr.entries[j].player.bungieNetUserInfo.displayName,
                    membershipType: platform,
                    membershipTypeValue: pgcr.entries[j].player.destinyUserInfo.membershipType,
                    isCrossSave: crossSave
                  });
                }
              }
            }
          }
        }
      }
      this.setState({ suggestedUsers: recentPlayers });
    }
  }

  render() {
    const { error, users, suggestedUsers } = this.state;
    return(
      <div className="search-container">
        <div className="search-input">
          <select name="membership-type" id="membership-type" type="dropdown" className="input-group-text disable-hl custom" placeholder="ALL" data-lpignore="true" style={{ backgroundImage: 'url("../images/icons/caret.png")', backgroundSize: '150px, 200px' }}>
            <option value="ALL">ALL</option>
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
              (
                <div className="search-output">
                  <div className="search-content"> { this.returnSearchPlatformUsers(users) } </div>
                </div>
              ) : null
            ) : null
          }
        </div>
        {
          suggestedUsers !== null && users == null ?
          (suggestedUsers.length !== 0 ?
            (
              <div className="suggested-search-output">
                <div className="suggested-search-content"> { this.returnSearchPlatformUsers(suggestedUsers) } </div>
                <div className="suggested-search-title">Players above are from recent activities</div>
              </div>
            ) : null
          ) : null
        }
        <div style={{ fontSize: '14px', color: 'tomato' }}> { error !== null ? error : null } </div>
      </div>
    );
  }
}

export default Search;
