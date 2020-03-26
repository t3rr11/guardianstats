import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import * as Misc from '../../Misc';
import {AreaSeries, Crosshair, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries} from 'react-vis';

var updateTimer;
var updated = false;

export class Status extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: '' },
    crosshairValues: [],
    chartTimeframe: null,
    charts: null
  }

  async componentDidMount() {
    document.title = "Status - Guardianstats";
    await this.loadTimeFrame();
    this.makeCharts(this.state.chartTimeframe);
    updateTimer = setInterval(() => {
      var numbers = [0,1,2,3,4,5,6]
      if(numbers.includes(new Date().getMinutes() / 10)) {
        if(updated === false) {
          updated = true;
          this.makeCharts(this.state.chartTimeframe);
        }
      }
      else { if(updated) { updated = false; } }
    }, 1000);
  }
  componentWillUnmount() { clearInterval(updateTimer); updateTimer = null; }
  async loadTimeFrame() {
    if(localStorage.getItem("chartTimeframe")) { await this.setState({ chartTimeframe: localStorage.getItem("chartTimeframe") }); }
    else {
      await localStorage.setItem("chartTimeframe", "minute");
      await this.setState({ chartTimeframe: "minute" });
    }
  }
  changeChartTimeframe = (event) => {
    localStorage.setItem("chartTimeframe", event.target.value);
    this.setState({ chartTimeframe: event.target.value });
    this.makeCharts(event.target.value);
  }
  makeCharts(chartTimeframe) {
    var charts = {
      users_all: { name: "Discord Users", data: [], min: null, max: null, first: null, last: null },
      servers: { name: "Discord Servers", data: [], min: null, max: null, first: null, last: null },
      users_tracked: { name: "Tracked Users", data: [], min: null, max: null, first: null, last: null },
      players_all: { name: "All Players", data: [], min: null, max: null, first: null, last: null },
      players_tracked: { name: "Tracked Players", data: [], min: null, max: null, first: null, last: null },
      players_online: { name: "Online Players", data: [], min: null, max: null, first: null, last: null },
      clans_all: { name: "All Clans", data: [], min: null, max: null, first: null, last: null },
      clans_tracked: { name: "Tracked Clans", data: [], min: null, max: null, first: null, last: null },
      guilds_all: { name: "All Guilds", data: [], min: null, max: null, first: null, last: null },
      guilds_tracked: { name: "Tracked Guilds", data: [], min: null, max: null, first: null, last: null },
      broadcasts: { name: "Broadcasts", data: [], min: null, max: null, first: null, last: null }
    }
    var crosshairValues = {
      users_all: { visible: false, data: false },
      servers: { visible: false, data: false },
      users_tracked: { visible: false, data: false },
      players_all: { visible: false, data: false },
      players_tracked: { visible: false, data: false },
      players_online: { visible: false, data: false },
      clans_all: { visible: false, data: false },
      clans_tracked: { visible: false, data: false },
      guilds_all: { visible: false, data: false },
      guilds_tracked: { visible: false, data: false },
      broadcasts: { visible: false, data: false }
    }

    if(chartTimeframe === "minute") {
      return fetch(`https://api.guardianstats.com/GetDailyStatus`, { method: 'GET' }).then((response) => response.json()).then(async (response) => {
        if(response.error === null) {
          for(var i in response.data) {
            Object.keys(response.data[i]).map(function(chart) {
              if(charts[chart]) {
                charts[chart].data.push({ name: chart, x: response.data[i].date, y: response.data[i][chart] });
              }
            });
          }
          Object.keys(charts).map(function(chart) {
            charts[chart].min = Math.min.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].max = Math.max.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].first = charts[chart].data[0].y;
            charts[chart].last = charts[chart].data[charts[chart].data.length-1].y;
          });
          this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, crosshairValues, charts });
        }
      }).catch((err) => { console.log(err); });
    }
    else if(chartTimeframe === "hourly") {
      return fetch(`https://api.guardianstats.com/GetDailyStatus`, { method: 'GET' }).then((response) => response.json()).then(async (response) => {
        if(response.error === null) {
          for(var i in response.data) {
            Object.keys(response.data[i]).map(function(chart) {
              if(charts[chart]) {
                if(new Date(response.data[i].date).getMinutes() == 0) {
                  charts[chart].data.push({ name: chart, x: response.data[i].date, y: response.data[i][chart] });
                }
              }
            });
          }
          Object.keys(charts).map(function(chart) {
            charts[chart].min = Math.min.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].max = Math.max.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].first = charts[chart].data[0].y;
            charts[chart].last = charts[chart].data[charts[chart].data.length-1].y;
          });
          this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, crosshairValues, charts });
        }
      }).catch((err) => { console.log(err); });
    }
    else if(chartTimeframe === "daily") {
      return fetch(`https://api.guardianstats.com/GetWeeklyStatus`, { method: 'GET' }).then((response) => response.json()).then(async (response) => {
        if(response.error === null) {
          for(var i in response.data) {
            Object.keys(response.data[i]).map(function(chart) {
              if(charts[chart]) {
                if(new Date(response.data[i].date).getHours() == 0 && new Date(response.data[i].date).getMinutes() == 0) {
                  charts[chart].data.push({ name: chart, x: response.data[i].date, y: response.data[i][chart] });
                }
              }
            });
          }
          Object.keys(charts).map(function(chart) {
            charts[chart].min = Math.min.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].max = Math.max.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].first = charts[chart].data[0].y;
            charts[chart].last = charts[chart].data[charts[chart].data.length-1].y;
          });
          this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, crosshairValues, charts });
        }
      }).catch((err) => { console.log(err); });
    }
    else if(chartTimeframe === "minuteDifference") {
      return fetch(`https://api.guardianstats.com/GetDailyStatus`, { method: 'GET' }).then((response) => response.json()).then(async (response) => {
        if(response.error === null) {
          for(var i in response.data) {
            Object.keys(response.data[i]).map(function(chart) {
              if(charts[chart]) {
                if(charts[chart].data.length < 1) {
                  charts[chart].data.push({ name: chart, x: response.data[i].date, y: 0 });
                }
                else {
                  charts[chart].data.push({ name: chart, x: response.data[i].date, y: (response.data[i][chart] - response.data[i-1][chart]) });
                }
              }
            });
          }
          Object.keys(charts).map(function(chart) {
            charts[chart].min = Math.min.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].max = Math.max.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].first = charts[chart].data[0].y;
            charts[chart].last = charts[chart].data[charts[chart].data.length-1].y;
          });
          this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, crosshairValues, charts });
        }
      }).catch((err) => { console.log(err); });
    }
    else if(chartTimeframe === "hourlyDifference") {
      return fetch(`https://api.guardianstats.com/GetDailyStatus`, { method: 'GET' }).then((response) => response.json()).then(async (response) => {
        if(response.error === null) {
          var skipCount = 0;
          var count = 0;
          for(var i in response.data) {
            Object.keys(response.data[i]).map(function(chart) {
              if(charts[chart]) {
                if(new Date(response.data[i].date).getMinutes() == 0) {
                  if(charts[chart].data.length < 1) {
                    charts[chart].data.push({ name: chart, x: response.data[i].date, y: 0 });
                    skipCount = 0;
                  }
                  else {
                    count++;
                    charts[chart].data.push({ name: chart, x: response.data[i].date, y: (response.data[i][chart] - response.data[i-Math.round(skipCount)][chart]) });
                    if(count === Object.keys(charts).length) { skipCount = 0; count = 0; }
                  }
                }
                else { skipCount = skipCount + (1 / Object.keys(charts).length); }
              }
            });
          }
          Object.keys(charts).map(function(chart) {
            charts[chart].min = Math.min.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].max = Math.max.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].first = charts[chart].data[0].y;
            charts[chart].last = charts[chart].data[charts[chart].data.length-1].y;
          });
          this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, crosshairValues, charts });
        }
      }).catch((err) => { console.log(err); });
    }
    else if(chartTimeframe === "dailyDifference") {
      return fetch(`https://api.guardianstats.com/GetWeeklyStatus`, { method: 'GET' }).then((response) => response.json()).then(async (response) => {
        if(response.error === null) {
          var skipCount = 0;
          var count = 0;
          for(var i in response.data) {
            Object.keys(response.data[i]).map(function(chart) {
              if(charts[chart]) {
                if(new Date(response.data[i].date).getHours() == 0 && new Date(response.data[i].date).getMinutes() == 0) {
                  if(charts[chart].data.length < 1) {
                    charts[chart].data.push({ name: chart, x: response.data[i].date, y: 0 });
                    skipCount = 0;
                  }
                  else {
                    count++;
                    charts[chart].data.push({ name: chart, x: response.data[i].date, y: (response.data[i][chart] - response.data[i-Math.round(skipCount)][chart]) });
                    if(count === Object.keys(charts).length) { skipCount = 0; count = 0; }
                  }
                }
                else { skipCount = skipCount + (1 / Object.keys(charts).length); }
              }
            });
          }
          Object.keys(charts).map(function(chart) {
            charts[chart].min = Math.min.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].max = Math.max.apply(Math, charts[chart].data.map(function(o) { return o.y; }));
            charts[chart].first = charts[chart].data[0].y;
            charts[chart].last = charts[chart].data[charts[chart].data.length-1].y;
          });
          this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, crosshairValues, charts });
        }
      }).catch((err) => { console.log(err); });
    }
    else { this.setState({ status: { status: 'error', statusText: 'Failed to load as we could not find the requested timeframe.' } }); }
  }

  onNearestX = (value, { index, event }) => {
    var newState = this.state.crosshairValues;
    newState[value.name].visible = true;
    newState[value.name].data = [{ x: value.x, y: value.y }];
    this.setState({ crosshairValues: newState });
  }
  onMouseLeave(chart) {
    var newState = this.state.crosshairValues;
    newState[chart].visible = false;
    newState[chart].data = false;
    this.setState({ crosshairValues: newState });
  }
  getYDomain(min, max, chartTimeframe) {
    if(chartTimeframe === "minuteDifference" || chartTimeframe === "hourlyDifference" || chartTimeframe === "dailyDifference") {
      return [Math.abs(min) > Math.abs(max) ? min : -max, Math.abs(min) > Math.abs(max) ? Math.abs(min) : Math.abs(max)];
    }
    else { return null; }
  }

  render() {
    const { status, crosshairValues, chartTimeframe, charts } = this.state;
    const timestamp = new Date('September 9 2017').getTime();
    const MSEC_DAILY = 86400000;
    if(status.status === "ready") {
      return(
        <div className="statusContainer">
          <div className="graphSelect">
            <div>View By:</div>
            <select className="btn btn-secondary dropdown-toggle" onChange={ this.changeChartTimeframe } value={ chartTimeframe }>
              <option value="minute">10 Min (Growth)</option>
              <option value="hourly">Hourly (Growth)</option>
              <option value="daily">Daily (Growth)</option>
              <option value="minuteDifference">10 Min (Difference)</option>
              <option value="hourlyDifference">Hourly (Difference)</option>
              <option value="dailyDifference">Daily (Difference)</option>
            </select>
          </div>
          <div className="graphContainers">
            {
              Object.keys(charts).map((chart) => {
                return (
                  <div>
                    <div className="statusDetails">
                      <div id="name">{ charts[chart].name }</div>
                      <div id="min">Low: { Misc.numberWithCommas(charts[chart].min) }</div>
                      <div id="max">High: { Misc.numberWithCommas(charts[chart].max) }</div>
                      <div id="curr">Current: { Misc.numberWithCommas(charts[chart].last) } { charts[chart].last - charts[chart].first < 0 ? (<span id="negative">{ charts[chart].last - charts[chart].first }</span>) : (<span id="positive">+{ charts[chart].last - charts[chart].first }</span>) }</div>
                    </div>
                    <XYPlot xType="time" width={ 380 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => this.onMouseLeave(chart) } yDomain={ this.getYDomain(charts[chart].min, charts[chart].max, chartTimeframe) }>
                      <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
                      <XAxis title="X Axis" />
                      <YAxis title="Y Axis" />
                      <LineSeries data={ charts[chart].data } color="#5cabff" onNearestX={ this.onNearestX } />
                      { crosshairValues[chart].visible && <Crosshair values={ crosshairValues[chart].data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
                    </XYPlot>
                  </div>
                )
              })
            }
          </div>
        </div>
      );
    }
    else {
      return(
        <div className="statusContainer">
          <Loader statusText={ status.statusText } />
        </div>
      );
    }
  }
}

export default Status;
