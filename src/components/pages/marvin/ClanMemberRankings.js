import React, { Component } from 'react';
import * as Misc from '../../Misc';

export class ClanMemberRankings extends Component {

  state = {
    sortBy: "lastPlayed",
    clan_members: []
  }

  async componentDidMount() {
    const clan_members = this.props.clan_members;
    await this.setState({ clan_members });
    this.sortRankings(this.state.sortBy);
  }
  async sortRankings(type) {
    console.log(type);
    let clan_members = this.state.clan_members;
    clan_members.sort((a, b) => { return b[type] - a[type] });
    this.setState({ sortBy: type, clan_members });
  }

  render() {
    const clan_members = this.state.clan_members;
    return(
      <div className="clan_stats_container">
        <div className="rankings_title">
          <div id="displayName"><div>Display Name</div></div>
          <div id="seasonRank" onClick={ ((e) => this.sortRankings("seasonRank")) }><div>SR</div><div className={ this.state.sortBy === "seasonRank" ? "caret_down" : "caret_up" }> </div></div>
          <div id="timePlayed" onClick={ ((e) => this.sortRankings("timePlayed")) }><div>Time Played</div><div className={ this.state.sortBy === "timePlayed" ? "caret_down" : "caret_up" }> </div></div>
          <div id="valor" onClick={ ((e) => this.sortRankings("valor")) }><div>Valor</div><div className={ this.state.sortBy === "valor" ? "caret_down" : "caret_up" }> </div></div>
          <div id="infamy" onClick={ ((e) => this.sortRankings("infamy")) }><div>Infamy</div><div className={ this.state.sortBy === "infamy" ? "caret_down" : "caret_up" }> </div></div>
          <div id="glory" onClick={ ((e) => this.sortRankings("glory")) }><div>Glory</div><div className={ this.state.sortBy === "glory" ? "caret_down" : "caret_up" }> </div></div>
          <div id="triumphScore" onClick={ ((e) => this.sortRankings("triumphScore")) }><div>Score</div><div className={ this.state.sortBy === "triumphScore" ? "caret_down" : "caret_up" }> </div></div>
          <div id="joinDate" onClick={ ((e) => this.sortRankings("joinDate")) }><div>Join Date</div><div className={ this.state.sortBy === "joinDate" ? "caret_down" : "caret_up" }> </div></div>
          <div id="lastPlayed" onClick={ ((e) => this.sortRankings("lastPlayed")) }><div>Last Played</div><div className={ this.state.sortBy === "lastPlayed" ? "caret_down" : "caret_up" }> </div></div>
        </div>
        {
          clan_members.map((member) => {
            let lastPlayed = new Date().getTime() - member.lastPlayed;
            return (
              <div className="clan_member" key={ member.membershipId }>
                <div>{ member.displayName } ({ member.clan_callsign })</div>
                <div>{ Misc.AddCommas(member.seasonRank) }</div>
                <div>{ Misc.AddCommas(Math.round(member.timePlayed / 60)) } Hrs</div>
                <div>{ Misc.AddCommas(member.valor) } ({ member.valorResets })</div>
                <div>{ Misc.AddCommas(member.infamy) } ({ member.infamyResets })</div>
                <div>{ Misc.AddCommas(member.glory) }</div>
                <div>{ Misc.AddCommas(member.triumphScore) }</div>
                <div>{ member.joinDate }</div>
                <div>{ lastPlayed > 60000 ? Misc.formatTime(lastPlayed / 1000) : "Online" }</div>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default ClanMemberRankings;
