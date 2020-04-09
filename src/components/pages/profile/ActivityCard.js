import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../modules/Loader';
import HistoricalStats from './HistoricalStats.json';
import * as Misc from '../../Misc';
import * as UserStatistics from './GenerateUserStatistics';
import * as loadBreaks from '../../scripts/Loadbreaks';
import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as api from '../../requests/Api';

export class ActivityCard extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Activity Card...' },
    activityCard: null
  }

  async componentDidMount() {
    //On component load we want to process the profile from props.
    await this.setState({
      status: { status: 'startUp', statusText: 'Loading Activity Card...' },
      activityCard: { characterId: this.props.characterId, membershipId: this.props.membershipId, membershipType: this.props.membershipType, playerData: this.props.playerData, currentActivity: this.props.currentActivity }
    });
    this.loadActivityCards();
  }
  async componentDidUpdate() {
    //If props updated usually responding to clicks then update the state again.
    if(this.state.activityCard.currentActivity !== this.props.currentActivity) {
      await this.setState({
        status: { status: 'startUp', statusText: 'Loading Activity Card...' },
        activityCard: { characterId: this.props.characterId, membershipId: this.props.membershipId, membershipType: this.props.membershipType, playerData: this.props.playerData, currentActivity: this.props.currentActivity }
      });
      this.loadActivityCards();
    }
  }
  async loadActivityCards() {
    //Variables
    var characterId = this.state.activityCard.characterId;
    var membershipId = this.state.activityCard.membershipId;
    var membershipType = this.state.activityCard.membershipType;
    var playerData = this.state.activityCard.playerData;
    var currentActivity = this.state.activityCard.currentActivity;
    var profileInfo, historicStats, metrics, statusTags;

    try {
      //Attempt to get the profile information.
      this.setState({ status: { status: 'grabbingAccountInfo', statusText: "Getting account information..." } });
      await Promise.all([
        bungie.GetProfile(membershipType, membershipId, '100,200,202,1100'),
        bungie.GetHistoricStatsForAccount(membershipType, membershipId),
        api.CheckIfPatreon(membershipId)
      ]).then(async function(promiseData) {
        //Variables
        profileInfo = promiseData[0];
        historicStats = promiseData[1];
        if(promiseData[2].data) { statusTags = Misc.convertStatusTags(promiseData[2].data[0]); } else { statusTags = Misc.convertStatusTags(); }
      });

      //Check if account is private
      if(profileInfo.characterProgressions.data) {
        //With all data retrieved, Set page.
        this.setState({
          status: {
            status: 'ready', statusText: 'Finished the inspection! (You shouldn\'t see this unless something went wrong, Please refresh)' },
            activityCard: { characterId, membershipId, membershipType, currentActivity, profileInfo, playerData, historicStats, statusTags }
        });
      }
      else { this.setState({ status: { status: 'private', statusText: 'This user has their account privated. I wonder what they are hiding...' } }); }
    }
    catch (err) { console.log(err); this.setState({ status: { status: 'error', statusText: 'Failed to load profile card due to: ' + JSON.stringify(err) } }); }
  }

  render() {
    const { status, statusText } = this.state.status;
    if(status === "ready") {
      const { characterId, membershipId, membershipType, profileInfo, playerData, historicStats, statusTags } = this.state.activityCard;
      const characterData = profileInfo.characters.data[characterId];
      const Manifest = globals.MANIFEST;
      return (
        <div className="activity-card-container">
          <div className="activity-card-data">
            <div key={ `${ characterId }_emblem` } className="activity-card-banner-info" style={{ backgroundImage: `url("https://bungie.net${ characterData.emblemBackgroundPath }")` }}>
              <div id="display-name">
                <h4>{ profileInfo.profile.data.userInfo.displayName }</h4>
                <div className="status-tags">
                  {
                    Object.keys(statusTags).map((statusTag) => {
                      if(statusTags[statusTag].hasLink) { return ( statusTags[statusTag].hasTag ? (<div id={ statusTags[statusTag].id }><a href={ statusTags[statusTag].link } target="_blank">{ statusTags[statusTag].name }</a></div>) : null ) }
                      else { return ( statusTags[statusTag].hasTag ? (<div id={ statusTags[statusTag].id }>{ statusTags[statusTag].name }</div>) : null ) }
                    })
                  }
                </div>
              </div>
              <span id="character-class">{ Misc.getClassName(characterData.classType) }</span>
              <h3 id="character-light-level"><span id="light-level-icon">✧</span>{ characterData.light }</h3>
              <h5 id="season-rank"><span id="season-rank-icon">SR</span>{ profileInfo.metrics.data.metrics[2076844101].objectiveProgress.progress }</h5>
            </div>
            <div className="activity-card-info">
              { UserStatistics.generateRanks(profileInfo, 100) }
              <div className="activity-card-sub-info">
                <a href={`/activities/${ membershipId }`} id="full-view-btn">View Activities</a>
                <Link to={`/profile/${ membershipId }`} id="full-view-btn">View Full Profile</Link>
              </div>
            </div>
          </div>
          <div key={ playerData.player.destinyUserInfo.membershipId } className="pgcrExtendedInfo other">
            <div className="pgcrExtendedInfoBG"><img alt="pgcrBGicon" className="pgcrExtendedInfoBGImage" style={{ backgroundImage: `url("https://bungie.net${ Manifest.DestinyInventoryItemLiteDefinition[playerData.player.emblemHash].secondarySpecial }")` }} /></div>
            <div className="pgcrExtendedInfoStats">
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
                      <img alt={ Manifest.DestinyInventoryItemLiteDefinition[weapon.referenceId].displayProperties.name } src={ 'https://bungie.net' + Manifest.DestinyInventoryItemLiteDefinition[weapon.referenceId].displayProperties.icon } className="pgcrItemIcon" />x{ weapon.values.uniqueWeaponKills.basic.displayValue }
                      <div className="pgcrItemInfo">
                        <div id="title">{ Manifest.DestinyInventoryItemLiteDefinition[weapon.referenceId].displayProperties.name }</div>
                        <div id="description">{ Manifest.DestinyInventoryItemLiteDefinition[weapon.referenceId].displayProperties.description }</div>
                        <div id="extraInfo">
                          <div>Kills: { weapon.values.uniqueWeaponKills.basic.displayValue }</div>
                          <div>Headshots: { weapon.values.uniqueWeaponPrecisionKills.basic.displayValue }</div>
                          <div>Accuracy: { weapon.values.uniqueWeaponKillsPrecisionKills.basic.displayValue }</div>
                        </div>
                      </div>
                    </div>
                  )) :
                <div>No Weapon Data</div>
              }
              { playerData.extended.values.weaponKillsGrenade.basic.displayValue !== '0' ? <div key="grenadeKills"><img alt="grenade" src="./images/icons/Grenade.png" className="pgcrItemIcon" title="Grenade Kills" />x{ playerData.extended.values.weaponKillsGrenade.basic.displayValue }</div> : null }
              { playerData.extended.values.weaponKillsMelee.basic.displayValue !== '0' ? <div key="meleeKills"><img alt="melee" src="./images/icons/Melee.png" className="pgcrItemIcon" title="Melee Kills" />x{ playerData.extended.values.weaponKillsMelee.basic.displayValue }</div> : null }
              { playerData.extended.values.weaponKillsSuper.basic.displayValue !== '0' ? <div key="superKills"><img alt="super" src="./images/icons/Super.png" className="pgcrItemIcon" title="Super Kills" />x{ playerData.extended.values.weaponKillsSuper.basic.displayValue }</div> : null }
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="activity-card-container">
          <div className="activity-card-data">
            <Loader statusText={ statusText } />
          </div>
        </div>
      );
    }
  }
}

export default ActivityCard;
