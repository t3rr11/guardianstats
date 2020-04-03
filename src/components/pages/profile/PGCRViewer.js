import React, { Component } from 'react';
import ProfileCard from './ProfileCard';
import SmallLoader from '../../modules/SmallLoader';
import HistoricalStats from './HistoricalStats.json';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

import { modeTypes, modes } from '../../scripts/ModeTypes';
import * as checks from '../../scripts/Checks';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as Misc from '../../Misc';

var ActivityWatcher = null;
var isMounted = true;

export class PGCRViewer extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: '' },
    currentPGCR: null,
    currentActivity: null,
    profileCard: null,
  }

  async componentDidMount() {
    //On component load we want to process the PGCRs from props.
    this.renderPGCRViewer();
  }
  async componentDidUpdate(prevProps) {
    //If props updated usually responding to clicks then update the state again.
    if(this.state.currentActivity !== this.props.currentActivity) {
      this.renderPGCRViewer();
    }
  }
  renderPGCRViewer() {
    this.setState({
      status: { status: 'ready', statusText: 'Finished loading...' },
      currentPGCR: this.props.PGCRs[this.props.currentActivity],
      currentActivity: this.props.currentActivity
    });
  }

  render() {
    //Get state components
    const { status, statusText } = this.state.status;
    const { currentPGCR, currentActivity, profileCard } = this.state;
    const Manifest = globals.MANIFEST;
    const ManifestActivities = Manifest.DestinyActivityDefinition;
    const ManifestItems = Manifest.DestinyInventoryItemDefinition;
    const ManifestModifiers = Manifest.DestinyActivityModifierDefinition;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      if(currentPGCR) {
        return (
          <div>
            { setupPGCR(ManifestActivities, ManifestItems, currentPGCR, currentActivity, this) }
            { profileCard !== null ? (<ProfileCard data={ profileCard } />) : null }
          </div>
        );
      }
      else { return ( <Loader statusText="Still loading this PGCR, shouldn't be much longer!" /> ) }
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

const setupPGCR = (ManifestActivities, ManifestItems, currentPGCR, currentActivity, parent) => {
  if(ManifestActivities[currentPGCR.activityDetails.referenceId].isPvP === true) {
    if(currentPGCR.teams.length !== 0) {
      return (
        <div className="pgcrContainer">
          <div className="pgcrTopContainer" id={ `pgcrTopContainer_${ currentPGCR.activityDetails.instanceId }` } style={ adjustEntriesBoxSizing(currentPGCR) } >
           <div className="pgcrPlayers" id={ `pgcrPlayers_${ currentPGCR.activityDetails.instanceId }` }>
             { generateTeamData(ManifestItems, currentPGCR, currentActivity, 'pvp', 'alpha', parent) }
             { generateTeamData(ManifestItems, currentPGCR, currentActivity, 'pvp', 'bravo', parent) }
           </div>
           <div className="pgcrImage" style={{ backgroundImage: `url(https://bungie.net${ ManifestActivities[currentPGCR.activityDetails.referenceId].pgcrImage })` }}></div>
         </div>
         <div className="pgcrBottomContainer">
           { generateExtendedData(ManifestItems, currentPGCR, currentActivity, 'pvp', parent) }
         </div>
      </div>
      )
    }
    else { return (<Error error="Failed to load PGCR, This data is most likely corrupted. Possible causes: 'Beet' error-code." />) }
  }
  else {
    if(currentPGCR.activityDetails.mode === 63 || currentPGCR.activityDetails.mode === 75) {
      if(currentPGCR.teams.length !== 0) {
        return (
          <div className="pgcrContainer">
            <div className="pgcrTopContainer" id={ `pgcrTopContainer_${ currentPGCR.activityDetails.instanceId }` } style={ adjustEntriesBoxSizing(currentPGCR) } >
             <div className="pgcrPlayers" id={ `pgcrPlayers_${ currentPGCR.activityDetails.instanceId }` }>
                { generateTeamData(ManifestItems, currentPGCR, currentActivity, 'gambit', 'alpha', parent) }
                { generateTeamData(ManifestItems, currentPGCR, currentActivity, 'gambit', 'bravo', parent) }
              </div>
              <div className="pgcrImage" style={{ backgroundImage: `url(https://bungie.net${ ManifestActivities[currentPGCR.activityDetails.referenceId].pgcrImage })` }}></div>
            </div>
            <div className="pgcrBottomContainer">
              { generateExtendedData(ManifestItems, currentPGCR, currentActivity, 'gambit', parent) }
            </div>
          </div>
        )
      }
      else { return (<Error error="Failed to load PGCR, This data is most likely corrupted. Possible causes: 'Beet' error-code." />) }
    }
    else if(currentPGCR.activityDetails.mode === 4) {
      //Load Raid PGCR
      const manifestActivityData = ManifestActivities[currentPGCR.activityDetails.referenceId];
      const currentActivityData = parent.props.activities.find(e => e.activityDetails.instanceId === currentPGCR.activityDetails.instanceId);
      var mostKills = { "name": currentPGCR.entries[0].player.destinyUserInfo.displayName, "value": currentPGCR.entries[0].values.kills.basic.value };
      var mostDeaths = { "name": currentPGCR.entries[0].player.destinyUserInfo.displayName, "value": currentPGCR.entries[0].values.deaths.basic.value };
      var leastKills = { "name": currentPGCR.entries[0].player.destinyUserInfo.displayName, "value": currentPGCR.entries[0].values.kills.basic.value };
      var leastDeaths = { "name": currentPGCR.entries[0].player.destinyUserInfo.displayName, "value": currentPGCR.entries[0].values.deaths.basic.value };
      for(var i in currentPGCR.entries) {
        if(currentPGCR.entries[i].values.kills.basic.value > mostKills.value){ mostKills = { "name": currentPGCR.entries[i].player.destinyUserInfo.displayName, "value": currentPGCR.entries[i].values.kills.basic.value } }
        if(currentPGCR.entries[i].values.deaths.basic.value > mostDeaths.value){ mostDeaths = { "name": currentPGCR.entries[i].player.destinyUserInfo.displayName, "value": currentPGCR.entries[i].values.deaths.basic.value } }
        if(currentPGCR.entries[i].values.kills.basic.value < leastKills.value){ leastKills = { "name": currentPGCR.entries[i].player.destinyUserInfo.displayName, "value": currentPGCR.entries[i].values.kills.basic.value } }
        if(currentPGCR.entries[i].values.deaths.basic.value < leastDeaths.value){ leastDeaths = { "name": currentPGCR.entries[i].player.destinyUserInfo.displayName, "value": currentPGCR.entries[i].values.deaths.basic.value } }
      }
      return (
        <div className="pgcrContainer">
          <div className="pgcrTopContainer" id={ `pgcrTopContainer_${ currentPGCR.activityDetails.instanceId }` } style={{ height: "400px" }} >
            <div className="pgcrDetails">
              <div className="pgcrDetailsTitle"> { manifestActivityData.displayProperties.name } </div>
                <div className="pgcrInnerDetailsContainer">
                  <div className="pgcrInnerDetails">
                    <div className="pgcrDetailsTimePlayed">Time: { currentActivityData.values.activityDurationSeconds.basic.displayValue } </div>
                    <div className="pgcrDetailsCompleted">Completed: { currentActivityData.values.completed.basic.displayValue } </div>
                  </div>
                  <div className="pgcrMedals">
                    <div className="pgcrDetailsMedal kills">
                      <div>Most Kills: </div>
                      <div>{ mostKills.name } ({ mostKills.value })</div>
                    </div>
                    <div className="pgcrDetailsMedal kills">
                      <div>Least Kills: </div>
                      <div>{ leastKills.name } ({ leastKills.value })</div>
                    </div>
                    <div className="pgcrDetailsMedal deaths">
                      <div>Most Deaths:</div>
                      <div>{ mostDeaths.name } ({ mostDeaths.value })</div>
                    </div>
                    <div className="pgcrDetailsMedal deaths">
                      <div>Least Deaths:</div>
                      <div>{ leastDeaths.name } ({ leastDeaths.value })</div>
                    </div>
                  </div>
                </div>
              </div>
            <div className="pgcrImage" style={{ backgroundImage: `url(https://bungie.net${ ManifestActivities[currentPGCR.activityDetails.referenceId].pgcrImage })` }}>
            </div>
          </div>
          <div className="pgcrBottomContainer">
            { generateExtendedData(ManifestItems, currentPGCR, currentActivity, 'other', parent) }
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="pgcrContainer">
          <div className="pgcrTopContainer" id={ `pgcrTopContainer_${ currentPGCR.activityDetails.instanceId }` } style={{ height: "400px" }} >
            <div className="pgcrBigImage" style={{ backgroundImage: `url(https://bungie.net${ ManifestActivities[currentPGCR.activityDetails.referenceId].pgcrImage })` }}></div>
          </div>
          <div className="pgcrBottomContainer">
            { generateExtendedData(ManifestItems, currentPGCR, currentActivity, 'other', parent) }
          </div>
        </div>
      )
    }
  }
}
const generateTeamData = (ManifestItems, currentPGCR, currentActivity, modeType, team, parent) => {
  if(modeType === 'pvp') {
    if(team === 'alpha') {
      var alphaTeamData = currentPGCR.teams.find(team => team.teamId === 17);
      if(alphaTeamData) {
        return (
          <div className="pgcrAlphaTeam">
            <div className="pgcrAlphaTeamTitle">{ alphaTeamData.standing.basic.displayValue }: Alpha Team - { alphaTeamData.score.basic.value }
              <div title="Score">S</div>
              <div title="Kills">K</div>
              <div title="Deaths">D</div>
              <div title="K/D Ratio">K/D</div>
              <div title="Efficiency - K+A/D">KA/D</div>
            </div>
            { generatePlayerData(ManifestItems, currentPGCR, currentActivity, 'pvp', 'alpha', parent) }
          </div>
        )
      }
      else { return null }
    }
    else if(team === 'bravo') {
      var bravoTeamData = currentPGCR.teams.find(team => team.teamId === 18);
      if(bravoTeamData) {
        return (
          <div className="pgcrBravoTeam">
            <div className="pgcrBravoTeamTitle">{ bravoTeamData.standing.basic.displayValue }: Bravo Team - { bravoTeamData.score.basic.value }
              <div title="Score">S</div>
              <div title="Kills">K</div>
              <div title="Deaths">D</div>
              <div title="K/D Ratio">K/D</div>
              <div title="Efficiency - K+A/D">KA/D</div>
            </div>
            { generatePlayerData(ManifestItems, currentPGCR, currentActivity, 'pvp', 'bravo', parent) }
          </div>
        )
      }
      else { return null }
    }
  }
}
const generatePlayerData = (ManifestItems, currentPGCR, currentActivity, modeType, team, parent) => {
  if(modeType === 'pvp') {
    if(team === 'alpha') {
      // eslint-disable-next-line
      return currentPGCR.entries.map(function (playerData) {
        if(playerData.values.team.basic.value === 17.0) {
          return (
            <div key={ playerData.player.destinyUserInfo.membershipId } className={ checkPlayer(playerData.player.destinyUserInfo.displayName, modeType, team) } id={`player_${ playerData.player.destinyUserInfo.membershipId }`}>
              <div style={{ textAlign: 'left' }}><span className="pgcrPlayerName" id={ playerData.player.destinyUserInfo.membershipId } onClick={ (() => updateProfileCard(parent, { "characterId": playerData.characterId, "membershipId": playerData.player.destinyUserInfo.membershipId, "membershipType": playerData.player.destinyUserInfo.membershipType }, "pvp") ) }>{ playerData.player.destinyUserInfo.displayName }</span></div>
              <div><span>{ playerData.values.score.basic.displayValue }</span></div>
              <div><span>{ playerData.values.kills.basic.displayValue }</span></div>
              <div><span>{ playerData.values.deaths.basic.displayValue }</span></div>
              <div><span style={{ color: playerData.values.killsDeathsRatio.basic.displayValue >= 1 ? "limegreen":"tomato", filter: "contrast(0.7)" }}>{ playerData.values.killsDeathsRatio.basic.displayValue }</span></div>
              <div><span style={{ color: playerData.values.efficiency.basic.displayValue >= 1 ? "limegreen":"tomato", filter: "contrast(0.7)" }}>{ playerData.values.efficiency.basic.displayValue }</span></div>
            </div>
          )
        }
      })
    }
    else if(team === 'bravo') {
      // eslint-disable-next-line
      return currentPGCR.entries.map(function (playerData) {
        if(playerData.values.team.basic.value === 18.0) {
          return (
            <div key={ playerData.player.destinyUserInfo.membershipId } className={ checkPlayer(playerData.player.destinyUserInfo.displayName, modeType, team) } id={`player_${ playerData.player.destinyUserInfo.membershipId }`}>
              <div style={{ textAlign: 'left' }}><span className="pgcrPlayerName" id={ playerData.player.destinyUserInfo.membershipId } onClick={ (() => updateProfileCard(parent, { "characterId": playerData.characterId, "membershipId": playerData.player.destinyUserInfo.membershipId, "membershipType": playerData.player.destinyUserInfo.membershipType }, "pvp") ) }>{ playerData.player.destinyUserInfo.displayName }</span></div>
              <div><span>{ playerData.values.score.basic.displayValue }</span></div>
              <div><span>{ playerData.values.kills.basic.displayValue }</span></div>
              <div><span>{ playerData.values.deaths.basic.displayValue }</span></div>
              <div><span style={{ color: playerData.values.killsDeathsRatio.basic.displayValue >= 1 ? "limegreen":"tomato", filter: "contrast(0.7)" }}>{ playerData.values.killsDeathsRatio.basic.displayValue }</span></div>
              <div><span style={{ color: playerData.values.efficiency.basic.displayValue >= 1 ? "limegreen":"tomato", filter: "contrast(0.7)" }}>{ playerData.values.efficiency.basic.displayValue }</span></div>
            </div>
          )
        }
      })
    }
  }
}
const generateExtendedData = (ManifestItems, currentPGCR, currentActivity, modeType, parent) => {
  const allPlayers = currentPGCR.entries.sort(function(a, b){return a.score - b.score});
  return allPlayers.map((playerData) => (
    <div key={ playerData.player.destinyUserInfo.membershipId } className={ modeType === "pvp" ? "pgcrExtendedInfo pvp" : (modeType === "gambit" ? "pgcrExtendedInfo pvp" : "pgcrExtendedInfo other") }>
      <div className="pgcrExtendedInfoStats">
        <div className="innerDiv" style={{ backgroundImage: `url("https://bungie.net${ ManifestItems[playerData.player.emblemHash].secondaryIcon }"` }}>
          <div className="pgcrExtendedPlayerName" onClick={ (() => updateProfileCard(parent, { "characterId": playerData.characterId, "membershipId": playerData.player.destinyUserInfo.membershipId, "membershipType": playerData.player.destinyUserInfo.membershipType }, modeType)) }>{ playerData.player.destinyUserInfo.displayName }</div>
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
        { playerData.extended.values.weaponKillsGrenade.basic.displayValue !== '0' ? <div key="grenadeKills"><img alt="grenade" src="./images/icons/Grenade.png" className="pgcrItemIcon" title="Grenade Kills" />x{ playerData.extended.values.weaponKillsGrenade.basic.displayValue }</div> : null }
        { playerData.extended.values.weaponKillsMelee.basic.displayValue !== '0' ? <div key="meleeKills"><img alt="melee" src="./images/icons/Melee.png" className="pgcrItemIcon" title="Melee Kills" />x{ playerData.extended.values.weaponKillsMelee.basic.displayValue }</div> : null }
        { playerData.extended.values.weaponKillsSuper.basic.displayValue !== '0' ? <div key="superKills"><img alt="super" src="./images/icons/Super.png" className="pgcrItemIcon" title="Super Kills" />x{ playerData.extended.values.weaponKillsSuper.basic.displayValue }</div> : null }
      </div>
      { modeType === 'pvp' ?
        <div className="pgcrExtendedInfoMedalsEarned">
          {
            Object.keys(playerData.extended.values).map((medal) => {
              if(medal.includes('medal')) {
                return (
                  <div key={ medal } className="medalContainer">
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
      { modeType === 'gambit' ?
        <div className="pgcrExtendedInfoMedalsEarned">
          {
            Object.keys(playerData.extended.values).map(function(medal) {
              if(medal.includes('medal')) {
                return (
                  <div className="medalContainer">
                    <img key={ medal } id={ medal } alt={ medal } className="pgcrMedalIcon" src={'./images/icons/medals/' + medal + '.png'} />
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
const goldIronBannerMedals = ["Medals_pvp_medal_ib_control_3a", "Medals_pvp_medal_ib_control_3b", "Medals_pvp_medal_ib_multi_entire_team", "Medals_pvp_medal_ib_multi_7x", "Medals_pvp_medal_ib_streak_huge", "Medals_pvp_medal_ib_streak_lg", "Medals_pvp_medal_ib_streak_no_damage", "Medals_pvp_medal_ib_streak_shutdown_large", "Medals_pvp_medal_ib_match_undefeated"];
const silverIronBannerMedals = ["Medals_pvp_medal_ib_control_2a", "Medals_pvp_medal_ib_control_2b", "Medals_pvp_medal_ib_control_2c", "Medals_pvp_medal_ib_control_2d", "Medals_pvp_medal_ib_multi_6x", "Medals_pvp_medal_ib_multi_5x", "Medals_pvp_medal_ib_multi_4x", "Medals_pvp_medal_ib_streak_med", "Medals_pvp_medal_ib_streak_team", "Medals_pvp_medal_ib_match_blowout", "Medals_pvp_medal_ib_match_most_damage", "Medals_pvp_medal_ib_match_comeback", "Medals_pvp_medal_ib_match_never_trailed", "Medals_pvp_medal_ib_match_overtime", "Medals_pvp_medal_ib_cycle"];
const bronzeIronBannerMedals = ["Medals_pvp_medal_ib_control_1a", "Medals_pvp_medal_ib_control_1b", "Medals_pvp_medal_ib_control_1c", "Medals_pvp_medal_ib_control_1d", "Medals_pvp_medal_ib_multi_3x", "Medals_pvp_medal_ib_multi_2x", "Medals_pvp_medal_ib_payback", "Medals_pvp_medal_ib_avenger", "Medals_pvp_medal_ib_defender", "Medals_pvp_medal_ib_streak_sm", "Medals_pvp_medal_ib_streak_comeback", "Medals_pvp_medal_ib_streak_shutdown", "Medals_pvp_medal_ib_streak_combined", "Medals_pvp_medal_ib_first_strike", "Medals_pvp_medal_ib_super_shutdown"];
const checkPlayer = (displayName, modeType, team) => {
  if(localStorage.getItem("SelectedAccount")) {
    if(modeType === 'pvp') { return JSON.parse(localStorage.getItem("SelectedAccount")).name.includes(displayName) ? 'pgcrCurrPlayersBlob' : 'pgcrPvpPlayersBlob' }
    else if(modeType === 'gambit') { return JSON.parse(localStorage.getItem("SelectedAccount")).name.includes(displayName) ? 'pgcrGambitCurrPlayersBlob' : 'pgcrGambitPlayersBlob' }
    else { return null }
  }
  else {
    if(modeType === 'pvp') { return 'pgcrPvpPlayersBlob' }
    else if(modeType === 'gambit') { return 'pgcrGambitPlayersBlob' }
    else { return null }
  }
}

function adjustEntriesBoxSizing(activity) {
  if(activity.entries.length > 6) { const heightOf = activity.entries.length * 25 + 48; return { height: heightOf }; }
  else { return { height: '250px' }; }
}
function updateProfileCard(parent, data, modeType) { parent.setState({ profileCard: data }); }

export default PGCRViewer;
