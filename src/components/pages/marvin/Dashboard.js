import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';
import * as checks from '../../scripts/Checks';
import * as DiscordAuth from '../../requests/DiscordAuth';

export class Dashboard extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Dashboard...' },
    data: null,
    failed: false
  }

  async componentDidMount() {
    this.startUpChecks();
  }

  async startUpChecks() {
    this.setState({ status: { status: 'checkingManifest', statusText: 'Checking Manifest...' } });
    if(checks.checkManifestMounted()) {
      const check = await checks.startUpPageChecks();
      if(check === "Checks OK") {
        this.setState({ status: { status: 'loadingDashboard', statusText: 'Loading Dashboard...' } });
        if(JSON.parse(localStorage.getItem("DiscordInfo"))) {
          //Get discord info
          const discordInfo = JSON.parse(localStorage.getItem("DiscordInfo"));
          this.getDashboardData(discordInfo);
        }
        else {
          if(Misc.getURLVars()["code"]) {
            this.setState({ status: { status: 'authing', statusText: 'Authorizing with Discord...' } });
            DiscordAuth.getAccessToken(Misc.getURLVars()["code"]);
          }
          else if(Misc.getURLVars()["failed"]) { this.setState({ failed: true }); this.setState({ status: { status: 'failedToConnect', statusText: 'Failed to connect with discord...' } }); }
          else { this.setState({ status: { status: 'needConnect', statusText: 'Need to connect with Discord first...' } }); }
        }
      }
      else { this.setState({ status: { status: 'error', statusText: check } }); }
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }
  async getDashboardData(discordInfo) {
    return fetch('http://localhost:3000/getclan', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
      body: JSON.stringify({ 'id': discordInfo.id, 'username': discordInfo.username, 'avatar': discordInfo.avatar, 'discriminator': discordInfo.discriminator })
    })
    .then((response) => response.json())
    .then((response) => {
      if(response.error === null) {
        console.log(response.data);
        this.setState({ status: { status: 'ready', statusText: 'Finished loading' }, data: response.data });
      }
      else { this.setState({ status: { status: 'error', statusText: response.error } }); }
    })
    .catch((err) => { this.setState({ status: { status: 'error', statusText: "Failed to connect to database to retrieve clan data... Please try again at a later time." } }); });
  }
  changeMenu(event) {
    var menuItems = document.getElementsByClassName('marvins_dashboard_menu_item');
    for(var i = 0; i < menuItems.length; i++) { menuItems[i].classList.remove('selected'); }
    var elements = document.getElementsByClassName('marvins_dashboard_content')[0].children;
    for(var i = 0; i < elements.length; i++) { elements[i].classList.remove('selected'); }
    event.target.parentElement.classList.add('selected');
    if(event.target.parentElement.id === "marvins_dashboard_stats") { document.getElementsByClassName('marvin_clan_stats')[0].classList.add('selected'); }
    else if(event.target.parentElement.id === "marvins_dashboard_settings") { document.getElementsByClassName('marvin_clan_settings')[0].classList.add('selected'); }
    else { document.getElementsByClassName('marvin_clan_info')[0].classList.add('selected'); }
  }
  toggleChecked(event) { this.setState({ data: {...this.state.data, [event.target.id]: JSON.stringify(event.target.checked) } }); }
  updateResultsReturned(event) { console.log("Results Returned: " + event.target.value); }

  render() {
    const { status, statusText } = this.state.status;
    const { data, failed } = this.state;

    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      const discordInfo = JSON.parse(localStorage.getItem("DiscordInfo"));
      return (
        <div className="marvins_dashboard">
          <div className="marvins_header">
            <h1>Marvins Dashboard</h1>
            <h5>{ "Logged in as: " + discordInfo.username + "#" + discordInfo.discriminator }</h5>
          </div>
          <div className="marvins_dashboard_content_container">
            <div className="marvins_dashboard_menu">
              <div className="marvins_dashboard_menu_item selected" id="marvins_dashboard_info" onClick={ (e) => this.changeMenu(e) }><img src="/images/dashboard/info_icon.svg" /><div>Clan</div></div>
              <div className="marvins_dashboard_menu_item" id="marvins_dashboard_stats" onClick={ (e) => this.changeMenu(e) }><img src="/images/dashboard/stats_icon.svg" /><div>Stats</div></div>
              <div className="marvins_dashboard_menu_item" id="marvins_dashboard_settings" onClick={ (e) => this.changeMenu(e) }><img src="/images/dashboard/settings_icon.svg" /><div>Settings</div></div>
            </div>
            <div className="marvins_dashboard_content">
              <div className="marvin_clan_info selected">
                <div id="guild_id">Server ID: { data.guild_id }</div>
                <div id="clan_id"> Clan ID: { data.clan_id }</div>
                <div id="clan_level">Clan Level: { data.clan_level }</div>
                <div id="creator_id">Marvins Server Owner: { data.creator_id }</div>
                <div id="server_clan_ids">Server Clans: { data.server_clan_ids }</div>
                <div id="announcement_channel">Announcements Channel ID: { data.announcement_channel }</div>
                <div id="broadcasts_channel">Broadcast Channel ID: { data.broadcasts_channel }</div>
              </div>
              <div className="marvin_clan_stats">
                <div></div>
              </div>
              <div className="marvin_clan_settings">
                <div>
                  <label className="customCheck">Enable announcements
                    <input type="checkbox" id="enable_announcements" onChange={ (e) => this.toggleChecked(e) } checked={ data.enable_announcements === "true" ? true : false } />
                    <span className="checkmark"></span>
                  </label>
                  <label className="customCheck">Enable whitelist
                    <input type="checkbox" id="enable_whitelist" onChange={ (e) => this.toggleChecked(e) } checked={ data.enable_whitelist === "true" ? true : false } />
                    <span className="checkmark"></span>
                  </label>
                  <label className="customTextbox">Results returned (1-50)
                    <input type="textbox" id="returns_returned" onChange={ (e) => this.updateResultsReturned(e) } />
                  </label>
                </div>
                {
                  data.enable_whitelist === "true" ? (
                    <div id="whitelist">
                      <span>Tracked Items</span>
                      <div>{ data.whitelist.split(",").map(function(item) { if(item !== "") { return(<div>{ item }</div>) } }) }</div>
                    </div>
                  ) : (
                    <div id="blacklist">
                      <span>Ignored Items</span>
                      <div>{ data.blacklist.split(",").map(function(item) { if(item !== "") { return(<div>{ item }</div>) } }) }</div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
    else if(status === 'needConnect') {
      return (
        <div className="marvins_dashboard">
          { failed ? (<h1 style={{ textAlign: "center" }}>Marvins Dashboard - Erroring connecting. Please try again...</h1>) : (<h1 style={{ textAlign: "center" }}>Marvins Dashboard - Needs Connecting</h1>) }
          <div className="marvinBtn"><button className="btn btn-primary" onClick={ (() => DiscordAuth.linkWithDiscord()) }>Connect with Discord</button></div>
        </div>
      );
    }
    else if(status === "failedToConnect") {
      return (
        <div>
          <h1>Marvins Dashboard</h1>
          <p>Erroring connecting with discord. Please try again...</p>
          <div className="marvinBtn"><button className="btn btn-primary" onClick={ (() => DiscordAuth.linkWithDiscord()) }>Connect with Discord</button></div>
        </div>
      )
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Dashboard;
