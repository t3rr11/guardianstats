import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as UserDetails from '../inspect/GenerateUserDetails';
import * as UserStatistics from '../inspect/GenerateUserStatistics';
import * as Milestones from './GenerateMilestones';

import { startUpPageChecks } from '../../scripts/Checks';

export class Profile extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading text here...' },
    data: null
  }

  async componentDidMount() {
    if(await startUpPageChecks() === "Checks OK") {
      this.setState({ status: { status: 'grabbingAccountInfo', statusText: 'Loading Profile...' } });
      const membershipInfo = JSON.parse(localStorage.getItem("BasicMembershipInfo"));
      const membershipType = membershipInfo.membershipType;
      const membershipId = membershipInfo.membershipId;
      const Manifest = globals.MANIFEST;
      try {
        const profileInfo = await bungie.GetProfile(membershipType, membershipId, '100,200,201,202,205,306,600,800,900', true);
        var characterIds = profileInfo.profile.data.characterIds;
        var lastPlayedTimes = new Date(profileInfo.characters.data[characterIds[0]].dateLastPlayed).getTime();
        var lastPlayedCharacter = characterIds[0]; for(var i in characterIds) { if(new Date(profileInfo.characters.data[characterIds[i]].dateLastPlayed).getTime() > lastPlayedTimes) { lastPlayedCharacter = characterIds[i]; } }

        //With all data retrieved, Set page.
        this.setState({
          status: { status: 'ready', statusText: 'Finished Loading!' },
          data: { Manifest, profileInfo, lastPlayedCharacter }
        });
      }
      catch (err) {
        console.log(err);
        if(err.includes("Failed to fetch")) { this.setState({ status: { status: 'error', statusText: 'Failed to load Destiny 2 account. Failed to Fetch, Try again in 5 minutes.' } }); }
        else if(err.includes("maintenance")) { this.setState({ status: { status: 'error', statusText: 'The Destiny 2 API is down for Maintenance' } }); }
        else { this.setState({ status: { status: 'error', statusText: 'Something went wrong... Error: ' + err } }); }
      }
    }
  }

  render() {
    const { status, statusText } = this.state.status;
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      const { Manifest, profileInfo, lastPlayedCharacter } = this.state.data;
      return (
        <div className="profileContainer">
          <div className="profileTitlebar">
            { UserDetails.generate(profileInfo) }
            { UserStatistics.generateRanks(profileInfo) }
          </div>
          <div className="profileContent">
            { Milestones.generate(profileInfo, lastPlayedCharacter) }
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Profile;
