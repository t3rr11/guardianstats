import React from 'react';
import * as Misc from '../../Misc';
import * as UserStatistics from './GenerateUserStatistics';
import { Titles } from './Titles';

var hasHacked = true;

export function generate(profileInfo, isHacker, props) {
  return (
    <div className="inspectUserDetailsContainer">
      {
        isHacker ? (
          <div className="inspectIsHackerContainer">
            <img className="inspectIsHackerIcon" src={ `./images/icons/warning.png` } />
            <div className="inspectIsHackerDesc">Guardianstats has reviewed this account and suspects this user to be a hacker.</div>
          </div>
        ):(
          <img className="inspectVersion" src={ `./images/icons/versions/${ getVersionImage(getVersion(profileInfo.profile.data.versionsOwned)) }` } />
        )
      }
      <div className="inspectProfileName"> { profileInfo.profile.data.userInfo.displayName } </div>
      <div className="inspectUserDetails">
        <div className="inspectTimePlayed">Time Played: { Math.round(totalTime(profileInfo.profile.data.characterIds, profileInfo.characters.data) / 60) } Hours</div>
        <div className="inspectLastPlayed">Last Played: { Misc.convertTimeToDate(profileInfo.profile.data.dateLastPlayed) } </div>
      </div>
      { UserStatistics.generateRanks(profileInfo) }
      <div className="inspectViewActivitiesBtn" onClick={ (() => props.foundUser(profileInfo.profile.data.userInfo.membershipId)) }>View Recent Activity</div>
    </div>
  );
}

//Functions
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

//Gets
export const getTitles = (profileInfo, hiddenSeals) => {
  var titles = Titles(profileInfo);
  if(titles.find(title => title.isObtained === true)) {
    return (
      titles.map(function (title) {
        if(!title.hidden) {
          if(title.isObtained) { return buildTitle(title, true) }
          else { return buildTitle(title, false) }
        }
        else { if(title.isObtained) { return buildTitle(title, true) } else { return null } }
      })
    );
  }
  else { return (<div className="inspectNoTitlesObtained">No Titles Obtained</div>) }
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
const getVersionImage = (version) => {
  if(version === "Y2 Annual Pass") { return ("annualpass.png"); }
  else if(version === "Forsaken") { return ("forsaken.png"); }
  else if(version === "Warmind") { return ("warmind.png"); }
  else if(version === "Curse of Osiris") { return ("curseofosiris.png"); }
  else if(version === "Base Destiny 2") { return ("destiny.png"); }
  else { return "destiny.png"; }
}

//Others
const totalTime = (ids, characters) => {
  var totalMinutes = 0;
  for(var i in ids) { totalMinutes = parseInt(totalMinutes) + parseInt(characters[ids[i]].minutesPlayedTotal); }
  return totalMinutes;
}
const buildTitle = (title, obtained) => {
  return (
    <div key={ title.title } className="inspectTitleContainer">
      <div className={ obtained ? "inspectTitleObtained" : "inspectTitleNotObtained" } style={{ backgroundImage: `url("${ title.icon }.png")` }}></div>
      <div className="titleInfo">
        <div className="titleName">{ title.title }</div>
        <div className="titleDesc">{ title.description }</div>
      </div>
    </div>
  );
}


















//
