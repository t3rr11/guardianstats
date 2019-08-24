import React, { Component } from 'react';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';
import { modeTypes } from '../../scripts/ModeTypes';

export function generate(profileInfo, membershipInfo, Manifest, activities) {
  const ManifestActivities = Manifest.DestinyActivityDefinition;
  return (
    <div className="inspectBox" id="InspectBoxRecentActivities">
      <div className="inspectBoxTitle"> Recent Activities </div>
        { activities.activities.map(function(activity) {
          var icon = `https://bungie.net${ManifestActivities[activity.activityDetails.directorActivityHash].displayProperties.icon}`
          var classProp = addCompletedClass(activity);
          return (
            <div key={ activity.activityDetails.instanceId } className={ classProp } id={ activity.activityDetails.instanceId }>
              <img src={icon} alt="Icon" style={{ height: '30px', width: '30px', marginTop: '4px', marginLeft: '7px' }} />
              <p className='activityTitle'>
                <span style={{ display: 'block' }}> { modeTypes(activity.activityDetails.mode) }: { ManifestActivities[activity.activityDetails.referenceId].displayProperties.name } </span>
                <span style={{ display: 'block', color: '#bbb', fontSize: '11px' }}> { getLastPlayed(activity) } ago </span>
              </p>
              <div>
                <p style={{ margin: '0px', textAlign: 'right', marginRight: '10px' }}>Kills: <span style={{ color: '#bbb' }}>{ activity.values.kills.basic.displayValue }</span></p>
                <p style={{ margin: '0px', textAlign: 'right', marginRight: '10px' }}>Deaths: <span style={{ color: '#bbb' }}>{ activity.values.deaths.basic.displayValue }</span></p>
              </div>
            </div>
          )
        }, this)}
    </div>
  );
}

function getLastPlayed(activity) { return Misc.formatTime((new Date().getTime() / 1000) - (new Date(activity.period).getTime() / 1000)) }
function addCompletedClass(activity) {
  if(activity.activityDetails.mode !== 6) {
    if(activity.values.standing) {
      const completed = activity.values.standing.basic.value === 0 ? 'completed' : 'failed';
      return `inspectActivityContainer ${ completed }`;
    }
    else {
      if(activity.values.completed) {
        const completed = activity.values.completed.basic.value === 1 ? 'completed' : 'failed';
        return `inspectActivityContainer ${ completed }`;
      }
      else { return `inspectActivityContainer neutral`; }
    }
  }
  else { return `inspectActivityContainer completed`; }
}
