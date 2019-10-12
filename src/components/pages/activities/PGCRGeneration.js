import React from 'react';
import Error from '../../modules/Error';
import HistoricalStats from './HistoricalStats.json';
import * as globals from '../../scripts/Globals';

export function generate(PGCRs, activities, currentActivity) {
  const Manifest = globals.MANIFEST;
  const ManifestActivities = Manifest.DestinyActivityDefinition;
  const ManifestItems = Manifest.DestinyInventoryItemDefinition;
  const ManifestModifiers = Manifest.DestinyActivityModifierDefinition;

  if(ManifestActivities[PGCRs[currentActivity].activityDetails.referenceId].isPvP === true) {
    //If mode is PVP show PvP Display
    if(PGCRs[currentActivity].teams.length !== 0) {
      return (
        <div className="pgcrContainer">
          <div className="pgcrTopContainer" id={ `pgcrTopContainer_${ PGCRs[currentActivity].activityDetails.instanceId }` } style={ adjustEntriesBoxSizing(PGCRs[currentActivity]) } >
           <div className="pgcrPlayers" id={ `pgcrPlayers_${ PGCRs[currentActivity].activityDetails.instanceId }` }>
             { generateTeamData(ManifestItems, PGCRs, currentActivity, 'pvp', 'alpha') }
             { generateTeamData(ManifestItems, PGCRs, currentActivity, 'pvp', 'bravo') }
           </div>
           <div className="pgcrImage" style={{ backgroundImage: `url(https://bungie.net${ ManifestActivities[PGCRs[currentActivity].activityDetails.referenceId].pgcrImage })` }}></div>
         </div>
         <div className="pgcrBottomContainer">
           { generateExtendedData(ManifestItems, PGCRs, currentActivity, 'pvp') }
         </div>
      </div>
      )
    }
    else { return (<Error error="Failed to load PGCR, This data is most likely corrupted. Possible causes: 'Beet' error-code." />) }
  }
  else {
    //If mode is not pvp, then get display:
    if(PGCRs[currentActivity].activityDetails.mode === 4) { return raidPGCR(ManifestActivities, ManifestItems, ManifestModifiers, PGCRs, activities, currentActivity) }
    else { return defaultPGCR(ManifestActivities, ManifestItems, PGCRs, activities, currentActivity) }
  }
}

const defaultPGCR = (ManifestActivities, ManifestItems, PGCRs, activities, currentActivity) => {
  return (
    <div className="pgcrContainer">
      <div className="pgcrTopContainer" id={ `pgcrTopContainer_${ PGCRs[currentActivity].activityDetails.instanceId }` } style={{ height: "400px" }} >
        <div className="pgcrBigImage" style={{ backgroundImage: `url(https://bungie.net${ ManifestActivities[PGCRs[currentActivity].activityDetails.referenceId].pgcrImage })` }}></div>
      </div>
      <div className="pgcrBottomContainer">
        { generateExtendedData(ManifestItems, PGCRs, currentActivity, 'other') }
      </div>
    </div>
  )
}
const raidPGCR = (ManifestActivities, ManifestItems, ManifestModifiers, PGCRs, activities, currentActivity) => {
  const activity = PGCRs[currentActivity];
  const activityData = activities.find(e => e.activityDetails.instanceId === activity.activityDetails.instanceId); console.log(activityData);
  const manifestActivityData = ManifestActivities[activity.activityDetails.referenceId]; console.log(manifestActivityData);
  var modifiers = []; for(var i in manifestActivityData.modifiers) { if(!modifiers.find(modifier => modifier.activityModifierHash === manifestActivityData.modifiers[i].activityModifierHash)) { modifiers.push(manifestActivityData.modifiers[i]); } }
  var mostKills = { "name": activity.entries[0].player.bungieNetUserInfo.displayName, "value": activity.entries[0].values.kills.basic.value };
  var mostDeaths = { "name": activity.entries[0].player.bungieNetUserInfo.displayName, "value": activity.entries[0].values.deaths.basic.value };
  for(var i in activity.entries) {
    //Get Most Kills
    if(activity.entries[i].values.kills.basic.value > mostKills.value){ mostKills = { "name": activity.entries[i].player.bungieNetUserInfo.displayName, "value": activity.entries[i].values.kills.basic.value } }
    //Get Most Deaths
    if(activity.entries[i].values.deaths.basic.value > mostDeaths.value){ mostDeaths = { "name": activity.entries[i].player.bungieNetUserInfo.displayName, "value": activity.entries[i].values.deaths.basic.value } }
  }
  return (
    <div className="pgcrContainer">
      <div className="pgcrTopContainer" id={ `pgcrTopContainer_${ activity.activityDetails.instanceId }` } style={{ height: "400px" }} >
        <div className="pgcrDetails">
          <div className="pgcrDetailsTitle"> { manifestActivityData.displayProperties.name } </div>
            <div className="pgcrInnerDetailsContainer">
              <div className="pgcrInnerDetails">
                <div className="pgcrDetailsTimePlayed">Time: { activityData.values.activityDurationSeconds.basic.displayValue } </div>
                <div className="pgcrDetailsCompleted">Completed: { activityData.values.completed.basic.displayValue } </div>
              </div>
              <div className="pgcrMedals">
                <div className="pgcrDetailsMedal kills">
                  <div>Most Kills: </div>
                  <div>{ mostKills.name } ({ mostKills.value })</div>
                </div>
                <div className="pgcrDetailsMedal deaths">
                  <div>Most Deaths:</div>
                  <div>{ mostDeaths.name } ({ mostDeaths.value })</div>
                </div>
              </div>
            </div>
          </div>
        <div className="pgcrImage" style={{ backgroundImage: `url(https://bungie.net${ ManifestActivities[activity.activityDetails.referenceId].pgcrImage })` }}>
          <div className="pgcrModifiers">
            {
              modifiers.map(function(modifier) {
                return (
                  <div className="pgcrModifier" style={{ backgroundImage: `url(https://bungie.net${ ManifestModifiers[modifier.activityModifierHash].displayProperties.icon })` }}>
                    <div className="pgcrModifierContainer">
                      <div className="pgcrModifierName">{ ManifestModifiers[modifier.activityModifierHash].displayProperties.name }</div>
                      <div className="pgcrModifierDesc">{ ManifestModifiers[modifier.activityModifierHash].displayProperties.description }</div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <div className="pgcrBottomContainer">
        { generateExtendedData(ManifestItems, PGCRs, currentActivity, 'other') }
      </div>
    </div>
  )
}

const generateTeamData = (ManifestItems, PGCRs, currentActivity, modeType, team) => {
  if(team === 'alpha') {
    // eslint-disable-next-line
    var teamData = PGCRs[currentActivity].teams.find(team => team.teamId === 17);
    return <div className="pgcrAlphaTeam">
      <div className="pgcrAlphaTeamTitle">{ teamData.standing.basic.displayValue }: Alpha Team - { teamData.score.basic.value }
        <div title="Score">S</div>
        <div title="Kills">K</div>
        <div title="Deaths">D</div>
        <div title="K/D Ratio">K/D</div>
        <div title="Efficiency - K+A/D">KA/D</div>
      </div>
      { generatePlayerData(ManifestItems, PGCRs, currentActivity, 'pvp', 'alpha') }
    </div>
  }
  else if(team === 'bravo') {
    // eslint-disable-next-line
    var teamData = PGCRs[currentActivity].teams.find(team => team.teamId === 18);
    return <div className="pgcrBravoTeam">
      <div className="pgcrBravoTeamTitle">{ teamData.standing.basic.displayValue }: Bravo Team - { teamData.score.basic.value }
        <div title="Score">S</div>
        <div title="Kills">K</div>
        <div title="Deaths">D</div>
        <div title="K/D Ratio">K/D</div>
        <div title="Efficiency - K+A/D">KA/D</div>
      </div>
      { generatePlayerData(ManifestItems, PGCRs, currentActivity, 'pvp', 'bravo') }
    </div>
  }
}
const generatePlayerData = (ManifestItems, PGCRs, currentActivity, modeType, team) => {
  if(team === 'alpha') {
    // eslint-disable-next-line
    return PGCRs[currentActivity].entries.map(function (playerData) {
      if(playerData.values.team.basic.value === 17.0) {
        return (
          <div key={ playerData.player.destinyUserInfo.membershipId } className={ checkPlayer(playerData.player.destinyUserInfo.displayName, team) } id={`player_${ playerData.player.destinyUserInfo.membershipId }`}>
            <div style={{ textAlign: 'left' }}><span className="pgcrPlayerName" id={ playerData.player.destinyUserInfo.membershipId }>{ playerData.player.destinyUserInfo.displayName }</span></div>
            <div><span>{ playerData.values.score.basic.displayValue }</span></div>
            <div><span>{ playerData.values.kills.basic.displayValue }</span></div>
            <div><span>{ playerData.values.deaths.basic.displayValue }</span></div>
            <div><span>{ playerData.values.killsDeathsRatio.basic.displayValue }</span></div>
            <div><span>{ playerData.values.efficiency.basic.displayValue }</span></div>
          </div>
        )
      }
    })
  }
  else if(team === 'bravo') {
    // eslint-disable-next-line
    return PGCRs[currentActivity].entries.map(function (playerData) {
      if(playerData.values.team.basic.value === 18.0) {
        return (
          <div key={ playerData.player.destinyUserInfo.membershipId } className={ checkPlayer(playerData.player.destinyUserInfo.displayName, team) } id={`player_${ playerData.player.destinyUserInfo.membershipId }`}>
            <div style={{ textAlign: 'left' }}><span className="pgcrPlayerName" id={ playerData.player.destinyUserInfo.membershipId }>{ playerData.player.destinyUserInfo.displayName }</span></div>
            <div><span>{ playerData.values.score.basic.displayValue }</span></div>
            <div><span>{ playerData.values.kills.basic.displayValue }</span></div>
            <div><span>{ playerData.values.deaths.basic.displayValue }</span></div>
            <div><span>{ playerData.values.killsDeathsRatio.basic.displayValue }</span></div>
            <div><span>{ playerData.values.efficiency.basic.displayValue }</span></div>
          </div>
        )
      }
    })
  }
}
const generateExtendedData = (ManifestItems, PGCRs, currentActivity, modeType) => {
  const allPlayers = PGCRs[currentActivity].entries.sort(function(a, b){return a.score - b.score});
  const goldIronBannerMedals = ["Medals_pvp_medal_ib_control_3a", "Medals_pvp_medal_ib_control_3b", "Medals_pvp_medal_ib_multi_entire_team", "Medals_pvp_medal_ib_multi_7x", "Medals_pvp_medal_ib_streak_huge", "Medals_pvp_medal_ib_streak_lg", "Medals_pvp_medal_ib_streak_no_damage", "Medals_pvp_medal_ib_streak_shutdown_large", "Medals_pvp_medal_ib_match_undefeated"];
  const silverIronBannerMedals = ["Medals_pvp_medal_ib_control_2a", "Medals_pvp_medal_ib_control_2b", "Medals_pvp_medal_ib_control_2c", "Medals_pvp_medal_ib_control_2d", "Medals_pvp_medal_ib_multi_6x", "Medals_pvp_medal_ib_multi_5x", "Medals_pvp_medal_ib_multi_4x", "Medals_pvp_medal_ib_streak_med", "Medals_pvp_medal_ib_streak_team", "Medals_pvp_medal_ib_match_blowout", "Medals_pvp_medal_ib_match_most_damage", "Medals_pvp_medal_ib_match_comeback", "Medals_pvp_medal_ib_match_never_trailed", "Medals_pvp_medal_ib_match_overtime", "Medals_pvp_medal_ib_cycle"];
  const bronzeIronBannerMedals = ["Medals_pvp_medal_ib_control_1a", "Medals_pvp_medal_ib_control_1b", "Medals_pvp_medal_ib_control_1c", "Medals_pvp_medal_ib_control_1d", "Medals_pvp_medal_ib_multi_3x", "Medals_pvp_medal_ib_multi_2x", "Medals_pvp_medal_ib_payback", "Medals_pvp_medal_ib_avenger", "Medals_pvp_medal_ib_defender", "Medals_pvp_medal_ib_streak_sm", "Medals_pvp_medal_ib_streak_comeback", "Medals_pvp_medal_ib_streak_shutdown", "Medals_pvp_medal_ib_streak_combined", "Medals_pvp_medal_ib_first_strike", "Medals_pvp_medal_ib_super_shutdown"];
  return allPlayers.map((playerData) => (
    <div key={ playerData.player.destinyUserInfo.membershipId } className={ modeType === "pvp" ? "pgcrExtendedInfo pvp" : "pgcrExtendedInfo other" }>
      <div className="pgcrExtendedInfoStats">
        <div className="innerDiv" style={{ backgroundImage: `url("https://bungie.net${ ManifestItems[playerData.player.emblemHash].secondaryIcon }"` }}>
          <div className="pgcrExtendedPlayerName">{ playerData.player.destinyUserInfo.displayName }</div>
        </div>
        <span>Class: { playerData.player.characterClass }</span>
        <span>Kills: { playerData.values.kills.basic.displayValue }</span>
        <span>Assists: { playerData.values.assists.basic.displayValue }</span>
        <span>Deaths: { playerData.values.deaths.basic.displayValue }</span>
      </div>
      <div className="pgcrExtendedInfoWeaponKills">
        {
          playerData.extended.weapons ?
            playerData.extended.weapons.map((weapon) => (
              <div key={ weapon.referenceId } className="pgcrItemContainer">
                <img alt={ ManifestItems[weapon.referenceId].displayProperties.name } src={ 'https://bungie.net' + ManifestItems[weapon.referenceId].displayProperties.icon } className="pgcrItemIcon" />x{ weapon.values.uniqueWeaponKills.basic.displayValue }
                <div className="pgcrItemInfo">
                  <div className="title">{ ManifestItems[weapon.referenceId].displayProperties.name }</div>
                  <div className="description">{ ManifestItems[weapon.referenceId].displayProperties.description }</div>
                </div>
              </div>
            )) :
          <div>No Weapon Data</div>
        }
        {
          playerData.extended.values.weaponKillsGrenade.basic.displayValue !== '0' ?
          <div key="grenadeKills"><img alt="grenade" src="./images/icons/Grenade.png" className="pgcrItemIcon" title="Grenade Kills" />x{ playerData.extended.values.weaponKillsGrenade.basic.displayValue }</div> : null
        }
        {
          playerData.extended.values.weaponKillsMelee.basic.displayValue !== '0' ?
          <div key="meleeKills"><img alt="melee" src="./images/icons/Melee.png" className="pgcrItemIcon" title="Melee Kills" />x{ playerData.extended.values.weaponKillsMelee.basic.displayValue }</div> : null
        }
        {
          playerData.extended.values.weaponKillsSuper.basic.displayValue !== '0' ?
          <div key="superKills"><img alt="super" src="./images/icons/Super.png" className="pgcrItemIcon" title="Super Kills" />x{ playerData.extended.values.weaponKillsSuper.basic.displayValue }</div> : null
        }
      </div>
      { modeType === 'pvp' ?
        <div className="pgcrExtendedInfoMedalsEarned">
          {
            Object.keys(playerData.extended.values).map(function(medal) {
              if(medal.includes('medal')) {
                return (
                  <div className="medalContainer">
                    {
                      goldIronBannerMedals.find(e => e === medal) ? ( <img key={ medal } id={ medal } alt={ medal } className="pgcrMedalIcon" src={'./images/icons/medals/ib_gold.png'} /> ) : (
                        silverIronBannerMedals.find(e => e === medal) ? ( <img key={ medal } id={ medal } alt={ medal } className="pgcrMedalIcon" src={'./images/icons/medals/ib_silver.png'} /> ) : (
                          bronzeIronBannerMedals.find(e => e === medal) ? ( <img key={ medal } id={ medal } alt={ medal } className="pgcrMedalIcon" src={'./images/icons/medals/ib_bronze.png'} /> ) : (
                            ( <img key={ medal } id={ medal } alt={ medal } className="pgcrMedalIcon" src={'./images/icons/medals/' + medal + '.png'} /> )
                          )
                        )
                      )
                    }
                    <div className="medalInfoContainer">
                      <div className="medalInfoName">{ HistoricalStats[medal].statName } x{ playerData.extended.values[medal].basic.value }</div>
                      <div className="medalInfoDesc">{ HistoricalStats[medal].statDescription }</div>
                    </div>
                  </div>
                );
              }
              else { return null }
            })
          }
        </div>
      : null
      }
      <div className="pgcrExtendedInfoBG"><img alt="pgcrBGicon" className="pgcrExtendedInfoBGImage" style={{ backgroundImage: `url("https://bungie.net${ ManifestItems[playerData.player.emblemHash].secondarySpecial }")` }} /></div>
    </div>
  ))
}
const checkPlayer = (displayName, team) => {
  if(team === null) { return 'pgcrPlayersBlob' }
  else { return JSON.parse(localStorage.getItem("SelectedAccount")).name.includes(displayName) ? 'pgcrCurrPlayersBlob' : 'pgcrPvpPlayersBlob' }
}
function adjustEntriesBoxSizing(activity) {
  if(activity.entries.length > 6) { const heightOf = activity.entries.length * 25 + 48; return { height: heightOf }; }
  else { return { height: '250px' }; }
}
