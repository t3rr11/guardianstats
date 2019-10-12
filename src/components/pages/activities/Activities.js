import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

import { modeTypes } from '../../scripts/ModeTypes';
import * as checks from '../../scripts/Checks';
import * as globals from '../../scripts/Globals';
import * as profileHelper from '../../scripts/ProfileHelper';
import * as bungie from '../../requests/BungieReq';
import * as PGCRGeneration from './PGCRGeneration';
import * as Misc from '../../Misc';

var ActivityWatcher = null;

export class Activities extends Component {
  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading recent activites...' },
    activities: { },
    currentActivity : null,
    ManifestActivities: null,
    ManifestItems: null,
    PGCRs: { }
  }

  async componentDidMount() { this.startUpChecks(); this.startActivityTimer(); }
  async componentWillUnmount() { this.stopActivityTimer('Activity'); }

  async startUpChecks() {
    this.setState({ status: { status: 'checkingManifest', statusText: 'Checking Manifest...' } });
    if(await checks.checkManifestMounted()) {
      this.setState({ status: { status: 'gettingPGCRs', statusText: 'Getting battle reports...' } });
      if(localStorage.getItem("SelectedAccount") !== "Please Select Platform") { this.grabActivityData(); }
      else { this.setState({ status: { status: 'error', statusText: 'Please select a platform first.' } }); }
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }

  async makeActiveDisplay(instanceId) { this.setState({ currentActivity: parseInt(instanceId) }); }
  setSelectedCharacter(profileInfo) {
    if(!localStorage.getItem("SelectedCharacter")) {
      var characterIds = profileInfo.profile.data.characterIds;
      var lastPlayedTimes = new Date(profileInfo.characters.data[characterIds[0]].dateLastPlayed).getTime();
      var lastPlayedCharacter = characterIds[0]; for(var i in characterIds) { if(new Date(profileInfo.characters.data[characterIds[i]].dateLastPlayed).getTime() > lastPlayedTimes) { lastPlayedCharacter = characterIds[i]; } }
      localStorage.setItem("SelectedCharacter", lastPlayedCharacter);
      return lastPlayedCharacter;
    }
    else {
      return localStorage.getItem("SelectedCharacter");
    }
  }
  async grabActivityData() {
    const accountInfo = JSON.parse(localStorage.getItem("SelectedAccount"));
    const profileInfo = await bungie.GetProfile(Misc.getPlatformType(accountInfo.platform), accountInfo.id, '100,200');
    const selectedCharacter = localStorage.getItem("SelectedCharacter");
    const activityData = await bungie.GetActivityHistory(Misc.getPlatformType(accountInfo.platform), accountInfo.id, selectedCharacter, 15, 0);
    this.setState({
      status: { status: 'gettingPGCRs', 'statusText': 'Getting battle reports...' },
      activities: activityData.activities,
      currentActivity: parseInt(activityData.activities[0].activityDetails.instanceId)
    });
    this.grabPGCRs(activityData.activities, null);
  }
  async grabPGCRs(activities, newActivitiesArray) {
    var PGCRs = this.state.PGCRs;
    var count = 0;
    for(var i in activities) {
      bungie.GetPGCR(activities[i].activityDetails.instanceId).then((pgcr) => { //eslint-disable-line no-loop-func
        count++;
        this.setState({ status: { status: 'gettingPGCRs', 'statusText': `Getting battle reports ${ count } / ${ activities.length }` } });
        PGCRs[pgcr.activityDetails.instanceId] = pgcr;
        if(count === activities.length) { this.finishedGrabbingPGCRs(PGCRs, newActivitiesArray); }
      }, this);
    }
  }
  finishedGrabbingPGCRs(PGCRs, newActivitiesArray) {
    if(newActivitiesArray !== null) {
      this.setState({
        status: { status: 'ready', statusText: 'Finished loading...' },
        activities: newActivitiesArray,
        currentActivity: parseInt(newActivitiesArray[0].activityDetails.instanceId),
        PGCRs
      });
    }
    else {
      this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, PGCRs });
    }
  }
  addCompletedClass(activity) {
    const isSelected = this.state.currentActivity === parseInt(activity.activityDetails.instanceId) ? 'activeDisplay' : "";
    if(activity.activityDetails.mode !== 6) {
      if(activity.values.standing) {
        const completed = activity.values.standing.basic.value === 0 ? 'completed' : 'failed';
        return `leftActivityContainer ${ completed } ${ isSelected }`;
      }
      else {
        if(activity.values.completed) {
          const completed = activity.values.completed.basic.value === 1 ? 'completed' : 'failed';
          return `leftActivityContainer ${ completed } ${ isSelected }`;
        }
        else { return `leftActivityContainer neutral ${ isSelected }`; }
      }
    }
    else { return `leftActivityContainer completed ${ isSelected }`; }
  }
  //Timers
  startActivityTimer() { ActivityWatcher = setInterval(this.checkActivityUpdates, 30000); console.log('Activity Watcher Started.'); }
  stopActivityTimer() { clearInterval(ActivityWatcher); ActivityWatcher = null; console.log('Activity Watcher Stopped'); }
  checkActivityUpdates = async () => {
    const accountInfo = JSON.parse(localStorage.getItem("SelectedAccount"));
    const profileInfo = await bungie.GetProfile(Misc.getPlatformType(accountInfo.platform), accountInfo.id, '100,200');
    const selectedCharacter = localStorage.getItem("SelectedCharacter");
    const previousActivities = this.state.activities;
    const recentActivityData = (await bungie.GetActivityHistory(Misc.getPlatformType(accountInfo.platform), accountInfo.id, selectedCharacter, 15, 0)).activities;
    var newActivities = [];
    var updatesFound = 0;
    recentActivityData.map(function(activity) {
      if(!previousActivities.find(ad => ad.period === activity.period)) {
        newActivities.push(activity);
        updatesFound++;
      }
      return true;
    }, this);
    if(updatesFound > 0) {
      var newActivitiesArray = previousActivities;
      for(var i in newActivities) { newActivitiesArray.unshift(newActivities[i]) }
      console.log('Found: ' + updatesFound + " new activities.");
      this.grabPGCRs(newActivities, newActivitiesArray);
    }
  }
  async changeCharacter(characterId) { localStorage.setItem('SelectedCharacter', characterId); window.location.reload(); }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { activities, currentActivity, PGCRs } = this.state;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      const profileInfo = JSON.parse(localStorage.getItem("ProfileInfo"));
      const characters = profileInfo.characters.data;
      const characterIds = profileInfo.profile.data.characterIds;
      const selectedCharacter = localStorage.getItem("SelectedCharacter");
      const Manifest = globals.MANIFEST;
      const ManifestActivities = Manifest.DestinyActivityDefinition;
      const characterSelection = (
        <div id="character_select">
          <div key={ selectedCharacter } className="character_data" id={ selectedCharacter }>
            <div className="innerDiv" style={{ backgroundImage: `url("https://bungie.net${characters[selectedCharacter].emblemBackgroundPath}")` }}>
              <span id="left_span">{ profileHelper.getClassName(characters[selectedCharacter].classType) }</span>
              <span id="right_span">✦ { characters[selectedCharacter].light }</span>
            </div>
          </div>
          { characterIds.map(function(charId) {
            if(charId !== selectedCharacter) {
              return (
                <div key={ charId } className="character_data" id={ charId } onClick={ (() => this.changeCharacter(charId)) }>
                  <div className="innerDiv" style={{ backgroundImage: `url("https://bungie.net${characters[charId].emblemBackgroundPath}")` }}>
                    <span id='left_span'>{ profileHelper.getClassName(characters[charId].classType) }</span>
                    <span id='right_span'>✦ { characters[charId].light }</span>
                  </div>
                </div>
              );
            }
            else { return null; }
          }, this) }
        </div>
      );
      return (
        <div className="ActivitiesContent">
          <div className="RecentActivitiesView activityScrollbar">
            { activities.slice(0, 15).map(function(activity) {
              var icon = `https://bungie.net/img/misc/missing_icon_d2.png`;
              if(ManifestActivities[activity.activityDetails.directorActivityHash].displayProperties.hasIcon === true) { icon = `https://bungie.net${ManifestActivities[activity.activityDetails.directorActivityHash].displayProperties.icon}`; }
              var classProp = this.addCompletedClass(activity);
              return (
                <div key={ activity.activityDetails.instanceId } className={ classProp } id={ activity.activityDetails.instanceId } onClick={ (() => this.makeActiveDisplay(activity.activityDetails.instanceId)) }>
                  <img src={icon} alt="Icon" style={{ height: '50px', width: '50px', marginTop: '7px', marginLeft: '7px' }} />
                  <p className='activityTitle'>
                    <span style={{ display: 'block' }}> { modeTypes(activity.activityDetails.mode) !== "" ? modeTypes(activity.activityDetails.mode) : null } { ManifestActivities[activity.activityDetails.referenceId].displayProperties.name } </span>
                    <span style={{ display: 'block' }}> Time Played: { activity.values.timePlayedSeconds.basic.displayValue } </span>
                  </p>
                  <p> Kills: { activity.values.kills.basic.displayValue } </p>
                  <p> Deaths: { activity.values.deaths.basic.displayValue } </p>
                </div>
              )
            }, this)}
          </div>
          <div className="ActivityPGCR activityScrollbar" id="ActivityPGCR">
            { characterSelection }
            { PGCRGeneration.generate(PGCRs, activities, currentActivity) }
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Activities;
