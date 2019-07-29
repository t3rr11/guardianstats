import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

import { startUpPageChecks } from '../../scripts/Checks';
import { modeTypes } from '../../scripts/ModeTypes';
import * as bungie from '../../requests/BungieReq';
import * as db from '../../requests/Database';

export class Activities extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading recent activites...' },
    activities: null,
    currentActivity : null,
    ManifestActivities: null,
    PGCRs: null
  }

  async componentDidMount() {
    this.startUpChecks();
  }

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
    var PGCRs;
    var count = 0;
    for(var i in activities) {
      bungie.GetPGCR(activities[i].activityDetails.instanceId).then((pgcr) => {
        count++;
        const instanceId = activities[i].activityDetails.instanceId;
        PGCRs += { instanceId: pgcr };
        if(count === 15) { this.finishedGrabbingPGCRs(PGCRs); }
      }, this);
    }
  }

  async finishedGrabbingPGCRs(PGCRs) {
    this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, PGCRs });
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
              return (
                <div key={ activity.activityDetails.instanceId } className="previousActivity" id={ activity.activityDetails.instanceId } onClick={ (() => this.MakeActiveDisplay(activity.activityDetails.instanceId)) }>
                  <img src={icon} style={{ height: '50px', width: '50px', marginTop: '7px', marginLeft: '7px' }} />
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
            { PGCRs[currentActivity] }
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export function checkActivityUpdates() {

}

export default Activities;
