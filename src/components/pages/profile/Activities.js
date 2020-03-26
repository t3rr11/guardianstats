import React, { Component } from 'react';
import SmallLoader from '../../modules/SmallLoader';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import uuid from  'uuid';

import { modeTypes, modes } from '../../scripts/ModeTypes';
import * as checks from '../../scripts/Checks';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as PGCRGeneration from './PGCRGeneration';
import * as Misc from '../../Misc';

var ActivityWatcher = null;
var isMounted = true;

export class Activities extends Component {
  state = {
    status: { error: null, status: 'startUp', statusText: '' },
    isMounted: true,
    profile: null,
    activities: { },
    currentActivity : null,
    filter: "None",
    filteredMode: "All",
    ManifestActivities: null,
    ManifestItems: null,
    PGCRs: { }
  }

  async componentDidMount() { document.title = "Activities - Guardianstats"; this.startUpChecks(); }
  async componentWillUnmount() { isMounted = false; console.log(isMounted); this.stopActivityTimer('Activity'); }
  async startUpChecks() {
    this.setState({ status: { status: 'checkingManifest', statusText: 'Checking Manifest...' } });
    if(await checks.checkManifestMounted()) {
      isMounted = true;
      var { membershipId } = this.props;
      if(membershipId && membershipId !== '/activities') { this.loadActivities(membershipId); this.startActivityTimer(); }
      else {
        if(localStorage.getItem("SelectedAccount")) {
          var selectedAccount = localStorage.getItem("SelectedAccount");
          if(selectedAccount !== "Please Select Platform") { this.loadActivities(JSON.parse(selectedAccount).id); this.startActivityTimer(); }
          else { this.setState({ status: { status: 'error', statusText: 'Please select a platform first.' } }); }
        }
        else { this.setState({ status: { status: 'error', statusText: 'Please login first or go back home and search for a player.' } }); }
      }
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }
  async loadActivities(membershipId) {
    if(!isNaN(membershipId) && membershipId.length >= 19) {
      try {
        var membershipType;
        //Check account exists
        this.setState({ status: { status: 'checkingAccountInfo', statusText: 'Checking if account exists...' } });
        const membershipInfo = await bungie.GetMembershipsById(membershipId);
        //Get membership type for membershipId.
        for(var i in membershipInfo.destinyMemberships) { if(membershipInfo.destinyMemberships[i].membershipId === membershipId) { membershipType = membershipInfo.destinyMemberships[i].membershipType; } }

        //Found account now get the profile information.
        this.setState({ status: { status: 'grabbingAccountInfo', statusText: 'Loading recent activities...' }, membershipInfo: { membershipId, membershipType } });
        this.grabActivityData(membershipId, membershipType);
      }
      catch(err) {
        if(Misc.isJSON(err)) { var error = JSON.parse(err); this.setState({ status: { status: 'error', statusText: 'Something went wrong... Error: ' + error.Message } }); }
        else { this.setState({ status: { status: 'error', statusText: 'Something went wrong... Error: ' + err } }); }
      }
    }
  }
  async makeActiveDisplay(instanceId) { this.setState({ currentActivity: parseInt(instanceId) }); }
  async grabActivityData(membershipId, membershipType) {
    const charData = (await bungie.GetProfile(membershipType, membershipId, 200)).characters.data;
    const characters = Object.keys(charData);
    var lastCharPlayed = charData[characters[0]]; for(var c in charData) { if(new Date(lastCharPlayed.dateLastPlayed) < new Date(charData[c].dateLastPlayed).getTime()) { lastCharPlayed = charData[c]; } }
    var allActivities = [];
    for(var i in characters) {
      const activityData = await bungie.GetActivityHistory(membershipType, membershipId, characters[i], 50, 0);
      for(var j in activityData.activities) { allActivities.push(activityData.activities[j]); }
    }
    allActivities.sort(function(a, b) { return (new Date(b.period).getTime() - new Date(a.period).getTime()); });
    this.setState({
      status: { status: 'gettingPGCRs', 'statusText': 'Getting battle reports...' },
      profile: { membershipType, membershipId, characters, lastOnlineCharacterId: lastCharPlayed.characterId },
      activities: allActivities,
      currentActivity: parseInt(allActivities[0].activityDetails.instanceId)
    });
    this.grabPGCRs(allActivities, null);
  }
  async grabPGCRs(activities, newActivitiesArray) {
    var PGCRs = this.state.PGCRs;
    var count = 0;
    var amount = 30;
    var overflowCount = amount;
    if(activities.length < 30) { amount = activities.length }
    for(var i in activities) {
      if(i < amount) {
        bungie.GetPGCR(activities[i].activityDetails.instanceId).then((pgcr) => { //eslint-disable-line no-loop-func
          count++;
          this.setState({ status: { status: 'gettingPGCRs', 'statusText': `Getting battle reports ${ count } / ${ amount }` } });
          PGCRs[pgcr.activityDetails.instanceId] = pgcr;
          if(count === amount) { this.finishedGrabbingPGCRs(PGCRs, newActivitiesArray); }
        }, this);
      }
      else {
        if(isMounted) {
          await bungie.GetPGCR(activities[i].activityDetails.instanceId).then((pgcr) => { //eslint-disable-line no-loop-func
            overflowCount++;
            PGCRs[pgcr.activityDetails.instanceId] = pgcr;
            if(this.state.currentActivity == pgcr.activityDetails.instanceId) { this.makeActiveDisplay(this.state.currentActivity); }
            if(overflowCount === activities.length) { console.log("Finished loading background activities..."); }
          }, this);
        }
      }
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
  getClassFromPGCR(currentActivity, membershipId) {
    const { PGCRs } = this.state;
    if(PGCRs[currentActivity]) {
      try { var playerInfo = PGCRs[currentActivity].entries.find(e => e.player.destinyUserInfo.membershipId === membershipId); return playerInfo.player.characterClass; }
      catch (err) { return "Failed"; }
    }
    else { return "Loading..."; }
  }
  getClassName(classType) {
    if(classType === 0){ return 'Titan' }
    else if(classType === 1) { return 'Hunter' }
    else if(classType === 2) { return 'Warlock' }
  }
  filterMode = (event) => {
    this.setState({ filter: event.target.value, filteredMode: "All" });
  }
  filterSpecificMode = (event) => {
    this.setState({ filteredMode: event.target.value });
  }

  //Timers
  startActivityTimer() { ActivityWatcher = setInterval(this.checkActivityUpdates, 30000); console.log('Activity Watcher Started.'); }
  stopActivityTimer() { clearInterval(ActivityWatcher); ActivityWatcher = null; console.log('Activity Watcher Stopped'); }
  checkActivityUpdates = async () => {
    if(this.state.profile !== null) {
      const profile = this.state.profile;
      const previousActivities = this.state.activities;
      const recentActivityData = (await bungie.GetActivityHistory(profile.membershipType, profile.membershipId, profile.lastOnlineCharacterId, 15, 0)).activities;
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
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { activities, currentActivity, PGCRs, filter, filteredMode } = this.state;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      const Manifest = globals.MANIFEST;
      var filteredActivities = activities;
      if(filter !== "None" && filteredMode === "All") { filteredActivities = activities.filter(function(item) { for(var i in item.activityDetails.modes) { if(modes(filter).includes(item.activityDetails.modes[i])) { return item; } } }); }
      else if(filter !== "None" && filteredMode !== "All") { filteredActivities = activities.filter(function(item) { if(item.activityDetails.modes.includes(modeTypes(filteredMode).id)) { return item; } }); }
      return (
        <div className="ActivitiesContent">
          <div className="RecentActivitiesView activityScrollbar">
            <div className="activityFilter">
              <select className="btn btn-secondary dropdown-toggle" id="filterMode" onChange={ this.filterMode } value={ filter }>
                <option value="None">Filter</option>
                <option value="None">None</option>
                <option value="PvE">PvE</option>
                <option value="PvP">PvP</option>
                <option value="Gambit">Gambit</option>
              </select>
              {
                filter !== "None" ? (
                  <select className="btn btn-secondary dropdown-toggle" id="filterSpecificMode" onChange={ this.filterSpecificMode } value={ filteredMode }>
                    <option key="All" value="All">All</option>
                    { modes(filter).map(function(item) { return (<option key={ item } value={ modeTypes(item).name }>{ modeTypes(item).name }</option>) }) }
                  </select>
                ) : null
              }
              <div id="updateCounter"></div>
            </div>
            { filteredActivities.map(function(activity) {
              var icon = `https://bungie.net/img/misc/missing_icon_d2.png`;
              if(Manifest.DestinyActivityDefinition[activity.activityDetails.directorActivityHash]) { if(Manifest.DestinyActivityDefinition[activity.activityDetails.directorActivityHash].displayProperties.hasIcon === true) { icon = `https://bungie.net${Manifest.DestinyActivityDefinition[activity.activityDetails.directorActivityHash].displayProperties.icon}`; } }
              var classProp = this.addCompletedClass(activity);
              return (
                <div key={ uuid.v4() } className={ classProp } id={ activity.activityDetails.instanceId } onClick={ (() => this.makeActiveDisplay(activity.activityDetails.instanceId)) }>
                  <img src={icon} alt="Icon" />
                  <div className='activityTitle'>
                    <span style={{ display: 'block' }}>
                      { modeTypes(activity.activityDetails.mode).friendlyName !== "" ? `${ modeTypes(activity.activityDetails.mode).friendlyName }: ` : null }
                      { Manifest.DestinyActivityDefinition[activity.activityDetails.referenceId] && Manifest.DestinyActivityDefinition[activity.activityDetails.referenceId].displayProperties.name ? Manifest.DestinyActivityDefinition[activity.activityDetails.referenceId].displayProperties.name : "??????" }</span>
                    <p>{ Misc.formatTime((new Date().getTime() - new Date(activity.period).getTime()) / 1000) } ago</p>
                  </div>
                  <div className="activityTimePlayed">
                    <div><img src="./images/icons/clock.png" /><span> { activity.values.timePlayedSeconds.basic.displayValue } </span></div>
                    <div>Class: { this.getClassFromPGCR(activity.activityDetails.instanceId, this.state.profile.membershipId) } </div>
                  </div>
                  <div className="activityKillsDeaths">
                    <div>
                      <span>K:</span>
                      <span style={{ color: "gainsboro" }}> { activity.values.kills.basic.displayValue } </span>
                    </div>
                    <div>
                      <span>D:</span>
                      <span style={{ color: "gainsboro" }}> { activity.values.deaths.basic.displayValue } </span>
                    </div>
                  </div>
                  <div className="activityKdRatios">
                    <div>
                      <span>K/D:</span>
                      <span style={{ color: activity.values.killsDeathsRatio.basic.displayValue >= 1 ? "limegreen":"tomato", filter: "contrast(0.7)" }}> { activity.values.killsDeathsRatio.basic.displayValue } </span>
                    </div>
                    <div>
                      <span>KDA:</span>
                      <span style={{ color: activity.values.efficiency.basic.displayValue >= 1 ? "limegreen":"tomato", filter: "contrast(0.7)" }}> { activity.values.efficiency.basic.displayValue } </span>
                    </div>
                  </div>
                </div>
              )
            }, this)}
          </div>
          <div className="ActivityPGCR activityScrollbar" id="ActivityPGCR">
            { PGCRGeneration.generate(PGCRs, activities, currentActivity, this.props) }
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Activities;
