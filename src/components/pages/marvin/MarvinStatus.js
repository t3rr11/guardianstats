import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import * as Misc from '../../Misc';
import * as ChartGen from './ChartGen';

let graphUpdateTimer = null;
let updatingGraphs = false;
let statusUpdateTimer = null;

export class Status extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Checking status...' },
    currentChart: 'overview',
    charts: null,
    logs: null,
    stats: null,
    last_update: 0
  }

  async componentDidMount() {
    document.title = "Status - Guardianstats";
    await this.buildCharts();
  }
  async buildCharts() {
    let currentChart = 'overview'; if(localStorage.getItem("currentChart")) { currentChart = localStorage.getItem("currentChart") }
    let charts, last_update, logs, stats;
    await Promise.all([
      await ChartGen.buildGraphDataSet(),
      await ChartGen.buildStatusDataSet(this)
    ]).then(async (data) => {
      charts = data[0].charts;
      last_update = data[0].last_update;
      logs = data[1].logs;
      stats = data[1].stats;
    }).catch(async (err) => { console.log(err); this.setState({ status: { status: 'error', statusText: 'Failed to get graph data from server... Error logged in console.' } }) });
    this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, currentChart, charts, logs, stats, last_update });
    this.startTimers();
  }
  onNearestX = (value, { index, event }) => {
    let charts = this.state.charts;
    let crosshair_data = { visible: true, data: [{ x: value.x, y: value.y }] }
    charts[charts.indexOf(charts.find(e => e.name === value.name))][value.type].crosshair_data = crosshair_data;
    this.setState({ charts });
  }
  onMouseLeave(chart, type) {
    let charts = this.state.charts;
    let crosshair_data = { visible: false, data: false }
    charts[charts.indexOf(charts.find(e => e.name === chart))][type].crosshair_data = crosshair_data;
    this.setState({ charts });
  }
  setChart(chart) {
    localStorage.setItem("currentChart", chart);
    this.setState({ currentChart: chart });
  }
  startTimers() {
    if(graphUpdateTimer === null) { graphUpdateTimer = setInterval((e) => { if(new Date().getTime() - (this.state.last_update + 605000) > 0 && !updatingGraphs) { this.updateGraphs(); } }, 1000) }
    if(statusUpdateTimer === null) { statusUpdateTimer = setInterval((e) => { this.updateStatus() }, 1000) }
  }
  async updateGraphs() {
    updatingGraphs = true;
    const { charts, last_update } = await ChartGen.buildGraphDataSet();
    if(this.state.last_update !== last_update) { this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, charts, last_update }) }
    this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, charts, last_update });
    console.log(new Date().toLocaleString() + ": Updated Graphs");
    updatingGraphs = false;
  }
  async updateStatus() {
    const { logs, stats } = await ChartGen.buildStatusDataSet(this);
    this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, logs, stats });
  }

  render() {
    const { status, currentChart, charts } = this.state;
    if(status.status === "ready") {
      return (
        <div className="status-container">
          <div className="status-menu">
            <div className={ `status-menu-item ${ currentChart === "overview" ? "active" : null }` } key="overview" id="overview" onClick={ (() => this.setChart("overview")) }>Overview</div>
            { Object.keys(charts).map((chart) => { return (<div className={ `status-menu-item ${ charts[chart].name === currentChart ? "active" : null }` } key={ charts[chart].name } id={ charts[chart].name } onClick={ (() => this.setChart(charts[chart].name)) }>{ charts[chart].friendly_name }</div>) }) }
          </div>
          <div className="status-content">{ currentChart === 'overview' ? ChartGen.generateOverviewChart(this) : ChartGen.generateChartPage(this) }</div>
        </div>
      );
    }
    else { return ( <Loader statusText={ status.statusText } /> ); }
  }
}

export default Status;
