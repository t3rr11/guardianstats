import React, { Component } from 'react';
import * as Misc from '../../Misc';
import { AreaSeries, Crosshair, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries } from 'react-vis';

//Generate Charts
export function generateChart(parent) {
  const charts = parent.state.charts;
  const currentChart = parent.state.currentChart;
  const chart = charts.find(e => e.name === currentChart);
  if(chart) {
    return (
      <div className="graph-containers">
        <div className="left-graph-containers">
          <div className="hourly_data_chart">
            <div className="status-details">
              <div id="name">{ chart.friendly_name } - 24 Hours (Growth)</div>
              <div id="min">Low: { Misc.AddCommas(chart.hourly_data.min) }</div>
              <div id="max">High: { Misc.AddCommas(chart.hourly_data.max) }</div>
              <div id="curr">Current: { Misc.AddCommas(chart.hourly_data.last) } { chart.hourly_data.last - chart.hourly_data.first < 0 ? (<span id="negative">{ chart.hourly_data.last - chart.hourly_data.first }</span>) : (<span id="positive">+{ chart.hourly_data.last - chart.hourly_data.first }</span>) }</div>
            </div>
            <XYPlot xType="time" width={ 750 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, 'hourly_data') } yDomain={ parent.getYDomain(chart.hourly_data.min, chart.hourly_data.max) }>
              <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
              <XAxis title="X Axis" />
              <YAxis title="Y Axis" />
              <LineSeries data={ chart.hourly_data.graph_data } color="#5cabff" onNearestX={ parent.onNearestX } />
              { chart.hourly_data.crosshair_data.visible && <Crosshair values={ chart.hourly_data.crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
            </XYPlot>
          </div>
          <div className="daily_data_chart">
            <div className="status-details">
              <div id="name">{ chart.friendly_name } - Weekly (Growth)</div>
              <div id="min">Low: { Misc.AddCommas(chart.daily_data.min) }</div>
              <div id="max">High: { Misc.AddCommas(chart.daily_data.max) }</div>
              <div id="curr">Current: { Misc.AddCommas(chart.daily_data.last) } { chart.daily_data.last - chart.daily_data.first < 0 ? (<span id="negative">{ chart.daily_data.last - chart.daily_data.first }</span>) : (<span id="positive">+{ chart.daily_data.last - chart.daily_data.first }</span>) }</div>
            </div>
            <XYPlot xType="time" width={ 750 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, 'daily_data') } yDomain={ parent.getYDomain(chart.daily_data.min, chart.daily_data.max) }>
              <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
              <XAxis title="X Axis" />
              <YAxis title="Y Axis" />
              <LineSeries data={ chart.daily_data.graph_data } color="#5cabff" onNearestX={ parent.onNearestX } />
              { chart.daily_data.crosshair_data.visible && <Crosshair values={ chart.daily_data.crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
            </XYPlot>
          </div>
          <div className="weekly_data_chart">
            <div className="status-details">
              <div id="name">{ chart.friendly_name } - Monthly (Growth)</div>
              <div id="min">Low: { Misc.AddCommas(chart.weekly_data.min) }</div>
              <div id="max">High: { Misc.AddCommas(chart.weekly_data.max) }</div>
              <div id="curr">Current: { Misc.AddCommas(chart.weekly_data.last) } { chart.weekly_data.last - chart.weekly_data.first < 0 ? (<span id="negative">{ chart.weekly_data.last - chart.weekly_data.first }</span>) : (<span id="positive">+{ chart.weekly_data.last - chart.weekly_data.first }</span>) }</div>
            </div>
            <XYPlot xType="time" width={ 750 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, 'weekly_data') } yDomain={ parent.getYDomain(chart.weekly_data.min, chart.weekly_data.max) }>
              <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
              <XAxis title="X Axis" />
              <YAxis title="Y Axis" />
              <LineSeries data={ chart.weekly_data.graph_data } color="#5cabff" onNearestX={ parent.onNearestX } />
              { chart.weekly_data.crosshair_data.visible && <Crosshair values={ chart.weekly_data.crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
            </XYPlot>
          </div>
        </div>
        <div className="right-graph-containers">
          <div className="d_hourly_data_chart">
            <div className="status-details">
              <div id="name">{ chart.friendly_name } - 24 Hours (Difference)</div>
              <div id="min">Low: { Misc.AddCommas(chart.d_hourly_data.min) }</div>
              <div id="max">High: { Misc.AddCommas(chart.d_hourly_data.max) }</div>
              <div id="curr">Current: { Misc.AddCommas(chart.d_hourly_data.last) } { chart.d_hourly_data.last - chart.d_hourly_data.first < 0 ? (<span id="negative">{ chart.d_hourly_data.last - chart.d_hourly_data.first }</span>) : (<span id="positive">+{ chart.d_hourly_data.last - chart.d_hourly_data.first }</span>) }</div>
            </div>
            <XYPlot xType="time" width={ 750 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, 'd_hourly_data') } yDomain={ parent.getYDomain(chart.d_hourly_data.min, chart.d_hourly_data.max) }>
              <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
              <XAxis title="X Axis" />
              <YAxis title="Y Axis" />
              <LineSeries data={ chart.d_hourly_data.graph_data } color="#5cabff" onNearestX={ parent.onNearestX } />
              { chart.d_hourly_data.crosshair_data.visible && <Crosshair values={ chart.d_hourly_data.crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
            </XYPlot>
          </div>
          <div className="d_daily_data_chart">
            <div className="status-details">
              <div id="name">{ chart.friendly_name } - Weekly (Difference)</div>
              <div id="min">Low: { Misc.AddCommas(chart.d_daily_data.min) }</div>
              <div id="max">High: { Misc.AddCommas(chart.d_daily_data.max) }</div>
              <div id="curr">Current: { Misc.AddCommas(chart.d_daily_data.last) } { chart.d_daily_data.last - chart.d_daily_data.first < 0 ? (<span id="negative">{ chart.d_daily_data.last - chart.d_daily_data.first }</span>) : (<span id="positive">+{ chart.d_daily_data.last - chart.d_daily_data.first }</span>) }</div>
            </div>
            <XYPlot xType="time" width={ 750 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, 'd_daily_data') } yDomain={ parent.getYDomain(chart.d_daily_data.min, chart.d_daily_data.max) }>
              <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
              <XAxis title="X Axis" />
              <YAxis title="Y Axis" />
              <LineSeries data={ chart.d_daily_data.graph_data } color="#5cabff" onNearestX={ parent.onNearestX } />
              { chart.d_daily_data.crosshair_data.visible && <Crosshair values={ chart.d_daily_data.crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
            </XYPlot>
          </div>
          <div className="d_weekly_data_chart">
            <div className="status-details">
              <div id="name">{ chart.friendly_name } - Monthly (Difference)</div>
              <div id="min">Low: { Misc.AddCommas(chart.d_weekly_data.min) }</div>
              <div id="max">High: { Misc.AddCommas(chart.d_weekly_data.max) }</div>
              <div id="curr">Current: { Misc.AddCommas(chart.d_weekly_data.last) } { chart.d_weekly_data.last - chart.d_weekly_data.first < 0 ? (<span id="negative">{ chart.d_weekly_data.last - chart.d_weekly_data.first }</span>) : (<span id="positive">+{ chart.d_weekly_data.last - chart.d_weekly_data.first }</span>) }</div>
            </div>
            <XYPlot xType="time" width={ 750 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, 'd_weekly_data') } yDomain={ parent.getYDomain(chart.d_weekly_data.min, chart.d_weekly_data.max) }>
              <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
              <XAxis title="X Axis" />
              <YAxis title="Y Axis" />
              <LineSeries data={ chart.d_weekly_data.graph_data } color="#5cabff" onNearestX={ parent.onNearestX } />
              { chart.d_weekly_data.crosshair_data.visible && <Crosshair values={ chart.d_weekly_data.crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
            </XYPlot>
          </div>
        </div>
      </div>
    )
  }
}
export function generateSingleHourlyChart(parent, currentChart) {
  const charts = parent.state.charts;
  const chart = charts.find(e => e.name === currentChart);
  if(chart) {
    return (
      <div className="hourly_data_chart">
        <div className="status-details">
          <div id="name">{ chart.friendly_name } - 24hr Growth</div>
          <div id="min">Low: { Misc.AddCommas(chart.hourly_data.min) }</div>
          <div id="max">High: { Misc.AddCommas(chart.hourly_data.max) }</div>
          <div id="curr">Current: { Misc.AddCommas(chart.hourly_data.last) } { chart.hourly_data.last - chart.hourly_data.first < 0 ? (<span id="negative">{ chart.hourly_data.last - chart.hourly_data.first }</span>) : (<span id="positive">+{ chart.hourly_data.last - chart.hourly_data.first }</span>) }</div>
        </div>
        <XYPlot xType="time" width={ 350 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, 'hourly_data') } yDomain={ parent.getYDomain(chart.hourly_data.min, chart.hourly_data.max) }>
          <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
          <XAxis title="X Axis" />
          <YAxis title="Y Axis" />
          <LineSeries data={ chart.hourly_data.graph_data } color="#5cabff" onNearestX={ parent.onNearestX } />
          { chart.hourly_data.crosshair_data.visible && <Crosshair values={ chart.hourly_data.crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
        </XYPlot>
      </div>
    )
  }
}
export function generateSingleD_HourlyChart(parent, currentChart) {
  const charts = parent.state.charts;
  const chart = charts.find(e => e.name === currentChart);
  if(chart) {
    return (
      <div className="d_hourly_data_chart">
        <div className="status-details">
          <div id="name">{ chart.friendly_name } - 24hr Difference</div>
          <div id="min">Low: { Misc.AddCommas(chart.d_hourly_data.min) }</div>
          <div id="max">High: { Misc.AddCommas(chart.d_hourly_data.max) }</div>
          <div id="curr">Current: { Misc.AddCommas(chart.d_hourly_data.last) } { chart.d_hourly_data.last - chart.d_hourly_data.first < 0 ? (<span id="negative">{ chart.d_hourly_data.last - chart.d_hourly_data.first }</span>) : (<span id="positive">+{ chart.d_hourly_data.last - chart.d_hourly_data.first }</span>) }</div>
        </div>
        <XYPlot xType="time" width={ 350 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart, 'd_hourly_data') } yDomain={ parent.getYDomain(chart.d_hourly_data.min, chart.d_hourly_data.max) }>
          <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
          <XAxis title="X Axis" />
          <YAxis title="Y Axis" />
          <LineSeries data={ chart.d_hourly_data.graph_data } color="#5cabff" onNearestX={ parent.onNearestX } />
          { chart.d_hourly_data.crosshair_data.visible && <Crosshair values={ chart.d_hourly_data.crosshair_data.data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
        </XYPlot>
      </div>
    )
  }
}
export function generateOverviewChart(parent) {
  let logs = parent.state.logs;
  let stats = parent.state.stats;
  console.log(logs, stats);
  return (
    <div className="overview-container">
      <div className="overview-graphs">
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'users_all') } </div>
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'players_all') } </div>
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'players_online') } </div>
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'clans_tracked') } </div>
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'clans_all') } </div>
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'guilds_tracked') } </div>
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'guilds_all') } </div>
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'servers') } </div>
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'players_tracked') } </div>
        <div className="single-graph"> { generateSingleHourlyChart(parent, 'users_tracked') } </div>
        <div className="single-graph"> { generateSingleD_HourlyChart(parent, 'broadcasts') } </div>
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
export async function makeCharts() {
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