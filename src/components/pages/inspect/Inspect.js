import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as db from '../../requests/Database';
import * as bungie from '../../requests/BungieReq';
import * as UserDetails from './GenerateUserDetails';
import * as UserStatistics from './GenerateUserStatistics';
import * as UserActivities from './GenerateUserActivities';
import * as CharacterViewer from './GenerateUserCharacterView';

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
      //Grab the membershipType and MembershipId from the url bar.
      var membershipType = membershipInfo.split('/')[0];
      var membershipId = membershipInfo.split('/')[1];
      if(membershipType && membershipId) {
        if(!isNaN(membershipType) && (membershipType === '1' || membershipType === '2' || membershipType === '3' || membershipType === '4' || membershipType === '5' || membershipType === '10' || membershipType === '254')) {
          if(!isNaN(membershipId) && membershipId.length >= 19) {
            this.setState({ status: { status: 'grabbingAccountInfo', statusText: 'Inspecting their account...' } });
            try {
              //Define variables to send to inspect components
              var Manifest, profileInfo, historicStats;
              //Get the manifest and the profile information since they take the longest to get, do them together. First.
              this.setState({ status: { status: 'grabbingManifestInfo', statusText: 'Inspecting their account (1/5)' } });
              await Promise.all([
                db.getManifest(),
                bungie.GetProfile(membershipType, membershipId, '100,200,202,205,306,600,800,900'),
                bungie.GetHistoricStatsForAccount(membershipType, membershipId)
              ]).then(async function(values) {
                Manifest = values[0];
                profileInfo = values[1];
                historicStats = values[2];
              });
              //With the profile data, proceed to get the other data using the profile information.
              this.setState({ status: { status: 'grabbingActivityInfo', statusText: 'Getting recent activities (2/5)' } });
              const activities = await this.getActivities(profileInfo, membershipType, membershipId);
              this.setState({ status: { status: 'grabbingGambitInfo', statusText: 'Getting gambit statistics (3/5)' } });
              const gambitStats = await this.getGambitStats(profileInfo, membershipType, membershipId);
              this.setState({ status: { status: 'grabbingRaidInfo', statusText: 'Getting raid information (4/5)' } });
              const raidStats = await this.getRaidStats(profileInfo, membershipType, membershipId);
              //Set the state which will load the page with the data. (Make sure to parse the data though)
              this.setState({
                status: {
                  status: 'ready', statusText: 'Finished the inspection! (You shouldn\'t see this unless something went wrong)' },
                  data: { Manifest, profileInfo, historicStats, activities, gambitStats, raidStats }
              });
            }
            catch(err) { console.log(err); this.setState({ status: { status: 'error', statusText: 'Failed to load Destiny 2 account. Does this person have a Destiny 2 account?' } }); }
          }
          else { this.setState({ status: { status: 'error', statusText: 'The membershipId entered was not a valid length.' } }); }
        }
        else { this.setState({ status: { status: 'error', statusText: 'Not a valid membershipType. Must be either: 1,2,3,4,5,10,254' } }); }
      }
      else { this.setState({ status: { status: 'error', statusText: 'Something is wrong with the URL. Must contain: /{MembershipType}/{MembershipId}' } }); }
    }
  }

  async getActivities(profileInfo, membershipType, membershipId) {
    const characterIds = profileInfo.profile.data.characterIds;
    var lastPlayedTimes = new Date(profileInfo.characters.data[characterIds[0]].dateLastPlayed).getTime();
    var lastPlayedCharacter = characterIds[0]; for(var i in characterIds) { if(new Date(profileInfo.characters.data[characterIds[i]].dateLastPlayed).getTime() > lastPlayedTimes) { lastPlayedCharacter = characterIds[i]; } }
    return await bungie.GetActivityHistory(membershipType, membershipId, lastPlayedCharacter, 14, 0);
  }
  async getGambitStats(profileInfo, membershipType, membershipId) {
    const characterIds = profileInfo.profile.data.characterIds;
    var gambitData = [];
    if(characterIds.length === 1) {
      await Promise.all([ bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "64") ]).then(async function(values) {
        gambitData.push(values[0]);
      });
    }
    if(characterIds.length === 2) {
      await Promise.all([ bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "64"), bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[1], "64") ]).then(async function(values) {
        gambitData.push(values[0]);
        gambitData.push(values[1]);
      });
    }
    if(characterIds.length === 3) {
      await Promise.all([ bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "64"), bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[1], "64"), bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[2], "64") ]).then(async function(values) {
        gambitData.push(values[0]);
        gambitData.push(values[1]);
        gambitData.push(values[2]);
      });
    }
    return gambitData;
  }
  async getRaidStats(profileInfo, membershipType, membershipId) {
    const characterIds = profileInfo.profile.data.characterIds;
    var raidData = [];
    if(characterIds.length === 1) {
      await Promise.all([ bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "4") ]).then(async function(values) {
        raidData.push(values[0]);
      });
    }
    if(characterIds.length === 2) {
      await Promise.all([ bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "4"), bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[1], "4") ]).then(async function(values) {
        raidData.push(values[0]);
        raidData.push(values[1]);
      });
    }
    if(characterIds.length === 3) {
      await Promise.all([ bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "4"), bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[1], "4"), bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[2], "4") ]).then(async function(values) {
        raidData.push(values[0]);
        raidData.push(values[1]);
        raidData.push(values[2]);
      });
    }
    return raidData;
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { membershipInfo } = this.props;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      const { Manifest, profileInfo, historicStats, activities, gambitStats, raidStats } = this.state.data;
      return (
        <div className="inspectContainer">
          <div className="inspectTitlebar">
            { UserDetails.generate(profileInfo) }
            { UserStatistics.generateRanks(profileInfo) }
          </div>
          <div className="inspectContent">
            { CharacterViewer.generate(profileInfo, Manifest) }
            { UserStatistics.generate(profileInfo, Manifest, historicStats, gambitStats, raidStats) }
            { UserActivities.generate(profileInfo, membershipInfo, Manifest, activities) }
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Inspect;
