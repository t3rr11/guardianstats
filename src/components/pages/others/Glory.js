import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import qs from 'query-string';

import * as bungie from '../../requests/BungieReq';

export class Register extends Component {

  state = {
    users: null,
    error: null
  }

  async searchForUser(user) {
    this.setState({ error: "Checking...", users: null });
    var userdata = await bungie.GetMembershipId(user);
    if(userdata.length > 0) {
      var users = [];
      for(var i in userdata) {
        var data = await this.getGlory(userdata[i].displayName, userdata[i].membershipType, userdata[i].membershipId);
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
  async getGlory(name, membershipType, membershipId) {
    var userdata = await bungie.GetProfile(membershipType, membershipId, "100,202");
    if(userdata === undefined) { return "No User" }
    else if(Object.keys(userdata.characterProgressions.data).length > 0) {
      var characters = userdata.profile.data.characterIds;
      var name = userdata.profile.data.userInfo.displayName;
      var glory = userdata.characterProgressions.data[characters[0]].progressions[2679551909].currentProgress;
      return { name, glory };
    }
    else { return "User Private"; }
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
        { this.state.error !== null ? (<div style={{ padding: "5px", fontSize: "24px"}}>{ this.state.error }</div>) : null }
      </div>
    );
  }
}

export default Register;
