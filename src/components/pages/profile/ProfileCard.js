import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import * as Misc from '../../Misc';
import * as UserStatistics from './GenerateUserStatistics';
import * as loadBreaks from '../../scripts/Loadbreaks';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';

export class ProfileCard extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Profile Card...' },
    previousProfileCards: [],
    profileCard: null
  }

  async componentDidMount() {
    //On component load we want to process the profile from props.
    await this.setState({
      status: { status: 'startUp', statusText: 'Loading Profile Card...' },
      profileCard: { characterId: this.props.data.characterId, membershipId: this.props.data.membershipId, membershipType: this.props.data.membershipType }
    });
    this.loadProfileCard();
  }
  async componentDidUpdate() {
    //If props updated usually responding to clicks then update the state again.
    if(this.state.profileCard.membershipId !== this.props.data.membershipId) {
      const previousProfileCards = this.state.previousProfileCards;
      const previousProfileCard = this.state.profileCard;
      if(previousProfileCard.profileInfo) { if(!previousProfileCards.find(e => e.membershipId === previousProfileCard.membershipId)) { previousProfileCards.push(previousProfileCard); } }
      await this.setState({
        status: { status: 'startUp', statusText: 'Loading Profile Card...' },
        profileCard: { characterId: this.props.data.characterId, membershipId: this.props.data.membershipId, membershipType: this.props.data.membershipType },
        previousProfileCards
      });
      this.loadProfileCard();
    }
  }
  async loadProfileCard() {
    //Variables
    loadBreaks.StartLoadBreak("profileCard");
    const Manifest = globals.MANIFEST;
    const previousProfileCards = this.state.previousProfileCards;
    var characterId = this.state.profileCard.characterId;
    var membershipId = this.state.profileCard.membershipId;
    var membershipType = this.state.profileCard.membershipType;
    var profileInfo, historicStats, metrics;
    var allActivities = [];
    if(previousProfileCards.find(e => e.membershipId === membershipId)) {
      //Found account, load old data to save requests and time.
      var previousAccountData = previousProfileCards.find(e => e.membershipId === membershipId);
      this.setState({
        status: {
          status: 'ready', statusText: 'Finished the inspection! (You shouldn\'t see this unless something went wrong, Please refresh)' },
          profileCard: previousAccountData
      });
    }
    else {
      //New account, load data.
      try {
        //Found account now get the profile information.
        this.setState({ status: { status: 'grabbingAccountInfo', statusText: "Getting account information..." } });
        await Promise.all([
          bungie.GetProfile(membershipType, membershipId, '100,200,202,1100'),
          bungie.GetHistoricStatsForAccount(membershipType, membershipId)
        ]).then(async function(promiseData) {
          loadBreaks.AddLoadBreak("profileCard", "Profile and Historic Stats");
          //Variables
          profileInfo = promiseData[0];
          historicStats = promiseData[1];
          var characterIds = profileInfo.profile.data.characterIds;

          //Loop through characters and get recent activities.

          //This is disabled due to needing the speed for testing.
          allActivities = [1];

          // if(characterIds.length === 1) {
          //   await Promise.all([
          //     bungie.GetActivityHistory(membershipType, membershipId, characterIds[0], 200, 5)
          //   ]).then(async function(values) {
          //     if(values[0]) { for(var j in values[0].activities) { allActivities.push(values[0].activities[j]); } }
          //   });
          // }
          // else if(characterIds.length === 2) {
          //   await Promise.all([
          //     bungie.GetActivityHistory(membershipType, membershipId, characterIds[0], 200, 5),
          //     bungie.GetActivityHistory(membershipType, membershipId, characterIds[1], 200, 5)
          //   ]).then(async function(values) {
          //     if(values[0]) { for(var j in values[0].activities) { allActivities.push(values[0].activities[j]); } }
          //     if(values[1]) { for(var k in values[1].activities) { allActivities.push(values[1].activities[k]); } }
          //   });
          // }
          // else if(characterIds.length === 3) {
          //   await Promise.all([
          //     bungie.GetActivityHistory(membershipType, membershipId, characterIds[0], 200, 5),
          //     bungie.GetActivityHistory(membershipType, membershipId, characterIds[1], 200, 5),
          //     bungie.GetActivityHistory(membershipType, membershipId, characterIds[2], 200, 5)
          //   ]).then(async function(values) {
          //     if(values[0]) { for(var j in values[0].activities) { allActivities.push(values[0].activities[j]); } }
          //     if(values[1]) { for(var k in values[1].activities) { allActivities.push(values[1].activities[k]); } }
          //     if(values[2]) { for(var l in values[2].activities) { allActivities.push(values[2].activities[l]); } }
          //   });
          // }
          // loadBreaks.AddLoadBreak("profileCard", "Activities");
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
              profileCard: { characterId, membershipId, membershipType, profileInfo, historicStats, isHacker }
          });
        }
        else {
          //Page is private. Return private message.
          this.setState({ status: { status: 'private', statusText: 'This user has their account privated. I wonder what they are hiding...' } });
        }
        loadBreaks.AddLoadBreak("profileCard", "Whole Page");
        loadBreaks.StopLoadBreak("profileCard");
      }
      catch (err) { console.log(err); this.setState({ status: { status: 'error', statusText: 'Failed to load profile card due to: ' + JSON.stringify(err) } }); }
    }
  }

  render() {
    const { status, statusText } = this.state.status;
    if(status === "ready") {
      const { characterId, membershipId, membershipType, profileInfo, historicStats } = this.state.profileCard;
      const characterData = profileInfo.characters.data[characterId];
      console.log(profileInfo.metrics.data.metrics[871184140].objectiveProgress);
      return(
        <div className="profile-card-container">
          <div className="profile-card-data">
            <div key={ `${ characterId }_emblem` } className="profile-card-banner-info" style={{ backgroundImage: `url("https://bungie.net${ characterData.emblemBackgroundPath }")` }}>
              <h4 id="display-name">{ profileInfo.profile.data.userInfo.displayName }</h4>
              <span id="character-class">{ Misc.getClassName(characterData.classType) }</span>
              <h3 id="character-light-level"><span id="light-level-icon">✧</span>{ characterData.light }</h3>
              <h5 id="season-rank"><span id="season-rank-icon">SR</span>{ profileInfo.metrics.data.metrics[2076844101].objectiveProgress.progress }</h5>
            </div>
            <div className="profile-card-info">
              { UserStatistics.generateRanks(profileInfo, 100) }
              <div className="profile-card-sub-info">
                <div id="view-profile-btn">View Activities</div>
                <div id="view-profile-btn">View Full Profile</div>
              </div>
            </div>
            <div className="profile-card-main-info">
              <div className="profile-card-main-info-left">
                <div className="profile-card-info-title">Statistics - Overall</div>
                <div className="profile-card-info-content">
                  <div>Kills: { Misc.numberWithCommas(historicStats.mergedAllCharacters.results.allPvP.allTime.kills.basic.displayValue) }</div>
                  <div>KD: { historicStats.mergedAllCharacters.results.allPvP.allTime.killsDeathsRatio.basic.displayValue }</div>
                </div>
              </div>
              <div className="profile-card-main-info-right">
                <div className="profile-card-info-title">Statistics - Seasonal</div>
                <div className="profile-card-info-content">
                  <div>Kills: { Misc.numberWithCommas(profileInfo.metrics.data.metrics[2935221077].objectiveProgress.progress) }</div>
                  <div>KD: { profileInfo.metrics.data.metrics[871184140].objectiveProgress.progress / 100 }</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return(
        <div className="profile-card-container">
          <div className="profile-card-data">
            <Loader statusText={ statusText } />
          </div>
        </div>
      );
    }
  }
}

export default ProfileCard;
