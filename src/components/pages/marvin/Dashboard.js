import React, { Component } from 'react';
import uuid from 'uuid';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import DashboardSettings from './DashboardSettings';
import Rankings from './ClanMemberRankings';
import ClanBanners from './ClanBanners';
import * as Misc from '../../Misc';
import * as checks from '../../scripts/Checks';
import * as DiscordAuth from '../../requests/DiscordAuth';
import * as Api from '../../requests/Api';
import * as bungie from "../../requests/BungieReq";
import * as loadBreaks from "../../scripts/Loadbreaks";

export class Dashboard extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Dashboard...' },
    discord_servers: null,
    users_servers: null,
    selected_discord_server: null,
    selected_user_server: null,
    all_clan_members: null,
    failed: false
  }

  async componentDidMount() {
    document.title = "Clan Dashboard - Guardianstats";
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
    await Promise.all([
      await Api.GetServers(discordInfo),
      await DiscordAuth.getDiscordGuildInfo()
    ]).then((promiseData) => {
      let users_servers = promiseData[0];
      let discord_servers = promiseData[1];
      if(users_servers.error === null) {
        users_servers = users_servers.data;
        if(!discord_servers.error) {
          let clan_server_ids = []; for(let i in users_servers) { clan_server_ids.push(users_servers[i].guild_id); }
          discord_servers = discord_servers.guildInfo.filter(e => clan_server_ids.includes(e.id));
          this.setState({ discord_servers: discord_servers, users_servers: users_servers });
          if(users_servers.length === 1) { this.pickServer(discord_servers[0].id); }
          else { this.setState({ status: { status: 'pickServer', statusText: 'Please pick a server to manage.' } }) }
        }
        else { this.setState({ status: { status: 'error', statusText: discord_servers.reason } }); }
      }
      else { this.setState({ status: { status: 'error', statusText: "Connection with Marvin was lost. This is possibly due to a timeout or someone else used the dashboard since you were last here, please use: `~Reauth` on your discord client. Then refresh the page." } }); }
    });
  }
  changeMenu(event) {
    var menuItems = document.getElementsByClassName('marvins_dashboard_menu_item'); for(let i = 0; i < menuItems.length; i++) { menuItems[i].classList.remove('selected'); }
    var elements = document.getElementsByClassName('marvins_dashboard_content')[0].children; for(let i = 0; i < elements.length; i++) { elements[i].classList.remove('selected'); }
    event.target.parentElement.classList.add('selected');
    if(event.target.parentElement.id === "marvins_dashboard_settings") { document.getElementsByClassName('marvin_clan_settings')[0].classList.add('selected'); }
    else if(event.target.parentElement.id === "marvins_dashboard_select_server") {
      this.setState({ status: { status: "pickServer", statusText: "Please pick a server to manage." }, selected_discord_server: null, selected_user_server: null, all_clan_members: null });
    }
    else { document.getElementsByClassName('marvin_clan_info')[0].classList.add('selected'); }
  }
  toggleChecked(event) {
    let selected_user_server = this.state.selected_user_server; selected_user_server[event.target.id] = JSON.stringify(!JSON.parse(selected_user_server[event.target.id]));
    this.setState({ selected_user_server });
  }
  pickServer(guild_id) {
    let selected_discord_server = this.state.discord_servers.find(e => e.id === guild_id);
    let selected_user_server = this.state.users_servers.find(e => e.guild_id === guild_id);
    this.setState({ status: { status: 'gettingClanMemberData', statusText: 'Getting clan member data...' }, selected_discord_server, selected_user_server });
    this.getClanData(selected_user_server);
  }
  async getClanData(selected_user_server) {
    const clans = selected_user_server.clans.split(",");
    let all_clan_members = [];
    for(let i in clans) {
      let clan_data = (await Api.GetClan(clans[i])).data;
      let clan_member_data = (await Api.GetClanMembers(clans[i])).data;
      for(let j in clan_member_data) {
        clan_member_data[j].clan_name = clan_data[0].clan_name;
        clan_member_data[j].clan_callsign = clan_data[0].clan_callsign;
        all_clan_members.push(clan_member_data[j]);
      }
    }
    this.setState({ status: { status: 'ready', statusText: 'Finished loading' }, all_clan_members: all_clan_members });
  }
  saveServerDetails(new_server_info) {
    console.log(new_server_info);
  }

  render() {
    const { status, statusText } = this.state.status;
    const { discord_servers, users_servers, selected_discord_server, selected_user_server, all_clan_members, failed } = this.state;
    console.log(discord_servers);
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === "pickServer") {
      return (
        <div className="marvins_dashboard">
          <h1 style={{ textAlign: "center" }}>Marvins Dashboard</h1>
          <p style={{ textAlign: "center" }}>Please pick a server to manage.</p>
          <div style={{ textAlign: "center" }}> { discord_servers.map((server) => { return(<div className="btn btn-primary" style={{ margin: "5px", cursor: "pointer" }} onClick={ (() => this.pickServer(server.id)) } key={ server.id }>{ server.name }</div>) }) } </div>
        </div>
      )
    }
    else if(status === 'needConnect') {
      return (
        <div className="marvins_dashboard">
          { failed ? (<h1 style={{ textAlign: "center" }}>Marvins Dashboard - Error connecting. Please try again...</h1>) : (<h1 style={{ textAlign: "center" }}>Marvins Dashboard - Needs Connecting</h1>) }
          <div className="marvinBtn"><button className="btn btn-primary" onClick={ (() => DiscordAuth.linkWithDiscord()) }>Connect with Discord</button></div>
        </div>
      );
    }
    else if(status === "failedToConnect") {
      return (
        <div className="marvins_dashboard">
          <h1 style={{ textAlign: "center" }}>Marvins Dashboard</h1>
          <p style={{ textAlign: "center" }}>Error connecting with discord. Please try again...</p>
          <div className="marvinBtn"><button className="btn btn-primary" onClick={ (() => DiscordAuth.linkWithDiscord()) }>Connect with Discord</button></div>
        </div>
      )
    }
    else if(status === 'ready') {
      return (
        <div className="marvins_dashboard">
          <div className="marvins_header">
            <h1>Marvins Dashboard</h1>
          </div>
          <div className="marvins_dashboard_content_container">
            <div className="marvins_dashboard_menu">
              <div className="marvins_dashboard_menu_item selected" id="marvins_dashboard_info" onClick={ (e) => this.changeMenu(e) }>
                <img src="/images/dashboard/info_icon.svg" /><div>Clan</div>
              </div>
              <div className="marvins_dashboard_menu_item" id="marvins_dashboard_settings" onClick={ (e) => this.changeMenu(e) }>
                <img src="/images/dashboard/settings_icon.svg" /><div>Settings</div>
              </div>
              {
                discord_servers.length > 1 ? (
                  <div className="marvins_dashboard_menu_item" id="marvins_dashboard_select_server" onClick={ (e) => this.changeMenu(e) }>
                    <img src="/images/dashboard/back_icon.svg" /><div>Back</div>
                  </div>
                ) : null
              }
            </div>
            <div className="marvins_dashboard_content">
              <div className="marvin_clan_info selected">
                <Rankings clan_members={ all_clan_members } />
                <ClanBanners current_clan={ selected_user_server } />
              </div>
              <DashboardSettings
                current_discord={ selected_discord_server }
                current_clan={ selected_user_server }
                toggleChecked={ (e) => this.toggleChecked(e) }
                saveServerDetails={ ((new_server_info) => this.saveServerDetails(new_server_info)) }
              />
            </div>
          </div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Dashboard;
