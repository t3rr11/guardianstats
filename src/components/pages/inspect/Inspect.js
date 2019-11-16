import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as UserDetails from './GenerateUserDetails';
import * as UserStatistics from './GenerateUserStatistics';
import * as UserActivities from './GenerateUserActivities';
import * as CharacterViewer from './GenerateUserCharacterView';
import * as UserChecklists from './GenerateUserChecklists';
import * as UserCollections from './GenerateUserCollections';
import * as UserClan from './GenerateUserClan';
import * as checks from '../../scripts/Checks';
import * as Misc from '../../Misc';

export class Inspect extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Looking for account...' },
    activeView: "Statistics",
    hiddenSeals: null,
    data: null
  }

  async componentDidMount() { this.startUpChecks(); }
  async startUpChecks() {
    this.setState({ status: { status: 'checkingManifest', statusText: 'Checking Manifest...' } });
    if(await checks.checkManifestMounted()) {
      const Settings = JSON.parse(localStorage.getItem("Settings"));
      this.setState({ hiddenSeals: Settings.hiddenSeals });
      this.loadProfile();
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }
  async loadProfile() {
    var { membershipInfo } = this.props;
    var isProfile = false;
    this.setState({ status: { status: 'lookingForAccount', statusText: 'Looking for account...' } });
    if(localStorage.getItem("SelectedAccount") !== "Please Select Platform") {
      if(!membershipInfo) {
        const platformType = Misc.getPlatformType(JSON.parse(localStorage.getItem("SelectedAccount")).platform);
        const membershipId = JSON.parse(localStorage.getItem("SelectedAccount")).id;
        membershipInfo = `${ platformType }/${ membershipId }`;
        isProfile = true;
      }
    }
    else { this.setState({ status: { status: 'error', statusText: 'Please select a platform first.' } }); }
    try {
      var membershipType = membershipInfo.split('/')[0];
      var membershipId = membershipInfo.split('/')[1];
      if(membershipType && membershipId) {
        if(!isNaN(membershipType) && (membershipType === '1' || membershipType === '2' || membershipType === '3' || membershipType === '4' || membershipType === '5' || membershipType === '10' || membershipType === '254')) {
          if(!isNaN(membershipId) && membershipId.length >= 19) {
            try {
              //Variables
              const Manifest = globals.MANIFEST;
              var profileInfo, historicStats, activities, gambitStats, raidStats;

              //Get the manifest and the profile information since they take the longest to get, do them together. First.
              this.setState({ status: { status: 'grabbingAccountInfo', statusText: isProfile ? 'Loading Profile...' : 'Inspecting their account...' } });
              await Promise.all([ bungie.GetProfile(membershipType, membershipId, '100,200,202,205,306,600,800,900'), bungie.GetHistoricStatsForAccount(membershipType, membershipId) ]).then(async function(promiseData) {
                //Variables
                profileInfo = promiseData[0];
                historicStats = promiseData[1];
                var characterIds = profileInfo.profile.data.characterIds;
                var lastPlayedTimes = new Date(profileInfo.characters.data[characterIds[0]].dateLastPlayed).getTime();
                var lastPlayedCharacter = characterIds[0]; for(var i in characterIds) { if(new Date(profileInfo.characters.data[characterIds[i]].dateLastPlayed).getTime() > lastPlayedTimes) { lastPlayedCharacter = characterIds[i]; } }
                if(characterIds.length === 1) {
                  await Promise.all([
                    bungie.GetActivityHistory(membershipType, membershipId, lastPlayedCharacter, 14, 0),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "64"),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "4"),
                  ]).then(async function(values) {
                    //Set variables
                    activities = values[0];
                    gambitStats = values[1];
                    raidStats = values[2];
                  });
                }
                else if(characterIds.length === 2) {
                  await Promise.all([
                    bungie.GetActivityHistory(membershipType, membershipId, lastPlayedCharacter, 14, 0),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "64"),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[1], "64"),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "4"),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[1], "4"),
                  ]).then(async function(values) {
                    //Set variables
                    activities = values[0];
                    gambitStats = [values[1], values[2]];
                    raidStats = [values[3], values[4]];
                  });
                }
                else if(characterIds.length === 3) {
                  await Promise.all([
                    bungie.GetActivityHistory(membershipType, membershipId, lastPlayedCharacter, 14, 0),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "64"),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[1], "64"),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[2], "64"),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[0], "4"),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[1], "4"),
                    bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[2], "4")
                  ]).then(async function(values) {
                    //Set variables
                    activities = values[0];
                    gambitStats = [values[1], values[2], values[3]];
                    raidStats = [values[4], values[5], values[6]];
                  });
                }
              });

              //With all data retrieved, Set page.
              this.setState({
                status: {
                  status: 'ready', statusText: 'Finished the inspection! (You shouldn\'t see this unless something went wrong, Please refresh)' },
                  data: { Manifest, profileInfo, historicStats, activities, gambitStats, raidStats }
              });
            }
            catch(err) {
              this.setState({ status: { status: 'error', statusText: 'Something went wrong... Error: ' + err } });
            }
          }
          else { this.setState({ status: { status: 'error', statusText: 'The membershipId entered was not a valid length.' } }); }
        }
        else { this.setState({ status: { status: 'error', statusText: 'Not a valid membershipType. Must be either: 1,2,3,4,5,10,254' } }); }
      }
      else { this.setState({ status: { status: 'error', statusText: 'Something went wrong... Sorry about that.' } }); }
    }
    catch (err) {
      console.log(err);
      this.setState({ status: { status: 'error', statusText: 'Please select a platform first.' } });
    }
  }
  toggleActiveView(view) { this.setState({ activeView: view }); }

  render() {
    document.body.style.backgroundImage = "var(--DarkNavyBlue)";
    
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
            { UserDetails.generate(profileInfo, this.state.hiddenSeals) }
            { UserStatistics.generateRanks(profileInfo) }
          </div>
          <div className="inspectContent">
            { CharacterViewer.generate(profileInfo, Manifest) }
            <div className="inspectBox" style={{ display: "inline-grid", gridTemplateRows: "35px auto" }}>
              <div className="inspectBoxMenu">
                <div className={ this.state.activeView === "Statistics" ? "active" : null } onClick={ (() => this.toggleActiveView("Statistics")) }>Statistics</div>
                <div className={ this.state.activeView === "Checklists" ? "active" : null } onClick={ (() => this.toggleActiveView("Checklists")) }>Checklists</div>
                <div className={ this.state.activeView === "Collections" ? "active" : null } onClick={ (() => this.toggleActiveView("Collections")) }>Collections</div>
                <div className={ this.state.activeView === "Clan" ? "active" : null } onClick={ (() => this.toggleActiveView("Clan")) }>Clan</div>
              </div>
              { this.state.activeView === "Statistics" ? ( UserStatistics.generate(profileInfo, Manifest, historicStats, gambitStats, raidStats) ) : null }
              { this.state.activeView === "Checklists" ? ( UserChecklists.generate(profileInfo, Manifest) ) : null }
              { this.state.activeView === "Collections" ? ( UserCollections.generate(profileInfo, Manifest) ) : null }
              { this.state.activeView === "Clan" ? ( UserClan.generate(profileInfo, Manifest) ) : null }
            </div>
            { UserActivities.generate(profileInfo, membershipInfo, Manifest, activities) }
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Inspect;
