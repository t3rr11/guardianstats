import React, { Component } from 'react';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';

export function generate(profileInfo, Manifest, historicStats) {
  return (
    <div className="inspectBox inspectBoxScrollbar" id="InspectBoxUserStatistics">
      <div className="inspectBoxContainer">
        <div className="inspectBoxContent">
          <div className="inspectBoxContentTitle"> Overall Crucible Statistics </div>
          { generatePvPStats(profileInfo, historicStats) }
        </div>
        <div className="inspectBoxContent">
          <div className="inspectBoxContentTitle"> Overall PvE Statistics </div>
          { generatePvEStats(profileInfo, historicStats) }
        </div>
        <div className="inspectBoxContent">
          <div className="inspectBoxContentTitle"> Specific Strike Completions </div>
          { generateIndividualPvPStats(profileInfo, Manifest.DestinyPresentationNodeDefinition, Manifest.DestinyRecordDefinition) }
          <div className="inspectBoxContentMessage"> (Only tracked since forsaken) </div>
        </div>
      </div>
    </div>
  );
}

const generatePvPStats = (profileInfo, historicStats) => {
  const allPvP = historicStats.mergedAllCharacters.results.allPvP.allTime;
  const activitiesEntered = allPvP.activitiesEntered.basic.displayValue;
  const activitiesWon = allPvP.activitiesWon.basic.displayValue;
  const activitiesLost = parseInt(activitiesEntered) - parseInt(activitiesWon);
  return (
    <div className="inspectBoxStatContent">
      <div className="inspectBoxContentIcon">
        <img src="./images/icons/crucible.png" style={{ width: '55px' }} />
      </div>
      <div className="inspectBoxContentStats">
        <div className="inspectBoxContentStatsDiv">
          <span>KD: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvP.killsDeathsRatio.basic.displayValue }</span></span>
          <span>KDA: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvP.killsDeathsAssists.basic.displayValue }</span></span>
          <span>KA/D: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvP.efficiency.basic.displayValue }</span></span>
        </div>
        <div className="inspectBoxContentStatsDiv">
          <span>Kills: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(allPvP.kills.basic.displayValue) }</span></span>
          <span>Assists: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(allPvP.assists.basic.displayValue) }</span></span>
          <span>Deaths: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(allPvP.deaths.basic.displayValue) }</span></span>
        </div>
        <div className="inspectBoxContentStatsDiv">
          <span>Matches: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(activitiesEntered) }</span></span>
          <span>Wins: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(activitiesWon) }</span></span>
          <span>Win Rate: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Math.round((activitiesWon / activitiesEntered) * 100) }%</span></span>
        </div>
      </div>
    </div>
  );
}
const generatePvEStats = (profileInfo, historicStats) => {
  const allPvE = historicStats.mergedAllCharacters.results.allPvE.allTime;
  return (
    <div className="inspectBoxStatContent">
      <div className="inspectBoxContentIcon">
        <img src="./images/icons/vanguard.png" style={{ width: '55px' }} />
      </div>
      <div className="inspectBoxContentStats">
        <div className="inspectBoxContentStatsDiv">
          <span>KD: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvE.killsDeathsRatio.basic.displayValue }</span></span>
          <span>KDA: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvE.killsDeathsAssists.basic.displayValue }</span></span>
          <span>KA/D: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvE.efficiency.basic.displayValue }</span></span>
        </div>
        <div className="inspectBoxContentStatsDiv">
          <span>Kills: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(allPvE.kills.basic.displayValue) }</span></span>
          <span>Assists: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(allPvE.assists.basic.displayValue) }</span></span>
          <span>Deaths: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(allPvE.deaths.basic.displayValue) }</span></span>
        </div>
        <div className="inspectBoxContentStatsDiv">
          <span>Activities: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(allPvE.activitiesEntered.basic.displayValue) }</span></span>
          <span>Misadventures: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(allPvE.suicides.basic.displayValue) }</span></span>
          <span>Time Spent: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ allPvE.secondsPlayed.basic.displayValue }</span></span>
        </div>
      </div>
    </div>
  );
}
const generateIndividualPvPStats = (profileInfo, PresentationNodes, Records) => {
  const strikesPlayed = profileInfo.profileRecords.data.records["2367932631"].objectives[0].progress;
  var strikeInfo = [];
  const disabledRecords = [
    1438813765,2229373471,1827105928,2647057001,907161188,1628091546,4276872224,3608507543,2367932631,4237873551,2929326295,
    4066667911,4156350130,1911649721,896769581,602316980,602316983,2502625450,1214241085,1841174948
  ];
  for(var i in PresentationNodes[1256609117].children.records) {
    if(!disabledRecords.find(recordHash => recordHash === PresentationNodes[1256609117].children.records[i].recordHash)) {
      strikeInfo.push(Records[PresentationNodes[1256609117].children.records[i].recordHash]);
    }
  }
  var strikeInfoLeft = strikeInfo.slice(Math.floor(strikeInfo.length / 2), strikeInfo.length);
  var strikeInfoRight = strikeInfo.slice(0, Math.floor(strikeInfo.length / 2));
  return (
    <div className="inspectBoxStatContent strikes">
      <div className="inspectBoxContentIcon strikes">
        <img src="./images/icons/vanguard.png" style={{ width: '55px' }} />
      </div>
      <div className="inspectBoxContentStats strikes">
        <div className="inspectBoxContentStatsDiv">
          { buildStrikes(strikeInfoLeft, profileInfo) }
        </div>
        <div className="inspectBoxContentStatsDiv">
          { buildStrikes(strikeInfoRight, profileInfo) }
        </div>
      </div>
    </div>
  );
}

const buildStrikes = (strikeInfo, profileInfo) => {
  return strikeInfo.map(function(strike) {
    return (
      profileInfo.profileRecords.data.records[strike.hash] ? (
        <span key={ strike.hash }>{ strike.displayProperties.name }
          <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>
            { profileInfo.profileRecords.data.records[strike.hash].objectives[0].progress }
          </span>
        </span>
      ) : null
    )
  })
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
