import React from 'react';
import * as Misc from '../../Misc';

export function generate(profileInfo, Manifest, historicStats, gambitStats, raidStats) {
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
          <div className="inspectBoxContentTitle"> Overall Gambit Statistics </div>
          { generateGambitStats(profileInfo, gambitStats) }
        </div>
        <div className="inspectBoxContent">
          <div className="inspectBoxContentTitle"> Overall Raid Statistics </div>
          { generateRaidsStats(profileInfo, raidStats) }
        </div>
        <div className="inspectBoxContent">
          <div className="inspectBoxContentTitle"> Specific Strike Completions </div>
          { generateIndividualStrikesCompleted(profileInfo, Manifest.DestinyPresentationNodeDefinition, Manifest.DestinyRecordDefinition) }
          <div className="inspectBoxContentMessage"> (Only tracked since forsaken) </div>
        </div>
        <div className="inspectBoxContent">
          <div className="inspectBoxContentTitle"> Specific Raid Completions </div>
          { generateIndividualRaidsCompleted(profileInfo, Manifest.DestinyPresentationNodeDefinition, Manifest.DestinyRecordDefinition) }
          <div className="inspectBoxContentMessage"> (* Flawless) </div>
        </div>
      </div>
    </div>
  );
}

const generatePvPStats = (profileInfo, historicStats) => {
  const allPvP = historicStats.mergedAllCharacters.results.allPvP.allTime ? historicStats.mergedAllCharacters.results.allPvP.allTime : (
    {
      activitiesEntered: { basic: { displayValue: 0 } },
      activitiesWon: { basic: { displayValue: 0 } },
      killsDeathsRatio: { basic: { displayValue: 0 } },
      killsDeathsAssists: { basic: { displayValue: 0 } },
      efficiency: { basic: { displayValue: 0 } },
      kills: { basic: { displayValue: 0 } },
      assists: { basic: { displayValue: 0 } },
      deaths: { basic: { displayValue: 0 } }
    }
  );
  const activitiesEntered = allPvP.activitiesEntered.basic.displayValue;
  const activitiesWon = allPvP.activitiesWon.basic.displayValue;
  return (
    <div className="inspectBoxStatContent">
      <div className="inspectBoxContentIcon">
        <img alt="crucibleIcon" src="./images/icons/destiny/crucible.png" style={{ width: '55px' }} />
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
        <img alt="pveIcon" src="./images/icons/destiny/pve.png" style={{ width: '55px' }} />
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
const generateGambitStats = (profileInfo, gambitStats) => {
  var kd = 0, kda = 0, kad = 0, kills = 0, deaths = 0, assists = 0, matches = 0, wins = 0;
  for (var i in gambitStats) {
    try { kd = kd + gambitStats[i].allPvECompetitive.allTime.killsDeathsRatio.basic.value; } catch (err) {  }
    try { kda = kda + gambitStats[i].allPvECompetitive.allTime.killsDeathsAssists.basic.value; } catch (err) {  }
    try { kad = kad + gambitStats[i].allPvECompetitive.allTime.efficiency.basic.value; } catch (err) {  }
    try { kills = kills + gambitStats[i].allPvECompetitive.allTime.kills.basic.value; } catch (err) {  }
    try { deaths = deaths + gambitStats[i].allPvECompetitive.allTime.deaths.basic.value; } catch (err) {  }
    try { assists = assists + gambitStats[i].allPvECompetitive.allTime.assists.basic.value; } catch (err) {  }
    try { matches = matches + gambitStats[i].allPvECompetitive.allTime.activitiesEntered.basic.value; } catch (err) {  }
    try { wins = wins + gambitStats[i].allPvECompetitive.allTime.activitiesWon.basic.value; } catch (err) {  }
  }
  kd = Math.round((kd / gambitStats.length) * 100) / 100;
  kda = Math.round((kda / gambitStats.length) * 100) / 100;
  kad = Math.round((kad / gambitStats.length) * 100) / 100;
  return (
    <div className="inspectBoxStatContent">
      <div className="inspectBoxContentIcon">
        <img alt="gambitIcon" src="./images/icons/destiny/gambit.png" style={{ width: '55px' }} />
      </div>
      <div className="inspectBoxContentStats">
        <div className="inspectBoxContentStatsDiv">
          <span>KD: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ kd }</span></span>
          <span>KDA: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ kda }</span></span>
          <span>KA/D: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ kad }</span></span>
        </div>
        <div className="inspectBoxContentStatsDiv">
          <span>Kills: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(kills) }</span></span>
          <span>Assists: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(assists) }</span></span>
          <span>Deaths: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(deaths) }</span></span>
        </div>
        <div className="inspectBoxContentStatsDiv">
          <span>Matches: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(matches) }</span></span>
          <span>Wins: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(wins) }</span></span>
          <span>Win Rate: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Math.round((wins / matches) * 100) }%</span></span>
        </div>
      </div>
    </div>
  );
}
const generateRaidsStats = (profileInfo, raidStats) => {
  var kd = 0, kda = 0, kad = 0, kills = 0, deaths = 0, assists = 0, activities = 0,  misadventures = 0, timeSpent = 0;
  for (var i in raidStats) {
    try { kd = kd + raidStats[i].raid.allTime.killsDeathsRatio.basic.value; } catch (err) {  }
    try { kda = kda + raidStats[i].raid.allTime.killsDeathsAssists.basic.value; } catch (err) {  }
    try { kad = kad + raidStats[i].raid.allTime.efficiency.basic.value; } catch (err) {  }
    try { kills = kills + raidStats[i].raid.allTime.kills.basic.value; } catch (err) {  }
    try { deaths = deaths + raidStats[i].raid.allTime.deaths.basic.value; } catch (err) {  }
    try { assists = assists + raidStats[i].raid.allTime.assists.basic.value; } catch (err) {  }
    try { activities = activities + raidStats[i].raid.allTime.activitiesEntered.basic.value; } catch (err) {  }
    try { misadventures = misadventures + raidStats[i].raid.allTime.suicides.basic.value; } catch (err) {  }
    try { timeSpent = timeSpent + raidStats[i].raid.allTime.secondsPlayed.basic.value; } catch (err) {  }
  }
  kd = Math.round((kd / raidStats.length) * 100) / 100;
  kda = Math.round((kda / raidStats.length) * 100) / 100;
  kad = Math.round((kad / raidStats.length) * 100) / 100;
  timeSpent = Misc.formatSmallTime(Math.round(timeSpent));
  return (
    <div className="inspectBoxStatContent">
      <div className="inspectBoxContentIcon">
        <img alt="raidIcon" src="./images/icons/destiny/raid.png" style={{ width: '55px' }} />
      </div>
      <div className="inspectBoxContentStats">
        <div className="inspectBoxContentStatsDiv">
          <span>KD: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ kd }</span></span>
          <span>KDA: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ kda }</span></span>
          <span>KA/D: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ kad }</span></span>
        </div>
        <div className="inspectBoxContentStatsDiv">
          <span>Kills: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(kills) }</span></span>
          <span>Assists: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(assists) }</span></span>
          <span>Deaths: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(deaths) }</span></span>
        </div>
        <div className="inspectBoxContentStatsDiv">
          <span>Activities: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(activities) }</span></span>
          <span>Misadventures: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ Misc.numberWithCommas(misadventures) }</span></span>
          <span>Time Spent: <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>{ timeSpent }</span></span>
        </div>
      </div>
    </div>
  );
}
const generateIndividualStrikesCompleted = (profileInfo, PresentationNodes, Records) => {
  var strikeInfo = [];
  const disabledRecords = [
    1438813765,2229373471,1827105928,2647057001,907161188,1628091546,4276872224,3608507543,2367932631,4237873551,2929326295,
    4066667911,4156350130,1911649721,896769581,602316980,602316983,2502625450,1214241085,1841174948
  ];
  for(var i in PresentationNodes[1256609117].children.records) {
    // eslint-disable-next-line
    if(!disabledRecords.find(recordHash => recordHash === PresentationNodes[1256609117].children.records[i].recordHash)) {
      strikeInfo.push(Records[PresentationNodes[1256609117].children.records[i].recordHash]);
    }
  }
  var strikeInfoLeft = strikeInfo.slice(Math.floor(strikeInfo.length / 2), strikeInfo.length);
  var strikeInfoRight = strikeInfo.slice(0, Math.floor(strikeInfo.length / 2));
  return (
    <div className="inspectBoxStatContent twoColumn">
      <div className="inspectBoxContentIcon twoColumn">
        <img alt="vanguardIcon" src="./images/icons/destiny/vanguard.png" style={{ width: '55px' }} />
      </div>
      <div className="inspectBoxContentStats twoColumn">
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
const generateIndividualRaidsCompleted = (profileInfo, PresentationNodes, Records) => {
  const lastWishFlawless = profileInfo.profileRecords.data.records[4177910003].objectives[0].complete;
  const scourgeFlawless = profileInfo.profileRecords.data.records[2648109757].objectives[0].complete;
  const crownFlawless = profileInfo.profileRecords.data.records[1558682416].objectives[0].complete;
  var raidInfoLeft = [
    { name: "Leviathan: Normal", info: Records[3420353827], flawless: false },
    { name: "Leviathan: Prestige", info: Records[940998165], flawless: false },
    { name: "Eater of Worlds: Normal", info: Records[2602370549], flawless: false },
    { name: "Eater of Worlds: Prestige", info: Records[3861076347], flawless: false },
    { name: "Spire of Stars: Normal", info: Records[1742345588], flawless: false },
    { name: "Spire of Stars: Prestige", info: Records[2923250426], flawless: false }
  ];
  var raidInfoRight = [
    { name: "Last Wish", info: Records[2195455623], flawless: lastWishFlawless },
    { name: "Scourge of the Past", info: Records[4060320345], flawless: scourgeFlawless },
    { name: "Crown of Sorrow", info: Records[1558682421], flawless: crownFlawless }
  ];
  return (
    <div className="inspectBoxStatContent twoColumn">
      <div className="inspectBoxContentIcon twoColumn">
        <img alt="raidIcon" src="./images/icons/destiny/raid.png" style={{ width: '55px' }} />
      </div>
      <div className="inspectBoxContentStats twoColumn">
        <div className="inspectBoxContentStatsDiv twoColumn">
          { buildRaids(raidInfoLeft, profileInfo) }
        </div>
        <div className="inspectBoxContentStatsDiv">
          { buildRaids(raidInfoRight, profileInfo) }
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
const buildRaids = (raidInfo, profileInfo) => {
  return raidInfo.map(function(raid) {
    return (
      profileInfo.profileRecords.data.records[raid.info.hash] ? (
        <span key={ raid.info.hash }>{ raid.name } { raid.flawless ? "*" : null }
          <span style={{ color: '#ccc', float: 'right', marginRight: '10px' }}>
            { profileInfo.profileRecords.data.records[raid.info.hash].objectives[0].progress }
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
