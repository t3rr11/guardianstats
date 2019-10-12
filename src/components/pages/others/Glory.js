import React, { Component } from 'react';
import qs from 'query-string';

import Loader from '../../modules/Loader';
import * as bungie from '../../requests/BungieReq';
import * as Checks from '../../scripts/Checks';
import * as Misc from '../../Misc';

export class GloryCheck extends Component {

  state = {
    users: null,
    previousGame: false,
    alphaTeam: [],
    bravoTeam: [],
    error: null
  }

  async searchForUser(user) {
    this.setState({ error: "Checking...", users: null });
    var userdata = await bungie.GetMembershipId(user);
    if(userdata.length > 0) {
      var users = [];
      for(var i in userdata) {
        var data = await this.getGlory(userdata[i].displayName, userdata[i].membershipType, userdata[i].membershipId, "none");
        if(data !== "No User" && data !== "User Private") {
          users.push({ name: data.name, glory: data.glory });
        }
      }
      if(users.length !== 0) {
        this.setState({ error: null, users });
      }
      else {
        this.setState({ error: "No users with that name found." });
      }
    }
    else {
      this.setState({ error: "No users with that name found." });
    }
  }
  async getGlory(name, membershipType, membershipId, team) {
    var userdata = await bungie.GetProfile(membershipType, membershipId, "100,202");
    console.log(userdata);
    if(userdata === undefined) { return "No User"; }
    else if(!userdata.characterProgressions.data) { return "No User"; }
    else if(Object.keys(userdata.characterProgressions.data).length > 0) {
      var characters = userdata.profile.data.characterIds;
      var name = userdata.profile.data.userInfo.displayName;
      var glory = userdata.characterProgressions.data[characters[0]].progressions[2679551909].currentProgress;
      return { name, glory, team };
    }
    else { return "User Private"; }
  }
  async getPreviousMatch() {
    const accountInfo = JSON.parse(localStorage.getItem("SelectedAccount"));
    const selectedCharacter = localStorage.getItem("SelectedCharacter");
    var activities = await bungie.GetActivityHistory(Misc.getPlatformType(accountInfo.platform), accountInfo.id, selectedCharacter, 1, 0);
    console.log(activities.activities[0]);
    if(activities.activities[0].activityDetails.modes.includes(5)) {
      this.setState({ previousGame: true });
      var pgcr = await bungie.GetPGCR(activities.activities[0].activityDetails.instanceId);
      for(var i in pgcr.entries) {
        var user = await this.getGlory(pgcr.entries[i].player.destinyUserInfo.displayName, pgcr.entries[i].player.destinyUserInfo.membershipType, pgcr.entries[i].player.destinyUserInfo.membershipId, pgcr.entries[i].values.team.basic.value);
        var alphaTeam = this.state.alphaTeam;
        var bravoTeam = this.state.bravoTeam;
        if(pgcr.entries[i].values.team.basic.value === 17) { if(user !== "No User" && user !== "User Private") { alphaTeam.push({ "name": user.name, "glory": user.glory, "team": pgcr.entries[i].values.team.basic.value }); } }
        else if(pgcr.entries[i].values.team.basic.value === 18) { if(user !== "No User" && user !== "User Private") { bravoTeam.push({ "name": user.name, "glory": user.glory, "team": pgcr.entries[i].values.team.basic.value }); } }
      }
      this.setState({ alphaTeam, bravoTeam });
    }
  }

  async componentDidMount() {
    if(await Checks.checkLogin()) { this.getPreviousMatch(); }
  }

  render() {
    return(
      <div className="home-content">
        <p style={{ margin: "0", fontSize: "24px" }}>Glory Check</p>
        <p style={{ margin: "0", fontSize: "24px", paddingBottom: "10px" }}>Press enter to search</p>
        <input id="Name" placeholder="Name" onKeyPress={ event => { if(event.key === 'Enter'){ this.searchForUser(event.target.value); } } } style={{ textAlign: "center" }} />
        { this.state.users !== null ? (
          this.state.users.map(function(user) {
            return <div style={{ padding: "5px", fontSize: "24px"}}>{ user.name }: { user.glory }</div>
          })
        ) : null }
        {
          this.state.previousGame === true ? (
          <div>
            <div style={{ marginTop: "20px" }}>Previous Game: </div>
            <div style={{ display: "grid", width: "500px", gridTemplateColumns: "50% 50%", margin: "auto" }}>
              <div className="alphaTeam" style={{  }}>
                <div style={{ color: "#88C4EC" }}>Alpha Team</div>
                { this.state.alphaTeam.length > 0 ? ( this.state.alphaTeam.map(function(user) { if(user.team == 17) { return <div style={{ padding: "5px"}}>{ user.name }: { user.glory }</div> } }) ) : <div>Loading...</div> }
              </div>
              <div className="bravoTeam" style={{  }}>
                <div style={{ color: "tomato" }}>Bravo Team</div>
                { this.state.bravoTeam.length > 0 ? ( this.state.bravoTeam.map(function(user) { if(user.team == 18) { return <div style={{ padding: "5px"}}>{ user.name }: { user.glory }</div> } }) ) : <div>Loading...</div> }
              </div>
            </div>
          </div>
        ) : null
      }
      { this.state.error !== null ? (<div style={{ padding: "5px", fontSize: "24px"}}>{ this.state.error }</div>) : null }
      </div>
    );
  }
}

export default GloryCheck;
