import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../modules/Loader';
import * as Misc from '../../Misc';
import * as UserStatistics from './GenerateUserStatistics';
import * as UserDetails from './GenerateUserDetails';
import * as loadBreaks from '../../scripts/Loadbreaks';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as api from '../../requests/Api';

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
    var profileInfo, historicStats, metrics, timePlayed, statusTags;
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
          bungie.GetProfile(membershipType, membershipId, '100,200,202,900,1100'),
          bungie.GetHistoricStatsForAccount(membershipType, membershipId),
          api.CheckIfPatreon(membershipId)
        ]).then(async function(promiseData) {
          loadBreaks.AddLoadBreak("profileCard", "Profile and Historic Stats");
          //Variables
          profileInfo = promiseData[0];
          historicStats = promiseData[1];
          timePlayed = 0;
          if(promiseData[2].data) { statusTags = Misc.convertStatusTags(promiseData[2].data[0]); } else { statusTags = Misc.convertStatusTags(); }
          var characterIds = profileInfo.profile.data.characterIds;

          for(let i in characterIds) { timePlayed = parseInt(timePlayed) + parseInt(profileInfo.characters.data[characterIds[i]].minutesPlayedTotal); }

          //Loop through characters and get recent activities.
          if(characterIds.length === 1) {
            await Promise.all([
              bungie.GetActivityHistory(membershipType, membershipId, characterIds[0], 200, 5)
            ]).then(async function(values) {
              if(values[0]) { for(var j in values[0].activities) { allActivities.push(values[0].activities[j]); } }
            });
          }
          else if(characterIds.length === 2) {
            await Promise.all([
              bungie.GetActivityHistory(membershipType, membershipId, characterIds[0], 200, 5),
              bungie.GetActivityHistory(membershipType, membershipId, characterIds[1], 200, 5)
            ]).then(async function(values) {
              if(values[0]) { for(var j in values[0].activities) { allActivities.push(values[0].activities[j]); } }
              if(values[1]) { for(var k in values[1].activities) { allActivities.push(values[1].activities[k]); } }
            });
          }
          else if(characterIds.length === 3) {
            await Promise.all([
              bungie.GetActivityHistory(membershipType, membershipId, characterIds[0], 200, 5),
              bungie.GetActivityHistory(membershipType, membershipId, characterIds[1], 200, 5),
              bungie.GetActivityHistory(membershipType, membershipId, characterIds[2], 200, 5)
            ]).then(async function(values) {
              if(values[0]) { for(var j in values[0].activities) { allActivities.push(values[0].activities[j]); } }
              if(values[1]) { for(var k in values[1].activities) { allActivities.push(values[1].activities[k]); } }
              if(values[2]) { for(var l in values[2].activities) { allActivities.push(values[2].activities[l]); } }
            });
          }
          loadBreaks.AddLoadBreak("profileCard", "Activities");
        });

        if(allActivities.length > 0) {
          //Do hacker check
          var isHacker = false;
          // for(var i in allActivities) {
          //   if(allActivities[i].values.deaths.basic.value > 50) { isHacker = true }
          // }

          //Check if account is private
          if(profileInfo.characterProgressions.data) {
            //With all data retrieved, Set page.
            this.setState({
              status: {
                status: 'ready', statusText: 'Finished the inspection! (You shouldn\'t see this unless something went wrong, Please refresh)' },
                profileCard: { characterId, membershipId, membershipType, profileInfo, historicStats, statusTags, timePlayed, isHacker }
            });
          }
          else { this.setState({ status: { status: 'private', statusText: 'This user has their account privated. I wonder what they are hiding...' } }); }
        }
        else { this.setState({ status: { status: 'private', statusText: 'This user has their account privated. I wonder what they are hiding...' } }); }
        loadBreaks.AddLoadBreak("profileCard", "Whole Page");
        loadBreaks.StopLoadBreak("profileCard");
      }
      catch (err) { console.log(err); this.setState({ status: { status: 'error', statusText: 'Failed to load profile card due to: ' + JSON.stringify(err) } }); }
    }
  }

  render() {
    const { status, statusText } = this.state.status;
    if(status === "ready") {
      const { characterId, membershipId, membershipType, profileInfo, historicStats, statusTags, timePlayed, isHacker } = this.state.profileCard;
      const characterData = profileInfo.characters.data[characterId];
      const trialsWins = profileInfo.characterProgressions.data[characterId].progressions[1062449239].level;
      const trialsLoses = profileInfo.characterProgressions.data[characterId].progressions[2093709363].level;
      const displayWins = () => {
        let divs = [];
        for(let i = 0; i < trialsWins; i++) { divs.push(<div className="trials-win-box"></div>) }
        for(let i = 0; i < 7 - trialsWins; i++) { divs.push(<div className="trials-neutral-box"></div>) }
        return divs;
      }
      const displayLoses = () => {
        let divs = [];
        for(let i = 0; i < trialsLoses; i++) { divs.push(<div className="trials-loss-box"></div>) }
        for(let i = 0; i < 3 - trialsLoses; i++) { divs.push(<div className="trials-neutral-box"></div>) }
        return divs;
      }
      return (
        <div className="profile-card-container">
          <div className="profile-card-data">
            <div key={ `${ characterId }_emblem` } className="profile-card-banner-info" style={{ backgroundImage: `url("https://bungie.net${ characterData.emblemBackgroundPath }")` }}>
              <div id="display-name">
                <h4>{ profileInfo.profile.data.userInfo.displayName }</h4>
                <div className="status-tags">
                  {
                    Object.keys(statusTags).map((statusTag) => {
                      if(statusTags[statusTag].hasLink) { return ( statusTags[statusTag].hasTag ? (<div id={ statusTags[statusTag].id }><a href={ statusTags[statusTag].link } target="_blank">{ statusTags[statusTag].name }</a></div>) : null ) }
                      else { return ( statusTags[statusTag].hasTag ? (<div id={ statusTags[statusTag].id }>{ statusTags[statusTag].name }</div>) : null ) }
                    })
                  }
                </div>
              </div>
              <span id="character-class">{ Misc.getClassName(characterData.classType) }</span>
              <span id="character-timePlayed">{ Misc.AddCommas(Math.round(timePlayed / 60)) } Hrs</span>
              <h3 id="character-light-level"><span id="light-level-icon">✧</span>{ characterData.light }</h3>
              <h5 id="season-rank"><span id="season-rank-icon">SR</span>{ profileInfo.metrics.data.metrics[2076844101].objectiveProgress.progress }</h5>
            </div>
            <div className="profile-card-info">
              <div className="inspectTitles"> { UserDetails.getTitles(profileInfo) } </div>
              { UserStatistics.generateRanks(profileInfo, 100) }
              <div className="profile-card-sub-info">
                <a href={`/activities/${ membershipId }`} id="full-view-btn">View Activities</a>
                <Link to={`/profile/${ membershipId }`} id="full-view-btn">View Full Profile</Link>
              </div>
            </div>
            <div className="profile-card-main-info">
              <div className="profile-card-main-info-crucible">
                <div className="profile-card-main-info-crucible-left">
                  <div className="profile-card-info-title">Crucible Overall</div>
                  <div className="profile-card-info-content">
                    <div>Kills: { Misc.AddCommas(historicStats.mergedAllCharacters.results.allPvP.allTime.kills.basic.displayValue) }</div>
                    <div>KD: { historicStats.mergedAllCharacters.results.allPvP.allTime.killsDeathsRatio.basic.displayValue }</div>
                  </div>
                </div>
                <div className="profile-card-main-info-crucible-right">
                  <div className="profile-card-info-title">Crucible Seasonal</div>
                  <div className="profile-card-info-content">
                    <div>Kills: { Misc.AddCommas(profileInfo.metrics.data.metrics[2935221077].objectiveProgress.progress) }</div>
                    <div>KD: { profileInfo.metrics.data.metrics[871184140].objectiveProgress.progress / 100 }</div>
                  </div>
                </div>
              </div>
              <div className="profile-card-main-info-trials">
                <div className="profile-card-main-info-trials-left">
                  <div className="profile-card-info-title">Trials Overall</div>
                  <div className="profile-card-info-content">
                    <div>Kills: { Misc.AddCommas(profileInfo.metrics.data.metrics[2082314848].objectiveProgress.progress) }</div>
                    <div>Wins: { Misc.AddCommas(profileInfo.metrics.data.metrics[1365664208].objectiveProgress.progress) }</div>
                    <div>Flawless: { Misc.AddCommas(profileInfo.metrics.data.metrics[1765255052].objectiveProgress.progress) }</div>
                  </div>
                </div>
                <div className="profile-card-main-info-trials-mid">
                  <div className="profile-card-info-title">Trials Seasonal</div>
                  <div className="profile-card-info-content">
                    <div>Kills: { Misc.AddCommas(profileInfo.metrics.data.metrics[3481560625].objectiveProgress.progress) }</div>
                    <div>Wins: { Misc.AddCommas(profileInfo.metrics.data.metrics[2367472811].objectiveProgress.progress) }</div>
                    <div>Flawless: { Misc.AddCommas(profileInfo.metrics.data.metrics[1114483243].objectiveProgress.progress) }</div>
                  </div>
                </div>
                <div className="profile-card-main-info-trials-right">
                  <div className="profile-card-info-title">Trials Weekly</div>
                  <div className="profile-card-info-content">
                    <div>Kills: { Misc.AddCommas(profileInfo.metrics.data.metrics[2091173752].objectiveProgress.progress) }</div>
                    <div>Wins: { Misc.AddCommas(profileInfo.metrics.data.metrics[3046315288].objectiveProgress.progress) }</div>
                    <div>Flawless: { Misc.AddCommas(profileInfo.metrics.data.metrics[122451876].objectiveProgress.progress) }</div>
                  </div>
                </div>
              </div>
              <div className="profile-card-main-info-trials-card">
                <div className="profile-card-info-title">Card Progress</div>
                <div className="profile-card-info-content">
                  <div className="trials-win-boxes">
                    { displayWins() }
                  </div>
                  <div className="trials-loss-boxes">
                    { displayLoses() }
                  </div>
                </div>
              </div>
              <div id="close-view-btn" onClick={ (() => this.props.closeProfileCard()) }>Close</div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
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
