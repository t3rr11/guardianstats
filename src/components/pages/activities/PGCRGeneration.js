import React, { Component } from 'react';

export function generate(ManifestActivities, ManifestItems, PGCRs, currentActivity) {
  if(ManifestActivities[PGCRs[currentActivity].activityDetails.referenceId].isPvP === true) {
    //If mode is PVP show PvP Display
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
  else {
    //If mode is not pvp, then display default display
    return (
      <div className="pgcrContainer">
        <div className="pgcrTopContainer" id={ `pgcrTopContainer_${ PGCRs[currentActivity].activityDetails.instanceId }` } style={ adjustEntriesBoxSizing(PGCRs[currentActivity]) } >
         <div className="pgcrPlayers" id={ `pgcrPlayers_${ PGCRs[currentActivity].activityDetails.instanceId }` }>
           { generateTeamData(ManifestItems, PGCRs, currentActivity, 'other', null) }
           { generatePlayerData(ManifestItems, PGCRs, currentActivity, 'other', null) }
         </div>
         <div className="pgcrImage" style={{ backgroundImage: `url(https://bungie.net${ ManifestActivities[PGCRs[currentActivity].activityDetails.referenceId].pgcrImage })` }}></div>
       </div>
       <div className="pgcrBottomContainer">
         { generateExtendedData(ManifestItems, PGCRs, currentActivity, 'other') }
       </div>
    </div>
    )
  }
}

const generateTeamData = (ManifestItems, PGCRs, currentActivity, modeType, team) => {
  if(team === null) {
    return <div className="pgcrPlayersTitle">
      <div>Players</div>
      <div>K</div>
      <div>A</div>
      <div>D</div>
    </div>
  }
  else if(team === 'alpha') {
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
  if(team === null) {
    return PGCRs[currentActivity].entries.map((playerData) => (
      <div key={ playerData.player.destinyUserInfo.membershipId } className={ checkPlayer(playerData.player.destinyUserInfo.displayName, team) } id={`player_${ playerData.player.destinyUserInfo.membershipId }`}>
        <div style={{ textAlign: 'left' }}><span className="pgcrPlayerName" id={ playerData.player.destinyUserInfo.membershipId }>{ playerData.player.destinyUserInfo.displayName }</span></div>
        <div><span>{ playerData.values.kills.basic.displayValue }</span></div>
        <div><span>{ playerData.values.assists.basic.displayValue }</span></div>
        <div><span>{ playerData.values.deaths.basic.displayValue }</span></div>
      </div>
    ))
  }
  else if(team === 'alpha') {
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
    return allPlayers.map((playerData) => (
    <div key={ playerData.player.destinyUserInfo.membershipId } className="pgcrExtendedInfo">
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
              <div key={ weapon.referenceId }>
                <img src={ 'https://bungie.net' + ManifestItems[weapon.referenceId].displayProperties.icon } className="pgcrItemIcon" title={ ManifestItems[weapon.referenceId].displayProperties.name } />x{ weapon.values.uniqueWeaponKills.basic.displayValue }
              </div>
            )) :
          <div>No Weapon Data</div>
        }
        {
          playerData.extended.values.weaponKillsGrenade.basic.displayValue !== '0' ?
          <div key="grenadeKills">
            <img src="./images/icons/Grenade.png" className="pgcrItemIcon" title="Grenade Kills" />x{ playerData.extended.values.weaponKillsGrenade.basic.displayValue }
          </div> : null
        }
        {
          playerData.extended.values.weaponKillsMelee.basic.displayValue !== '0' ?
          <div key="meleeKills">
            <img src="./images/icons/Melee.png" className="pgcrItemIcon" title="Melee Kills" />x{ playerData.extended.values.weaponKillsMelee.basic.displayValue }
          </div> : null
        }
        {
          playerData.extended.values.weaponKillsSuper.basic.displayValue !== '0' ?
          <div key="superKills">
            <img src="./images/icons/Super.png" className="pgcrItemIcon" title="Super Kills" />x{ playerData.extended.values.weaponKillsSuper.basic.displayValue }
          </div> : null
        }
      </div>
      { modeType === 'pvp' ?
        <div className="pgcrExtendedInfoMedalsEarned">
          {
            Object.keys(playerData.extended.values).map(function(medal) {
              //const medalData = playerData.extended.values[medal];
              if(medal.includes('medal')) {
                return (
                  <img id={ medal } className="pgcrMedalIcon" src={'./images/icons/medals/' + medal + '.png'} title={ medal } />
                )
              }
            })
          }
        </div>
      : null
    }
    </div>
  ))
}
const checkPlayer = (displayName, team) => {
  if(team === null) { return 'pgcrPlayersBlob' }
  else { return JSON.parse(localStorage.getItem('BasicMembershipInfo')).displayName.includes(displayName) ? 'pgcrCurrPlayersBlob' : 'pgcrPvpPlayersBlob' }
}
function adjustEntriesBoxSizing(activity) {
  if(activity.entries.length > 6) { const heightOf = activity.entries.length * 25 + 48; return { height: heightOf }; }
  else { return { height: '250px' }; }
}
