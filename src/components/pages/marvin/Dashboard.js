import React, { Component } from 'react';
import uuid from 'uuid';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';
import * as checks from '../../scripts/Checks';
import * as DiscordAuth from '../../requests/DiscordAuth';
import * as ClanBanner from './ClanBanner';

export class Dashboard extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Dashboard...' },
    clanData: null,
    managingServer: null,
    managingClan: null,
    clanBannerData: null,
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
        if(Misc.getURLVars()["code"]) {
          this.setState({ status: { status: 'authing', statusText: 'Authorizing with Discord...' } });
          DiscordAuth.getAccessToken(Misc.getURLVars()["code"]);
        }
        else if(Misc.getURLVars()["failed"]) { this.setState({ failed: true }); this.setState({ status: { status: 'failedToConnect', statusText: 'Failed to connect with discord...' } }); }
        else {
          if(JSON.parse(localStorage.getItem("DiscordInfo"))) {
            //Get discord info
            const discordInfo = JSON.parse(localStorage.getItem("DiscordInfo"));
            this.getDashboardData(discordInfo);
          }
          else { this.setState({ status: { status: 'needConnect', statusText: 'Need to connect with Discord first...' } }); }
        }
      }
      else { this.setState({ status: { status: 'error', statusText: check } }); }
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }
  async getDashboardData(discordInfo) {
    return fetch('http://localhost:3000/API/GetGuildsFromDiscordID', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
      body: JSON.stringify({ 'id': discordInfo.id, 'username': discordInfo.username, 'avatar': discordInfo.avatar, 'discriminator': discordInfo.discriminator })
    })
    .then((response) => response.json())
    .then(async (response) => {
      if(response.error === null) {
        var usersDiscordServers = await DiscordAuth.getDiscordGuildInfo();
        if(!usersDiscordServers.error) {
          if(response.data.length === 1) {
            //Only managing 1 clan. Just load dashboard based on those settings.
            var managingServer = usersDiscordServers.guildInfo.find(e => e.id === response.data[0].guild_id);
            this.setState({ status: { status: 'buildingClanBanner', statusText: 'Building Clan Banners...' }, managingServer: managingServer, managingClan: response.data[0] });
          }
          else {
            var clanGuildIds = []; for(var i in response.data) { clanGuildIds.push(response.data[i].guild_id); }
            var filteredDiscordServers = usersDiscordServers.guildInfo.filter(e => clanGuildIds.includes(e.id));
            this.setState({ status: { status: 'pickServer', statusText: 'Please pick a server to manage.' }, clanData: response.data, serverData: filteredDiscordServers, managingServer: null, managingClan: null });
          }
        }
        else { this.setState({ status: { status: 'error', statusText: usersDiscordServers.reason } }); }
      }
      else { this.setState({ status: { status: 'error', statusText: response.error } }); }
    })
    .catch((err) => { console.log(err); this.setState({ status: { status: 'error', statusText: "Failed to connect to database to retrieve clan data... Please try again at a later time." } }); });
  }
  changeMenu(event) {
    var menuItems = document.getElementsByClassName('marvins_dashboard_menu_item'); for(var i = 0; i < menuItems.length; i++) { menuItems[i].classList.remove('selected'); }
    var elements = document.getElementsByClassName('marvins_dashboard_content')[0].children; for(var i = 0; i < elements.length; i++) { elements[i].classList.remove('selected'); }
    event.target.parentElement.classList.add('selected');
    if(event.target.parentElement.id === "marvins_dashboard_settings") { document.getElementsByClassName('marvin_clan_settings')[0].classList.add('selected'); }
    else { document.getElementsByClassName('marvin_clan_info')[0].classList.add('selected'); }
  }
  toggleChecked(event) { this.setState({ data: {...this.state.data, [event.target.id]: JSON.stringify(event.target.checked) } }); }
  updateResultsReturned(event) { console.log("Results Returned: " + event.target.value); }
  pickServer(guildId) {
    var managingServer = this.state.serverData.find(e => e.id === guildId);
    var managingClan = this.state.clanData.find(e => e.guild_id === guildId);
    this.setState({ status: { status: 'buildingClanBanner', statusText: 'Building Clan Banners...' }, managingServer: managingServer, managingClan: managingClan });
    this.buildClanBanners(managingClan);
  }
  async buildClanBanners(managingClan) {
    const clanIds = managingClan.clans.split(",");
    const clanBannerData = await ClanBanner.BuildClanBanners(clanIds);
    this.setState({ clanBannerData });
    this.finishedLoading();
  }
  finishedLoading() {
    this.setState({ status: { status: 'ready', statusText: 'Finished loading' } });
    const clanBannerData = this.state.clanBannerData;
    const clanIds = this.state.managingClan.clans.split(',');
    for(var i in clanIds) { ClanBanner.BuildClanBanner(clanIds[i], clanBannerData); }
  }

  render() {
    const { status, statusText } = this.state.status;
    const { serverData, managingServer, managingClan, clanBannerData, failed } = this.state;

    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      const discordInfo = JSON.parse(localStorage.getItem("DiscordInfo"));
      const clanIds = this.state.managingClan.clans.split(',');
      return (
        <div className="marvins_dashboard">
          <div className="marvins_header">
            <h1>Marvins Dashboard</h1>
          </div>
          <div className="marvins_dashboard_content_container">
            <div className="marvins_dashboard_menu">
              <div className="marvins_dashboard_menu_item selected" id="marvins_dashboard_info" onClick={ (e) => this.changeMenu(e) }><img src="/images/dashboard/info_icon.svg" /><div>Clan</div></div>
              <div className="marvins_dashboard_menu_item" id="marvins_dashboard_settings" onClick={ (e) => this.changeMenu(e) }><img src="/images/dashboard/settings_icon.svg" /><div>Settings</div></div>
            </div>
            <div className="marvins_dashboard_content">
              <div className="marvin_clan_info selected">

                <div className="clanBannerContainer">
                  {
                    clanIds.map((clanId) => {
                      const clanDetail = clanBannerData.find(e => e.clanDetail.groupId === clanId);
                      return (
                        <div className="clanBanner" title={ clanDetail.clanDetail.name }>
                          <canvas id={`canvasGonfalon_${ clanId }`} width="215" height="375" />
                          <canvas id={`canvasDetail_${ clanId }`} width="215" height="375" />
                          <canvas id={`canvasDecalBg_${ clanId }`} width="215" height="375" />
                          <canvas id={`canvasDecalFg_${ clanId }`} width="215" height="375" />
                          <canvas id={`canvasStaff_${ clanId }`} width="215" height="375" />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className="marvin_clan_settings">
                <div className="marvin_guild_info">
                  <div id="guild_id">Server ID: { managingClan.guild_id }</div>
                  <div id="clans">Server Clans: { managingClan.clans }</div>
                  <div id="broadcasts_channel">Broadcast Channel ID: { managingClan.broadcasts_channel }</div>
                </div>
                <div>
                  <label className="customCheck">Enable whitelist
                    <input type="checkbox" id="enable_whitelist" onChange={ (e) => this.toggleChecked(e) } checked={ managingClan.enable_whitelist === "true" ? true : false } />
                    <span className="checkmark"></span>
                  </label>
                  <label className="customTextbox">Results returned (1-50)
                    <input type="textbox" id="returns_returned" onChange={ (e) => this.updateResultsReturned(e) } />
                  </label>
                </div>
                {
                  managingClan.enable_whitelist === "true" ? (
                    <div id="whitelist">
                      <span>Tracked Items</span>
                      <div>{ managingClan.whitelist.split(",").map(function(item) { if(item !== "") { return(<div key={ uuid.v4() }>{ item }</div>) } }) }</div>
                    </div>
                  ) : (
                    <div id="blacklist">
                      <span>Ignored Items</span>
                      <div>{ managingClan.blacklist.split(",").map(function(item) { if(item !== "") { return(<div key={ uuid.v4() }>{ item }</div>) } }) }</div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
    else if(status === "pickServer") {
      return (
        <div className="marvins_dashboard">
          <h1 style={{ textAlign: "center" }}>Marvins Dashboard</h1>
          <p style={{ textAlign: "center" }}>Please pick a server to manage.</p>
          <div style={{ textAlign: "center" }}> { serverData.map((server) => { return(<div className="btn btn-primary" style={{ margin: "5px", cursor: "pointer" }} onClick={ (() => this.pickServer(server.id)) } key={ server.id }>{ server.name }</div>) }) } </div>
        </div>
      )
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
        <div className="marvins_dashboard">
          <h1 style={{ textAlign: "center" }}>Marvins Dashboard</h1>
          <p style={{ textAlign: "center" }}>Erroring connecting with discord. Please try again...</p>
          <div className="marvinBtn"><button className="btn btn-primary" onClick={ (() => DiscordAuth.linkWithDiscord()) }>Connect with Discord</button></div>
        </div>
      )
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Dashboard;
