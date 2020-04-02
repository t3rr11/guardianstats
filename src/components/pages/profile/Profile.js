import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as UserStatistics from './GenerateUserStatistics';
import * as UserCollections from './GenerateUserCollections';
import * as checks from '../../scripts/Checks';
import * as loadBreaks from '../../scripts/Loadbreaks';
import * as Misc from '../../Misc';

var start = null;
var checkpoint = null;

export class Profile extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Looking for account...' },
    activeView: "Statistics",
    data: null
  }

  async componentDidMount() { document.title = "Profile - Guardianstats"; loadBreaks.StartLoadBreak("profile"); this.startUpChecks(); }
  async startUpChecks() {
    this.setState({ status: { status: 'checkingManifest', statusText: 'Checking Manifest...' } });
    if(await checks.checkManifestMounted()) {
      var { membershipId } = this.props;
      if(membershipId && membershipId !== '/profile') { this.loadProfile(membershipId); }
      else {
        if(localStorage.getItem("SelectedAccount")) {
          var selectedAccount = localStorage.getItem("SelectedAccount");
          if(selectedAccount !== "Please Select Platform") { this.loadProfile(JSON.parse(selectedAccount).id); }
          else { this.setState({ status: { status: 'error', statusText: 'Please select a platform first.' } }); }
        }
        else { this.setState({ status: { status: 'error', statusText: 'Please login first or go back home and search for a player.' } }); }
      }
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }

  async loadProfile(membershipId) {
    loadBreaks.AddLoadBreak("profile", "Manifest");
    if(!isNaN(membershipId) && membershipId.length >= 19) {
      //Variables
      const Manifest = globals.MANIFEST;
      var membershipType, profileInfo, historicStats;
      var gambitStats = [];
      var raidStats = [];
      var trialsStats = [];
      var allActivities = [];
      try {
        //Check account exists
        this.setState({ status: { status: 'checkingAccountInfo', statusText: 'Checking if account exists...' } });
        const membershipInfo = await bungie.GetMembershipsById(membershipId);
        loadBreaks.AddLoadBreak("profile", "MembershipInfo");

        //Get membership type for membershipId.
        for(var i in membershipInfo.destinyMemberships) { if(membershipInfo.destinyMemberships[i].membershipId === membershipId) { membershipType = membershipInfo.destinyMemberships[i].membershipType; } }

        //Found account now get the profile information.
        this.setState({ status: { status: 'grabbingAccountInfo', statusText: this.props.membershipId !== '/profile' ? 'Inspecting their account...' : 'Inspecting your account...' } });
        await Promise.all([
          bungie.GetProfile(membershipType, membershipId, '100,200,202,205,306,600,800,900,1100'),
          bungie.GetHistoricStatsForAccount(membershipType, membershipId)
        ]).then(async function(promiseData) {
          loadBreaks.AddLoadBreak("profile", "Profile and Historic Stats");
          //Variables
          profileInfo = promiseData[0];
          historicStats = promiseData[1];
          var characterIds = profileInfo.profile.data.characterIds;

          //Loop through characters and get specific mode stats.
          for(var j in characterIds) {
            await Promise.all([
              bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[j], "64"),
              bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[j], "4"),
              bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[j], "84"),
              bungie.GetActivityHistory(membershipType, membershipId, characterIds[j], 200, 5),
            ]).then(async function(values) {
              gambitStats.push(values[0]);
              raidStats.push(values[1]);
              trialsStats.push(values[2]);
              if(values[3]) { for(var k in values[3].activities) { allActivities.push(values[3].activities[k]); } }
            });
          }
          loadBreaks.AddLoadBreak("profile", "Specific Mode Stats");
          document.title = `${ profileInfo.profile.data.userInfo.displayName }'s Profile - Guardianstats`;
        });

        if(allActivities.length > 0) {
          //Do hacker check
          var isHacker = false;
          // for(var i in allActivities) {
          //   console.log(allActivities[i].values.deaths.basic.value);
          //   if(allActivities[i].values.deaths.basic.value > 50) { isHacker = true }
          // }

          //With all data retrieved, Set page.
          this.setState({
            status: {
              status: 'ready', statusText: 'Finished the inspection! (You shouldn\'t see this unless something went wrong, Please refresh)' },
              data: { Manifest, profileInfo, historicStats, gambitStats, raidStats, trialsStats, isHacker }
          });
        }
        else {
          //Page is private. Return private message.
          this.setState({ status: { status: 'private', statusText: 'This user has their account privated. I wonder what they are hiding...' } });
        }
        loadBreaks.AddLoadBreak("profile", "Whole Page");
        loadBreaks.StopLoadBreak("profile");
      }
      catch(err) {
        if(Misc.isJSON(err)) { var error = JSON.parse(err); this.setState({ status: { status: 'error', statusText: 'Something went wrong... Error: ' + error.Message } }); }
        else { this.setState({ status: { status: 'error', statusText: 'Something went wrong... Error: ' + err } }); }
      }
    }
    else {
      //Membership ID is Not a number or has a length of 19 characters.
      this.setState({ status: { status: 'error', statusText: 'The membership_id entered is not valid. How did you get here?' } });
    }
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'private') {
      return (
        <div className="inspectPrivateUser">
          <img src="./images/icons/ghost.png" />
          <div>
            <div>{ statusText }</div>
            <div><Link to="/home">Go Home</Link></div>
          </div>
        </div>
      )
    }
    else if(status === 'ready') {
      const { Manifest, profileInfo, historicStats, gambitStats, raidStats, trialsStats, isHacker } = this.state.data;
      return (
        <div className="inspectContainer">
          <div className="inspectContent">
            <div className="inspectBox">
              <div className="userContainer">
                { UserStatistics.generate(profileInfo, Manifest, historicStats, gambitStats, raidStats, trialsStats, isHacker, this.props) }
                { UserCollections.generate(profileInfo, Manifest) }
              </div>
            </div>
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Profile;
