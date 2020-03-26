import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';

export class Clans extends Component {

  state = {
    status: { status: "loading", statusText: "Loading Clans", error: false },
    pageType: null,
    rankings: null
  }

  componentDidMount() {
    document.title = "Clan Rankings - Guardianstats";
    const { pageType } = this.props;
    this.setState({ pageType });
    this.LoadClanRankings();
  }

  async LoadClanRankings() {
    const data = await fetch('https://api.guardianstats.com/GetClanRankings', { method: 'GET' }).then((response) => response.json()).then(async (response) => { if(response.error === null) { return response.data } }).catch((err) => { console.log(err); });
    var rankings = {
      "Time Played": { "name": "timePlayed", "data": [...data.sort(function(a, b) { return b.data.timePlayed - a.data.timePlayed })] },
      "Triumph Score": { "name": "triumphScore", "data": [...data.sort(function(a, b) { return b.data.triumphScore - a.data.triumphScore })] },
      "Ironbanner Kills": { "name": "ibKills", "data": [...data.sort(function(a, b) { return b.data.ibKills - a.data.ibKills })] },
      "Ironbanner Wins": { "name": "ibWins", "data": [...data.sort(function(a, b) { return b.data.ibWins - a.data.ibWins })] },
      "Sundial Runs": { "name": "sundial", "data": [...data.sort(function(a, b) { return b.data.sundial - a.data.sundial })] },
      "Wells Completed": { "name": "wells", "data": [...data.sort(function(a, b) { return b.data.wells - a.data.wells })] },
      "Menageire Runs": { "name": "menageire", "data": [...data.sort(function(a, b) { return b.data.menageire - a.data.menageire })] },
      "Leviathan Completions": { "name": "leviCompletions", "data": [...data.sort(function(a, b) { return b.data.leviCompletions - a.data.leviCompletions })] },
      "Eater of Worlds Completions": { "name": "eowCompletions", "data": [...data.sort(function(a, b) { return b.data.eowCompletions - a.data.eowCompletions })] },
      "Spire of the Stars Completions": { "name": "sosCompletions", "data": [...data.sort(function(a, b) { return b.data.sosCompletions - a.data.sosCompletions })] },
      "Last Wish Completions": { "name": "lwCompletions", "data": [...data.sort(function(a, b) { return b.data.lwCompletions - a.data.lwCompletions })] },
      "Scourge of the Past Completions": { "name": "scourgeCompletions", "data": [...data.sort(function(a, b) { return b.data.scourgeCompletions - a.data.scourgeCompletions })] },
      "Crown of Sorrows Completions": { "name": "sorrowsCompletions", "data": [...data.sort(function(a, b) { return b.data.sorrowsCompletions - a.data.sorrowsCompletions })] },
      "Garden of Salvation Completions": { "name": "gardenCompletions", "data": [...data.sort(function(a, b) { return b.data.gardenCompletions - a.data.gardenCompletions })] },
      "Total Raid Completions": { "name": "totalRaids", "data": [...data.sort(function(a, b) { return b.data.totalRaids - a.data.totalRaids })] },
      "Season Ranks": { "name": "seasonRanks", "data": [...data.sort(function(a, b) { return b.data.seasonRanks - a.data.seasonRanks })] },
      "Fractaline Donated": { "name": "fractalineDonated", "data": [...data.sort(function(a, b) { return b.data.fractalineDonated - a.data.fractalineDonated })] },
      "Resonance Rank": { "name": "resonance", "data": [...data.sort(function(a, b) { return b.data.resonance - a.data.resonance })] }
    }
    this.setState({ status: { status: "ready", statusText: "Finished Loading...", error: false }, rankings });
  }
  resetDefaultPageType = () => { this.props.history.replace(`/clans`); }

  render() {
    const { status, pageType, rankings } = this.state;
    if(!status.error) {
      if(status.status === "ready") {
        if(pageType && pageType !== "/clanrankings") {
          if(Object.keys(rankings).find((ranking) => { if(rankings[ranking].name === pageType) { return rankings[ranking] } })) {
            return (
              <div className="clans-container">
                <div className="clans-content">
                  <h1>{ Object.keys(rankings).find((ranking) => { if(rankings[ranking].name === pageType) { return rankings[ranking] } }) }</h1>
                  <div className="clan-rankings-full">
                    {
                      Object.keys(rankings).map((rankingsName) => {
                        var count = 1.0;
                        if(rankings[rankingsName].name === pageType) {
                          return (
                            <div className="rankings-container">
                              <div className="ranking-title">{ rankingsName }</div>
                              <div className="rankings-content">
                                {
                                  rankings[rankingsName].data.map((rank) => {
                                    count = count - 0.06;
                                    return (
                                      <div className="rankings-cell">
                                        <div style={{ color: "#b3b3b3" }} id="rank">{ rankings[rankingsName].data.indexOf(rank)+1 }</div>
                                        <div style={{ color: "#b3b3b3" }}><span id="clan_name">{ rank.clan_name }</span></div>
                                        <div style={{ color: "#b3b3b3" }} id="data_count">{ Misc.numberWithCommas(rank.data[rankings[rankingsName].name]) }</div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          )
                        }
                      })
                    }
                  </div>
                </div>
              </div>
            );
          }
          else { this.resetDefaultPageType(); return null; }
        }
        else { this.resetDefaultPageType(); return null; }
      }
      else { return(<div className="clans-container"><Loader statusText={ status.statusText } /></div>); }
    }
    else { return(<div className="clans-container"><Error error={ status.statusText } /></div>); }
  }
}

export default Clans;
