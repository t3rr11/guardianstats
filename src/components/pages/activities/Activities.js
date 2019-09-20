import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

import { modeTypes } from '../../scripts/ModeTypes';
import * as checks from '../../scripts/Checks';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as PGCRGeneration from './PGCRGeneration';

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
    if(checks.checkManifestMounted()) {
      const check = await checks.startUpPageChecks();
      if(check === "Checks OK") {
        this.setState({ status: { status: 'getActivities', statusText: 'Grabbing activity history...' } });
        this.grabActivityData();
      }
      else {
        this.setState({ status: { status: 'error', statusText: checks } });
      }
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }

  async makeActiveDisplay(instanceId) { this.setState({ currentActivity: parseInt(instanceId) }); }
  async grabActivityData() {
    const basicMI = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
    const selectedCharacter = localStorage.getItem('SelectedCharacter');
    const activityData = await bungie.GetActivityHistory(basicMI.membershipType, basicMI.membershipId, selectedCharacter, 15, 0);
    const Manifest = globals.MANIFEST;
    const ManifestActivities = Manifest.DestinyActivityDefinition;
    const ManifestItems = Manifest.DestinyInventoryItemDefinition;
    this.setState({
      status: { status: 'gettingPGCRs', 'statusText': 'Getting battle reports...' },
      activities: activityData.activities,
      currentActivity: parseInt(activityData.activities[0].activityDetails.instanceId),
      ManifestActivities,
      ManifestItems
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
    const basicMI = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
    const selectedCharacter = localStorage.getItem('SelectedCharacter');
    const previousActivities = this.state.activities;
    const recentActivityData = (await bungie.GetActivityHistory(basicMI.membershipType, basicMI.membershipId, selectedCharacter, 15, 0)).activities;
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

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { activities, currentActivity, ManifestActivities, ManifestItems, PGCRs } = this.state;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      return (
        <div className="ActivitiesContent">
          <div className="RecentActivitiesView activityScrollbar">
            { activities.slice(0, 15).map(function(activity) {
              var icon = `https://bungie.net${ManifestActivities[activity.activityDetails.directorActivityHash].displayProperties.icon}`
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
            { PGCRGeneration.generate(ManifestActivities, ManifestItems, PGCRs, activities, currentActivity) }
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Activities;
