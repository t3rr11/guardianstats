import React, { Component } from 'react';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';

export function generate(profileInfo, historicStats) {
  return (
    <div className="inspectBox">
      <div className="inspectBoxContent">
        <div className="inspectBoxPvPTitle"> Crucible Statistics </div>
        { generatePvPStats(profileInfo, historicStats) }
      </div>
    </div>
  );
}

export const generatePvPStats = (profileInfo, historicStats) => {
  const allPvP = historicStats.mergedAllCharacters.results.allPvP.allTime;
  const activitiesEntered = allPvP.activitiesEntered.basic.displayValue;
  const activitiesWon = allPvP.activitiesWon.basic.displayValue;
  const activitiesLost = parseInt(activitiesEntered) - parseInt(activitiesWon);
  return (
    <div className="inspectBoxStatPVP">
      <div className="inspectBoxPVPIcon">
        <img src="./images/icons/crucible_default.png" style={{ width: '55px' }} />
      </div>
      <div className="inspectBoxPVPStats">
        <div className="inspectBoxPVPStatsDiv">
          <span>KD: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvP.killsDeathsRatio.basic.displayValue }</span></span>
          <span>KDA: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvP.killsDeathsAssists.basic.displayValue }</span></span>
          <span>KA/D: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvP.efficiency.basic.displayValue }</span></span>
        </div>
        <div className="inspectBoxPVPStatsDiv">
          <span>Kills: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvP.kills.basic.displayValue }</span></span>
          <span>Assists: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvP.assists.basic.displayValue }</span></span>
          <span>Deaths: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvP.deaths.basic.displayValue }</span></span>
        </div>
        <div className="inspectBoxPVPStatsDiv">
          <span>Matches: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ activitiesEntered }</span></span>
          <span>Wins: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ activitiesWon }</span></span>
          <span>Win Rate: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Math.round((activitiesWon / activitiesEntered) * 100) }%</span></span>
        </div>
      </div>
    </div>
  );
}

export const generateRanks = (profileInfo) => {
  return (
    <div className="inspectBoxRanks">
      <div className="inspectBoxRanksValor">
        <div className="inspectBoxRanksImage" style={{ backgroundImage: 'url("/images/icons/pvp/valor_icon.png")' }}></div>
        <span className="inspectBoxRanksScore">{ getRank(profileInfo, "valor") }</span>
      </div>
      <div className="inspectBoxRanksGlory">
        <div className="inspectBoxRanksImage" style={{ backgroundImage: 'url("/images/icons/pvp/glory_icon.png")' }}></div>
        <span className="inspectBoxRanksScore">{ getRank(profileInfo, "glory") }</span>
      </div>
      <div className="inspectBoxRanksInfamy">
        <div className="inspectBoxRanksImage" style={{ backgroundImage: 'url("/images/icons/pvp/infamy_icon.png")' }}></div>
        <span className="inspectBoxRanksScore">{ getRank(profileInfo, "infamy") }</span>
      </div>
    </div>
  );
}
const getRank = (profileInfo, type) => {
  if(type === "valor") { return profileInfo.characterProgressions.data[profileInfo.profile.data.characterIds[0]].progressions["3882308435"].currentProgress; }
  else if(type === "glory") { return profileInfo.characterProgressions.data[profileInfo.profile.data.characterIds[0]].progressions["2679551909"].currentProgress; }
  else if(type === "infamy") { return profileInfo.characterProgressions.data[profileInfo.profile.data.characterIds[0]].progressions["2772425241"].currentProgress; }
}
