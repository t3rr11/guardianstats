import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

import { startUpPageChecks } from '../../scripts/Checks';
import { modeTypes } from '../../scripts/ModeTypes';
import * as bungie from '../../requests/BungieReq';
import * as db from '../../requests/Database';
import * as timers from '../../Timers';

var ActivityWatcher = null;

export class Activities extends Component {
  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading recent activites...' },
    activities: null,
    currentActivity : null,
    ManifestActivities: null,
    PGCRs: null
  }
  async componentDidMount() { this.startUpChecks(); this.startActivityTimer(); }
  async componentWillUnmount() { this.stopActivityTimer('Activity'); }
  async startUpChecks() {
    this.setState({ status: { status: 'checking', statusText: 'Doing some checks...' } });
    const checks = await startUpPageChecks();
    if(checks === "Checks OK") {
      this.setState({ status: { status: 'getActivities', statusText: 'Grabbing activity history...' } });
      this.grabActivityData();
    }
    else { this.setState({ status: { status: 'error', statusText: checks } }); }
  }
  async grabActivityData() {
    const basicMI = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
    const selectedCharacter = localStorage.getItem('SelectedCharacter');
    const activityData = await bungie.GetActivityHistory(basicMI.membershipType, basicMI.membershipId, selectedCharacter, 15, 0);
    const ManifestActivities = await db.getActivityDefinition();
    this.setState({
      status: { status: 'gettingPGCRs', 'statusText': 'Getting battle reports...' },
      activities: activityData.activities,
      currentActivity: parseInt(activityData.activities[0].activityDetails.instanceId),
      ManifestActivities
    });
    this.grabPGCRs(activityData.activities);
  }
  async grabPGCRs(activities) {
    var PGCRs = {};
    var count = 0;
    for(var i in activities) {
      bungie.GetPGCR(activities[i].activityDetails.instanceId).then((pgcr) => { //eslint-disable-line no-loop-func
        count++;
        PGCRs[pgcr.activityDetails.instanceId] = pgcr;
        if(count === 15) { this.finishedGrabbingPGCRs(PGCRs); }
      }, this);
    }
  }
  async finishedGrabbingPGCRs(PGCRs) { this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, PGCRs }); }
  async makeActiveDisplay(instanceId) { this.setState({ currentActivity: parseInt(instanceId) }); }
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
  adjustEntriesBoxSizing(activity) {
    if(activity.entries.length > 6) { const heightOf = activity.entries.length * 28 + 28; return { height: heightOf }; }
    else { return { height: '196px' }; }
  }

  startActivityTimer() { ActivityWatcher = setInterval(this.checkActivityUpdates, 30000); console.log('Activity Watcher Started.'); }
  stopActivityTimer() { clearInterval(ActivityWatcher); ActivityWatcher = null; console.log('Activity Watcher Stopped'); }
  checkActivityUpdates() {
    
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { activities, currentActivity, ManifestActivities, PGCRs } = this.state;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      return (
        <div className="ActivitiesContent">
          <div className="RecentActivitiesView activityScrollbar">
            { activities.slice(0, 15).map(function(activity) {
              var icon = `https://bungie.net${ManifestActivities[activity.activityDetails.referenceId].displayProperties.icon}`
              var classProp = this.addCompletedClass(activity);
              return (
                <div key={ activity.activityDetails.instanceId } className={ classProp } id={ activity.activityDetails.instanceId } onClick={ (() => this.makeActiveDisplay(activity.activityDetails.instanceId)) }>
                  <img src={icon} alt="Icon" style={{ height: '50px', width: '50px', marginTop: '7px', marginLeft: '7px' }} />
                  <p className='activityTitle'>
                    <span style={{ display: 'block' }}> { modeTypes(activity.activityDetails.mode) }: { ManifestActivities[activity.activityDetails.referenceId].displayProperties.name } </span>
                    <span style={{ display: 'block' }}> Time Played: { activity.values.timePlayedSeconds.basic.displayValue } </span>
                  </p>
                  <p> Kills: { activity.values.kills.basic.displayValue } </p>
                  <p> Deaths: { activity.values.deaths.basic.displayValue } </p>
                </div>
              )
            }, this)}
          </div>
          <div className="ActivityPGCR activityScrollbar" id="ActivityPGCR">
            <div className="pgcrContainer">
              <div className='pgcrTopContainer' id={ `pgcrTopContainer_${ PGCRs[currentActivity].activityDetails.instanceId }` } style={ this.adjustEntriesBoxSizing(PGCRs[currentActivity]) } >
               <div className='pgcrPlayers' id={ `pgcrPlayers_${ PGCRs[currentActivity].activityDetails.instanceId }` }>
                 <div className='pgcrPlayersTitle'>
                   <div>Players</div>
                   <div>Kills</div>
                   <div>Assists</div>
                   <div>Deaths</div>
                 </div>
                 { PGCRs[currentActivity].entries.map((playerData) => (
                    <div key={ playerData.player.destinyUserInfo.membershipId } className="pgcrPlayersBlob" id={`player_${ playerData.player.destinyUserInfo.membershipId }`}>
                      <div><span className="pgcrPlayerName" id={ playerData.player.destinyUserInfo.membershipId }>{ playerData.player.destinyUserInfo.displayName }</span></div>
                      <div><span>{ playerData.values.kills.basic.displayValue }</span></div>
                      <div><span>{ playerData.values.assists.basic.displayValue }</span></div>
                      <div><span>{ playerData.values.deaths.basic.displayValue }</span></div>
                    </div>
                 )) }
               </div>
               <div className="pgcrImage" style={{ backgroundImage: `url(https://bungie.net${ ManifestActivities[PGCRs[currentActivity].activityDetails.referenceId].pgcrImage })` }}></div>
             </div>
              <div className="pgcrInfo" id={ `pgcrInfo_${ PGCRs[currentActivity].activityDetails.instanceId }` }></div>
              <input type="button" className="btn btn-secondary toggleRawInfoBtn" style={{ fontSize: '13px', margin: '5px' }} onClick={ (() => this.ToggleRawInfo(PGCRs[currentActivity].activityDetails.instanceId)) } value="Toggle Raw Data" />
              <input type="button" className="btn btn-info copyToClipboardBtn" style={{ fontSize: '13px', margin: '5px' }} onClick={ (() => this.CopyToClipboard(`#pgcrRawInfo_${ PGCRs[currentActivity].activityDetails.instanceId }`)) } value="Copy to clipboard" />
              <div className="pgcrRawInfo hidden" id={ `pgcrRawInfo_${ PGCRs[currentActivity].activityDetails.instanceId }` }>{ JSON.stringify(PGCRs[currentActivity]) }</div>
            </div>
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Activities;
