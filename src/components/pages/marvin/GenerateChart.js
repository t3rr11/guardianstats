import React from 'react';
import * as Misc from '../../Misc';
import Error from '../../modules/Error';
import { Crosshair, XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';

//Generate Charts
export function generateChartPage(parent) {
  const charts = parent.state.charts;
  const currentChart = parent.state.currentChart;
  const chart = charts.find(e => e.name === currentChart);
  if(chart) {
    if(currentChart !== "guardian_games") {
      return (
        <div className="graph-containers">
          <div className="left-graph-containers">
            { generateSingleChart(parent, currentChart, "hourly_data", { width: 750, height: 170 }) }
            { generateSingleChart(parent, currentChart, "daily_data", { width: 750, height: 170 }) }
            { generateSingleChart(parent, currentChart, "weekly_data", { width: 750, height: 170 }) }
          </div>
          <div className="right-graph-containers">
            { generateSingleChart(parent, currentChart, "d_hourly_data", { width: 750, height: 170 }) }
            { generateSingleChart(parent, currentChart, "d_daily_data", { width: 750, height: 170 }) }
            { generateSingleChart(parent, currentChart, "d_weekly_data", { width: 750, height: 170 }) }
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="graph-containers">
          <div className="left-graph-containers">
            { generateGuardianGamesChart(parent, currentChart, "Laurels", "hourly_data", { width: 750, height: 170 }) }
            { generateGuardianGamesChart(parent, currentChart, "Laurels", "daily_data", { width: 750, height: 170 }) }
            { generateGuardianGamesChart(parent, currentChart, "Laurels", "weekly_data", { width: 750, height: 170 }) }
            { generateGuardianGamesChart(parent, currentChart, "Online", "hourly_data", { width: 750, height: 170 }) }
            { generateGuardianGamesChart(parent, currentChart, "Online", "daily_data", { width: 750, height: 170 }) }
            { generateGuardianGamesChart(parent, currentChart, "Online", "weekly_data", { width: 750, height: 170 }) }
          </div>
          <div className="right-graph-containers">
            { generateGuardianGamesChart(parent, currentChart, "Medals", "hourly_data", { width: 750, height: 170 }) }
            { generateGuardianGamesChart(parent, currentChart, "Medals", "daily_data", { width: 750, height: 170 }) }
            { generateGuardianGamesChart(parent, currentChart, "Medals", "weekly_data", { width: 750, height: 170 }) }
          </div>
        </div>
      )
    }
  }
}
export function generateOverviewChart(parent) {
  let report = parent.state.stats.data;
  let status = report.status;
  return (
    <div className="overview-container">
      <div className="overview-statistics">
        <div className="server-status-containers">
          <div className="report-container">
            <div id="report-info">
              <h4 className="title">Marvin Report</h4>
              <div>Still under construction, Implementing more over the next few days as well as mobile/laptop compatability. Page built for a 1920x1080 screen at the moment.</div>
            </div>
            <div id="backend-container">
              <h5 className="title">Backend Status</h5>
              <div>Bungie API: { status.backend.APIDisabled ? <span style={{ color: "tomato" }}>Offline</span> : <span style={{ color: "#259A58" }}>Online</span> }</div>
              <div>Uptime: { Misc.formatTime(status.backend.uptime / 1000) }</div>
              <div>Scan Time: { Misc.formatTime(status.backend.scanTime / 1000) }</div>
              <div>Last Scan: { Misc.formatTime(status.backend.lastScan / 1000) } ago</div>
              <div>Total Scans: { Misc.AddCommas(status.backend.scans) }</div>
              <div>Max Scan Speed: { Misc.AddCommas(status.backend.scanSpeed) } / sec</div>
              <div>Current Scan Speed: { Misc.AddCommas(status.backend.processingClans) } / sec</div>
            </div>
            <div id="frontend-container">
              <h5 className="title">Frontend Status</h5>
              <div>Marvin: <span style={{ color: "#259A58" }}>Online</span></div>
              <div>Uptime: { Misc.formatTime(status.frontend.uptime / 1000) }</div>
              <div>Commands: { status.frontend.commandsInput }</div>
              <div>Users: { Misc.AddCommas(status.frontend.users) }</div>
              <div>Servers: { Misc.AddCommas(status.frontend.servers) }</div>
            </div>
            <div id="most-used-commands">
              <h5 className="title">Most used commands</h5>
              <div>
                {
                  report.overall.commands.data.slice(0,5).map((command) => {
                    return <div key={ command.name }>{ command.name }: { Misc.AddCommas(command.amount) }</div>
                  })
                }
              </div>
            </div>
            <div id="most-used-commands-session">
              <h5 className="title">Most used commands (session)</h5>
              <div>
                {
                  report.session.commands.data.slice(0,5).map((command) => {
                    return <div key={ command.name }>{ command.name }: { Misc.AddCommas(command.amount) }</div>
                  })
                }
              </div>
            </div>
            <div id="most-seasonal-item-broadcasts">
              <h5 className="title">Most seasonal item broadcasts</h5>
              <div>
                {
                  report.overall.broadcasts.data[report.overall.broadcasts.data.length-1].items.slice(0,5).map((item) => {
                    return <div key={ item.name }>{ item.name }: { Misc.AddCommas(item.amount) }</div>
                  })
                }
              </div>
            </div>
            <div id="most-seasonal-title-broadcasts">
              <h5 className="title">Most seasonal title broadcasts</h5>
              <div>
                {
                  report.overall.broadcasts.data[report.overall.broadcasts.data.length-1].titles.slice(0,5).map((title) => {
                    return <div key={ title.name }>{ title.name }: { Misc.AddCommas(title.amount) }</div>
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="overview-graphs">
        <div className="single-graph"> { generateSingleChart(parent, 'users_all', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'players_all', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'players_tracked', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'clans_tracked', "daily_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'clans_all', "daily_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'guilds_tracked', "daily_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'guilds_all', "daily_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'servers', "daily_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'users_tracked', "daily_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'broadcasts', "d_hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'players_online', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateGuardianGamesChart(parent, 'guardian_games', "Online", "hourly_data", { width: 350, height: 170 }) } </div>
      </div>
    </div>
  )
}
export function generateSingleChart(parent, currentChart, data_set, size) {
  const charts = parent.state.charts;
  const chart = charts.find(e => e.name === currentChart);
  let chartType = "";
  if(data_set.includes("hourly")){ if(data_set.includes("d_hourly")){ chartType = "24hr Difference" } else { chartType = "24hr Growth" } }
  else if(data_set.includes("daily")){ if(data_set.includes("d_daily")){ chartType = "Daily Difference" } else { chartType = "Daily Growth" } }
  else if(data_set.includes("weekly")){ if(data_set.includes("d_weekly")){ chartType = "Weekly Difference" } else { chartType = "Weekly Growth" } }
  if(chart) {
    return (
      <div className={ `${ data_set }_chart` }>
        <div className="status-details">
          <div id="name">{ chart.friendly_name } - { chartType }</div>
          <div id="min">Low: { Misc.AddCommas(chart[data_set].min) }</div>
          <div id="max">High: { Misc.AddCommas(chart[data_set].max) }</div>
          <div id="curr">Current: { Misc.AddCommas(chart[data_set].last) } { chart[data_set].last - chart[data_set].first < 0 ? (<span id="negative">{ chart[data_set].last - chart[data_set].first }</span>) : (<span id="positive">+{ chart[data_set].last - chart[data_set].first }</span>) }</div>
        </div>
        <XYPlot xType="time" width={ size.width } height={ size.height } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, data_set) }>
          <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
          <XAxis title="X Axis" />
          <YAxis title="Y Axis" />
          <LineSeries data={ chart[data_set].graph_data } color="#5cabff" onNearestX={ parent.onNearestX } />
          { chart[data_set].crosshair_data.visible && <Crosshair values={ chart[data_set].crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
        </XYPlot>
      </div>
    )
  }
}
export function generateGuardianGamesChart(parent, currentChart, type, data_set, size) {
  const charts = parent.state.charts;
  const chart = charts.find(e => e.name === currentChart);
  console.log(chart);
  let chartType = "";
  if(data_set.includes("hourly")){ if(data_set.includes("d_hourly")){ chartType = "24hr Difference" } else { chartType = "24hr Growth" } }
  else if(data_set.includes("daily")){ if(data_set.includes("d_daily")){ chartType = "Daily Difference" } else { chartType = "Daily Growth" } }
  else if(data_set.includes("weekly")){ if(data_set.includes("d_weekly")){ chartType = "Weekly Difference" } else { chartType = "Weekly Growth" } }
  if(chart) {
    return (
      <div className={ `${ data_set }_chart` }>
        <div className="status-details">
          <div id="name">{ type } - { chartType }</div>
        </div>
        <div className="class-details">
          <div id="className" style={{ color: "#fd7e14" }}>Titan</div>
          <div id="className" style={{ color: "#28a745" }}>Hunter</div>
          <div id="className" style={{ color: "#5cabff" }}>Warlock</div>
        </div>
        <XYPlot xType="time" width={ size.width } height={ size.height } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, data_set) }>
          <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
          <XAxis title="X Axis" />
          <YAxis title="Y Axis" />
          <LineSeries data={ chart[data_set].graph_data[type]["Titan"] } color="#fd7e14" onNearestX={ parent.onNearestX } />
          <LineSeries data={ chart[data_set].graph_data[type]["Hunter"] } color="#28a745" onNearestX={ parent.onNearestX } />
          <LineSeries data={ chart[data_set].graph_data[type]["Warlock"] } color="#5cabff" onNearestX={ parent.onNearestX } />
          { chart[data_set].crosshair_data.visible && <Crosshair values={ chart[data_set].crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
        </XYPlot>
      </div>
    )
  }
}

//Make Charts
export async function buildGraphDataSet() {
  let last_update = new Date().getTime();
  let charts = [
    { name: "clans_all", friendly_name: "All Clans" },
    { name: "guilds_all", friendly_name: "All Guilds" },
    { name: "players_all", friendly_name: "All Players" },
    { name: "broadcasts", friendly_name: "Broadcasts" },
    { name: "servers", friendly_name: "Discord Servers" },
    { name: "users_all", friendly_name: "Discord Users" },
    { name: "players_online", friendly_name: "Online Players" },
    { name: "clans_tracked", friendly_name: "Tracked Clans" },
    { name: "guilds_tracked", friendly_name: "Tracked Guilds" },
    { name: "players_tracked", friendly_name: "Tracked Players" },
    { name: "users_tracked", friendly_name: "Tracked Users" },
    { name: "guardian_games", friendly_name: "Guardian Games" }
  ];
  for(let i in charts) {
    if(charts[i].name === "guardian_games") {
      charts[i] = {
        name: charts[i].name,
        friendly_name: charts[i].friendly_name,
        hourly_data: { graph_data: { "All": { "Warlock": [], "Titan": [], "Hunter": [] }, "Online": { "Warlock": [], "Titan": [], "Hunter": [] }, "Laurels": { "Warlock": [], "Titan": [], "Hunter": [] }, "Medals": { "Warlock": [], "Titan": [], "Hunter": [] } }, crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        daily_data: { graph_data: { "All": { "Warlock": [], "Titan": [], "Hunter": [] }, "Online": { "Warlock": [], "Titan": [], "Hunter": [] }, "Laurels": { "Warlock": [], "Titan": [], "Hunter": [] }, "Medals": { "Warlock": [], "Titan": [], "Hunter": [] } }, crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        weekly_data: { graph_data: { "All": { "Warlock": [], "Titan": [], "Hunter": [] }, "Online": { "Warlock": [], "Titan": [], "Hunter": [] }, "Laurels": { "Warlock": [], "Titan": [], "Hunter": [] }, "Medals": { "Warlock": [], "Titan": [], "Hunter": [] } }, crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        d_hourly_data: { graph_data: { "All": { "Warlock": [], "Titan": [], "Hunter": [] }, "Online": { "Warlock": [], "Titan": [], "Hunter": [] }, "Laurels": { "Warlock": [], "Titan": [], "Hunter": [] }, "Medals": { "Warlock": [], "Titan": [], "Hunter": [] } }, crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        d_daily_data: { graph_data: { "All": { "Warlock": [], "Titan": [], "Hunter": [] }, "Online": { "Warlock": [], "Titan": [], "Hunter": [] }, "Laurels": { "Warlock": [], "Titan": [], "Hunter": [] }, "Medals": { "Warlock": [], "Titan": [], "Hunter": [] } }, crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        d_weekly_data: { graph_data: { "All": { "Warlock": [], "Titan": [], "Hunter": [] }, "Online": { "Warlock": [], "Titan": [], "Hunter": [] }, "Laurels": { "Warlock": [], "Titan": [], "Hunter": [] }, "Medals": { "Warlock": [], "Titan": [], "Hunter": [] } }, crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
      }
    }
    else { 
      charts[i] = {
        name: charts[i].name,
        friendly_name: charts[i].friendly_name,
        hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        d_hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        d_daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
        d_weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
      }
    }
  }

  const Graphs = await GetGraphs();
  const keys = []; for(let i in charts){ keys.push(charts[i].name) }

  //Status data from the SQL
  let hourly_data = [];
  let daily_data = [];
  let weekly_data = [];

  //Sort them into groups.
  for(let i in Graphs.data) {
    if(Graphs.data[i].date > (new Date().getTime() - 86400000)) { hourly_data.push(Graphs.data[i]) }
    if(Graphs.data[i].date > (new Date().getTime() - (86400000 * 7))) { daily_data.push(Graphs.data[i]) }
    weekly_data.push(Graphs.data[i]);
  }

  //Process chart data
  await processCharts(charts, hourly_data, "hourly_data");
  await processCharts(charts, daily_data, "daily_data");
  await processCharts(charts, weekly_data, "weekly_data");

  //Once all is done, return charts
  return { charts, last_update: Graphs.data[Graphs.data.length-1].date };
}
async function processCharts(charts, chart_data, name) {
  //Loop through variables in data to find matches for charts
  for(let i in chart_data) {
    Object.keys(chart_data[i]).map(function(chart) {
      for(let j in charts) {
        //If guardian games do this
        if(chart === "guardian_games") { if(charts[j].name === chart) { ProcessGuardianGamesData(charts[j], chart_data[i], name, chart); } }
        else {
          if(charts[j].name === chart) {
            //Store growth
            charts[j][name].graph_data.push({ name: chart, type: name, x: chart_data[i].date, y: chart_data[i][chart] });

            //Store difference
            if(charts[j][`d_${name}`].graph_data.length < 1) { charts[j][`d_${name}`].graph_data.push({ name: chart, type:`d_${ name }`, x: chart_data[i].date, y: 0 }); }
            else { charts[j][`d_${name}`].graph_data.push({ name: chart, type:`d_${ name }`, x: chart_data[i].date, y: (chart_data[i][chart] - chart_data[i-1][chart]) }); }
          }
        }
      }
    });
  }
  //Now loop through and find max and minimums, first and lasts
  for(let i in charts) {
    if(charts[i].name !== "guardian_games") {
      charts[i][name].min = Math.min.apply(Math, charts[i][name].graph_data.map(function(o) { return o.y; }));
      charts[i][name].max = Math.max.apply(Math, charts[i][name].graph_data.map(function(o) { return o.y; }));
      charts[i][name].first = charts[i][name].graph_data[0].y;
      charts[i][name].last = charts[i][name].graph_data[charts[i][name].graph_data.length-1].y;
      charts[i][`d_${name}`].min = Math.min.apply(Math, charts[i][`d_${name}`].graph_data.map(function(o) { return o.y; }));
      charts[i][`d_${name}`].max = Math.max.apply(Math, charts[i][`d_${name}`].graph_data.map(function(o) { return o.y; }));
      charts[i][`d_${name}`].first = charts[i][`d_${name}`].graph_data[0].y;
      charts[i][`d_${name}`].last = charts[i][`d_${name}`].graph_data[charts[i][`d_${name}`].graph_data.length-1].y;
    }
  }
}
async function ProcessGuardianGamesData(charts, chart_data, name, chart) {
  //Parse json data
  let gg = JSON.parse(chart_data[chart]);

  //Sort data into their respective categories
  for(let k in gg) {
    if(k !== "null") {
      for(let l in gg[k]) {
        if(l !== "null") {
          charts[name].graph_data[k][l].push({ name: chart, type: name, x: chart_data.date, y: gg[k][l] });
        }
      }
    }
  }
}

//Gets
export async function GetGraphs(type) { return await fetch(`https://api.guardianstats.com/GetMonthlyStatus`, { method: 'GET' }).then((response) => response.json()).then(async (response) => { return response; }).catch((err) => { console.log(err); return { error: true } }); }
export async function GetStatus(type) { return await fetch(`https://api.guardianstats.com/GetReport`, { method: 'GET' }).then((response) => response.json()).then(async (response) => { return response; }).catch((err) => { console.log(err); return { error: true } }); }