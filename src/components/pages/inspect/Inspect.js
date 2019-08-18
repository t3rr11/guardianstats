import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as db from '../../requests/Database';
import * as bungie from '../../requests/BungieReq';
import * as UserDetails from './GenerateUserDetails';
import * as UserStatistics from './GenerateUserStatistics';
import * as UserActivities from './GenerateUserActivities';
import * as UserTriumphs from './GenerateUserTriumphs';
import * as UserEvents from './GenerateUserEvents';

export class Inspect extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading text here...' },
    data: null
  }

  async componentDidMount() {
    const { membershipInfo } = this.props;
    this.setState({ status: { status: 'lookingForAccount', statusText: 'Looking for account...' } });
    if(!membershipInfo) { this.setState({ status: { status: 'error', statusText: 'Nobody to inspect... Try going back home and search for someone.' } }); }
    else {
      var membershipType = membershipInfo.split('/')[0];
      var membershipId = membershipInfo.split('/')[1];
      if(membershipType && membershipId) {
        if(!isNaN(membershipType) && (membershipType === '1' || membershipType === '2' || membershipType === '3' || membershipType === '4' || membershipType === '5' || membershipType === '10' || membershipType === '254')) {
          if(!isNaN(membershipId) && membershipId.length >= 19) {
            this.setState({ status: { status: 'grabbingAccountInfo', statusText: 'Inspecting their account...' } });
            try {
              const ManifestActivities = await this.getManifestData();
              const profileInfo = await bungie.GetProfile(membershipType, membershipId, '100,200,202,600,800,900');
              const activities = await this.getActities(profileInfo, membershipType, membershipId);
              this.setState({ status: { status: 'ready', statusText: 'Finished the inspection!' }, data: { profileInfo, ManifestActivities, activities } });
            }
            catch(err) { this.setState({ status: { status: 'error', statusText: 'Couldn\'t find manifest.' } }); }
          }
          else { this.setState({ status: { status: 'error', statusText: 'The membershipId entered was not a valid length.' } }); }
        }
        else { this.setState({ status: { status: 'error', statusText: 'Not a valid membershipType. Must be either: 1,2,3,4,5,10,254' } }); }
      }
      else { this.setState({ status: { status: 'error', statusText: 'Something is wrong with the URL. Must contain: /{MembershipType}/{MembershipId}' } }); }
    }
  }

  async getManifestData() { return db.getActivityDefinition(); }
  async getActities(profileInfo, membershipType, membershipId) {
    const characterIds = profileInfo.profile.data.characterIds;
    var lastPlayedTimes = new Date(profileInfo.characters.data[characterIds[0]].dateLastPlayed).getTime();
    var lastPlayedCharacter = characterIds[0]; for(var i in characterIds) { if(new Date(profileInfo.characters.data[characterIds[i]].dateLastPlayed).getTime() > lastPlayedTimes) { lastPlayedCharacter = characterIds[i]; } }
    return await bungie.GetActivityHistory(membershipType, membershipId, lastPlayedCharacter, 15, 0);
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { membershipInfo } = this.props;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      const { profileInfo, ManifestActivities, activities } = this.state.data;
      return (
        <div className="inspectContainer scrollbar hideOverflow">
          <div className="inspectTitlebar">{ UserDetails.generate(profileInfo) }</div>
          <div className="inspectContent">
            { UserActivities.generate(profileInfo, membershipInfo, ManifestActivities, activities) }
            { UserStatistics.generate(profileInfo) }
            { UserTriumphs.generate(profileInfo) }
            { UserEvents.generate(profileInfo) }
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Inspect;
