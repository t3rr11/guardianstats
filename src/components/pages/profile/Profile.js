import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as UserStatistics from './GenerateUserStatistics';
import * as UserCollections from './GenerateUserCollections';
import * as checks from '../../scripts/Checks';
import * as Misc from '../../Misc';

export class Profile extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Looking for account...' },
    activeView: "Statistics",
    data: null
  }

  async componentDidMount() { document.title = "Profile - Guardianstats"; this.startUpChecks(); }
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
    if(!isNaN(membershipId) && membershipId.length >= 19) {
      //Variables
      const Manifest = globals.MANIFEST;
      var membershipType, profileInfo, historicStats;
      var gambitStats = [];
      var raidStats = [];
      try {
        //Check account exists
        this.setState({ status: { status: 'checkingAccountInfo', statusText: 'Checking if account exists...' } });
        const membershipInfo = await bungie.GetMembershipsById(membershipId);
        //Get membership type for membershipId.
        for(var i in membershipInfo.destinyMemberships) { if(membershipInfo.destinyMemberships[i].membershipId === membershipId) { membershipType = membershipInfo.destinyMemberships[i].membershipType; } }

        //Found account now get the profile information.
        this.setState({ status: { status: 'grabbingAccountInfo', statusText: this.props.membershipId !== '/profile' ? 'Inspecting their account...' : 'Inspecting your account...' } });
        await Promise.all([ bungie.GetProfile(membershipType, membershipId, '100,200,202,205,306,600,800,900'), bungie.GetHistoricStatsForAccount(membershipType, membershipId) ]).then(async function(promiseData) {
          //Variables
          profileInfo = promiseData[0];
          console.log(profileInfo);
          historicStats = promiseData[1];
          var characterIds = profileInfo.profile.data.characterIds;
          for(var j in characterIds) {
            await Promise.all([ bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[j], "64"), bungie.GetSpecificModeStats(membershipId, membershipType, characterIds[j], "4"), ]).then(async function(values) {
              gambitStats.push(values[0]);
              raidStats.push(values[1]);
            });
          }
          document.title = `${ profileInfo.profile.data.userInfo.displayName }'s Profile - Guardianstats`;
        });

        //With all data retrieved, Set page.
        this.setState({
          status: {
            status: 'ready', statusText: 'Finished the inspection! (You shouldn\'t see this unless something went wrong, Please refresh)' },
            data: { Manifest, profileInfo, historicStats, gambitStats, raidStats }
        });
      }
      catch(err) {
        if(Misc.isJSON(err)) { var error = JSON.parse(err); this.setState({ status: { status: 'error', statusText: 'Something went wrong... Error: ' + error.Message } }); }
        else { this.setState({ status: { status: 'error', statusText: 'Something went wrong... Error: ' + err } }); }
      }
    }
    else {
      //Membership ID is Not a number or has a length of 19 characters.
    }
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      const { Manifest, profileInfo, historicStats, gambitStats, raidStats } = this.state.data;
      return (
        <div className="inspectContainer">
          <div className="inspectContent">
            <div className="inspectBox">
              <div className="userContainer">
                { UserStatistics.generate(profileInfo, Manifest, historicStats, gambitStats, raidStats, this.props) }
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
