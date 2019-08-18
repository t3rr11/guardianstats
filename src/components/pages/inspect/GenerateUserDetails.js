import React, { Component } from 'react';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';
import { Titles } from './Titles';

export function generate(profileInfo) {
  return (
    <React.Fragment>
      <div className="inspectProfileName"> { profileInfo.profile.data.userInfo.displayName } </div>
      <div className="inspectUserDetails">
        <div className="inspectTimePlayed">Time Played: { Math.round(totalTime(profileInfo.profile.data.characterIds, profileInfo.characters.data) / 60) } Hours</div>
        <div className="inspectLastPlayed">Last Played: { Misc.convertTimeToDate(profileInfo.profile.data.dateLastPlayed) } </div>
        <div className="inspectVersion">Version: { getVersion(profileInfo.profile.data.versionsOwned) } </div>
      </div>
      <div className="inspectTitles"> { getTitles(profileInfo) } </div>
    </React.Fragment>
  );
}

function enumerateVersion(state) {
  var flagEnum = (state, value) => !!(state & value);
  return {
    None: flagEnum(state, 0),
    Destiny2: flagEnum(state, 1),
    DLC1: flagEnum(state, 2),
    DLC2: flagEnum(state, 4),
    Forsaken: flagEnum(state, 8),
    YearTwoAnnualPass: flagEnum(state, 16),
    Shadowkeep: flagEnum(state, 32)
  }
}
const totalTime = (ids, characters) => {
  var totalMinutes = 0;
  for(var i in ids) { totalMinutes = parseInt(totalMinutes) + parseInt(characters[ids[i]].minutesPlayedTotal); }
  return totalMinutes;
}
const getVersion = (versionsOwned) => {
  return (
    enumerateVersion(versionsOwned).Destiny2 === true ? (
      enumerateVersion(versionsOwned).DLC1 === true ? (
        enumerateVersion(versionsOwned).DLC2 === true ? (
          enumerateVersion(versionsOwned).Forsaken === true ? (
            enumerateVersion(versionsOwned).YearTwoAnnualPass === true ? (
              enumerateVersion(versionsOwned).Shadowkeep === true ? "Shadowkeep" : "Y2 Annual Pass"
            ): "Forsaken"
          ): "Warmind"
        ): "Curse of Osiris"
      ): "Base Destiny 2"
    ): null
  );
}

const getTitles = (profileInfo) => {
  var titles = Titles(profileInfo);
  return (
    titles.map(function (title) {
      if(!title.hidden) {
        if(title.isObtained) { return (<div key={ title.title } className="inspectTitleObtained" style={{ backgroundImage: `url("${ title.icon }")` }}></div>)}
        else { return (<div key={ title.title } className="inspectTitleNotObtained" style={{ backgroundImage: `url("${ title.icon }")` }}></div>)}
      }
      else {
        if(title.isObtained) { return (<div key={ title.title } className="inspectTitleObtained" style={{ backgroundImage: `url("${ title.icon }")` }}></div>)}
      }
    })
  );
}