import React, { Component } from 'react';
import * as Misc from '../../Misc';
import { AreaSeries, Crosshair, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries } from 'react-vis';

//Generate Charts
export function generateChartPage(parent) {
  const charts = parent.state.charts;
  const currentChart = parent.state.currentChart;
  const chart = charts.find(e => e.name === currentChart);
  if(chart) {
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
}
export function generateSingleChart(parent, currentChart, data_set, size) {
  const charts = parent.state.charts;
  const chart = charts.find(e => e.name === currentChart);
  if(chart) {
    return (
      <div className={ `${ data_set }_chart` }>
        <div className="status-details">
          <div id="name">{ chart.friendly_name } - 24hr Growth</div>
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
export function generateOverviewChart(parent) {
  let logs = parent.state.logs;
  let stats = parent.state.stats;
  return (
    <div className="overview-container">
      <div className="overview-graphs">
        <div className="single-graph"> { generateSingleChart(parent, 'users_all', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'players_all', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'players_online', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'clans_tracked', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'clans_all', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'guilds_tracked', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'guilds_all', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'servers', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'players_tracked', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'users_tracked', "hourly_data", { width: 350, height: 170 }) } </div>
        <div className="single-graph"> { generateSingleChart(parent, 'broadcasts', "d_hourly_data", { width: 350, height: 170 }) } </div>
      </div>
      <div className="server-status-containers">
        <div className="backend-container">
          <h4 className="title">Backend Status</h4>
          <div>Bungie API: { stats.backend.APIDisabled ? <span style={{ color: "tomato" }}>Offline</span> : <span style={{ color: "#259A58" }}>Online</span> }</div>
          <div>Uptime: { Misc.formatTime(stats.backend.uptime / 1000) }</div>
          <div>Scan Time: { Misc.formatTime(stats.backend.scanTime / 1000) }</div>
          <div>Last Scan: { Misc.formatTime(stats.backend.lastScan / 1000) }</div>
          <div>Total Scans: { Misc.AddCommas(stats.backend.scans) }</div>
          <div>Max Scan Speed: { Misc.AddCommas(stats.backend.scanSpeed) } / sec</div>
          <div>Current Scan Speed: { Misc.AddCommas(stats.backend.processingClans) } / sec</div>
        </div>
        <div className="frontend-container">
          <h4 className="title">Frontend Status</h4>
          <div>Marvin: <span style={{ color: "#259A58" }}>Online</span></div>
          <div>Uptime: { Misc.formatTime(stats.frontend.uptime / 1000) }</div>
          <div>Commands: { stats.frontend.commandsInput }</div>
          <div>Users: { Misc.AddCommas(stats.frontend.users) }</div>
          <div>Servers: { Misc.AddCommas(stats.frontend.servers) }</div>
        </div>
      </div>
    </div>
  )
}

//Make Charts
export async function buildDataSet() {
  let logs = { frontend: null, backend: null }
  let stats = { frontend: null, backend: null }
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
    { name: "users_tracked", friendly_name: "Tracked Users" }
  ];
  for(let i in charts) {
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

  await Promise.all([
    await GetStatus('hourly'),
    await GetStatus('daily'),
    await GetStatus('weekly'),
    await GetStatus('front_log'),
    await GetStatus('back_log'),
    await GetStatus('front_status'),
    await GetStatus('back_status')
  ]).then(async (data) => {
    const keys = []; for(let i in charts){ keys.push(charts[i].name) }

    //Status data from the SQL
    let hourly_data = data[0];
    let daily_data = data[1];
    let weekly_data = data[2];

    //Data from JSON files on server
    logs.frontend = data[3].data;
    logs.backend = data[4].data;
    stats.frontend = data[5].data;
    stats.backend = data[6].data;

    //Process chart data
    await processCharts(charts, hourly_data, "hourly_data")
    await processCharts(charts, daily_data, "daily_data")
    await processCharts(charts, weekly_data, "weekly_data")

  }).catch(async (err) => { console.log(err) });

  //Once all is done, return charts
  return { charts, logs, stats };
}
async function processCharts(charts, chart_data, name) {
  if(chart_data.error === null) {
    //Loop through variables in data to find matches for charts
    for(let i in chart_data.data) {
      Object.keys(chart_data.data[i]).map(function(chart) {
        for(let j in charts) {
          if(charts[j].name === chart) {
            //Store growth
            charts[j][name].graph_data.push({ name: chart, type: name, x: chart_data.data[i].date, y: chart_data.data[i][chart] });

            //Store difference
            if(charts[j][`d_${name}`].graph_data.length < 1) { charts[j][`d_${name}`].graph_data.push({ name: chart, type:`d_${ name }`, x: chart_data.data[i].date, y: 0 }); }
            else { charts[j][`d_${name}`].graph_data.push({ name: chart, type:`d_${ name }`, x: chart_data.data[i].date, y: (chart_data.data[i][chart] - chart_data.data[i-1][chart]) }); }
          }
        }
      });
    }
    //Now loop through and find max and minimums, first and lasts
    for(let i in charts) {
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

//Gets
async function GetStatus(type) {
  const hourly_url = `https://api.guardianstats.com/GetDailyStatus`;
  const daily_url = `https://api.guardianstats.com/GetWeeklyStatus`;
  const weekly_url = `https://api.guardianstats.com/GetMonthlyStatus`;
  const front_log_url = `https://api.guardianstats.com/GetFrontLog`;
  const back_log_url = `https://api.guardianstats.com/GetBackLog`;
  const front_status_url = `https://api.guardianstats.com/GetFrontStatus`;
  const back_status_url = `https://api.guardianstats.com/GetBackStatus`;
  let url = null;

  if(type === "hourly") { url = hourly_url }
  else if(type === "daily") { url = daily_url }
  else if(type === "weekly") { url = weekly_url }
  else if(type === "front_log") { url = front_log_url }
  else if(type === "back_log") { url = back_log_url }
  else if(type === "front_status") { url = front_status_url }
  else if(type === "back_status") { url = back_status_url }
  else { url = hourly_url }

  return await fetch(url, { method: 'GET' }).then((response) => response.json()).then(async (response) => { return response; }).catch((err) => { console.log(err); return { error: true } });
}