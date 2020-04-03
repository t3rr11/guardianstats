import React, { Component } from 'react';
import * as bungie from '../requests/BungieReq';
import * as Checks from '../scripts/Checks';
import * as Misc from '../Misc';

export class Search extends Component {

  state = {
    users: null,
    suggestedUsers: null,
    error: null
  }
  async componentDidMount() {
    if(await Checks.checkLogin()) { this.prefillSearch() }
  }
  async foundUser(mbmID) { this.props.foundUser(mbmID); }
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
    this.searchDeeperForUser(users, input);
  }
  async searchDeeperForUser(users, input) {
    const searchPlatform = document.getElementById('membership-type').value;
    const returnedUsers = await bungie.SearchDestinyPlayer(input);
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
  returnSearchPlatformUsers = (users, platformType) => {
    // eslint-disable-next-line
    return users.map((user, index) => {
      console.log(user);
      if(platformType === "PSN") {
        return ( user.psnDisplayName ? <div key={ user.userId ? user.userId : user.membershipId } className='searchResultContainer PSN' onClick={ (() => this.inspectPlayer(user, '2')) } ><div className='searchResultIcon PSN'></div><div className='searchResultName PSN'>{user.psnDisplayName}</div></div> : null )
      }
      else if(platformType === "XBL") {
        return ( user.xboxDisplayName ? <div key={ user.userId ? user.userId : user.membershipId } className='searchResultContainer XBL' onClick={ (() => this.inspectPlayer(user, '1')) } ><div className='searchResultIcon XBL'></div><div className='searchResultName XBL'>{user.xboxDisplayName}</div></div> : null )
      }
      else if(platformType === "STEAM") {
        return ( user.steamDisplayName ? <div key={ user.userId ? user.userId : user.membershipId } className='searchResultContainer STEAM' onClick={ (() => this.inspectPlayer(user, '3')) } ><div className='searchResultIcon STEAM'></div><div className='searchResultName STEAM'>{user.steamDisplayName}</div></div> : null )
      }
      else if(platformType === "STADIA") {
        return ( user.stadiaDisplayName ? <div key={ user.userId ? user.userId : user.membershipId } className='searchResultContainer STADIA' onClick={ (() => this.inspectPlayer(user, '5')) } ><div className='searchResultIcon STADIA'></div><div className='searchResultName STADIA'>{user.stadiaDisplayName}</div></div> : null )
      }
    });
  }
  inspectPlayer = async (user, platform) => {
    if(user.userId === null) {
      if(await bungie.GetProfile(platform, user.membershipId, "100")) {
        this.foundUser(user.membershipId);
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
              this.foundUser(membershipInfo.destinyMemberships[i].membershipId);
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
      if(recentActivities) {
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
      else { this.setState({ error: "An error occurred..." }); }
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
                  <div className="search-content">
                    <div className="psnField">{ this.returnSearchPlatformUsers(users, "PSN") }</div>
                    <div className="xblField">{ this.returnSearchPlatformUsers(users, "XBL") }</div>
                    <div className="steamField">{ this.returnSearchPlatformUsers(users, "STEAM") }</div>
                    <div className="stadiaField">{ this.returnSearchPlatformUsers(users, "STADIA") }</div>
                  </div>
                </div>
              ) : null
            ) : (<div className="searchDesc">Feel free to search above or consider connecting with bungie to get the full experience from Guardianstats!<p>Press Enter to Search.</p></div>)
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
