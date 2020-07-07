import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import * as Misc from '../../Misc';
import * as ChartGen from './GenerateChart';

let graphUpdateTimer = null;
let statusUpdateTimer = null;
let updatingGraphs = false;
let updatingStatus = false;

export class Status extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Checking status...' },
    currentChart: 'overview',
    charts: null,
    stats: null,
    last_update: 0
  }

  async componentDidMount() {
    document.title = "Status - Guardianstats";
    await this.buildCharts();
    await this.buildStatus();
    this.setState({ status: { status: 'ready', statusText: 'Finished loading...' } });
  }
  async componentWillUnmount() {
    clearInterval(graphUpdateTimer);
    clearInterval(statusUpdateTimer);
    graphUpdateTimer = null;
    statusUpdateTimer = null;
  }
  async buildCharts() {
    let currentChart = 'overview'; if(localStorage.getItem("currentChart")) { currentChart = localStorage.getItem("currentChart") }
    const { charts, last_update } = await ChartGen.buildGraphDataSet();
    this.setState({ currentChart, charts, last_update });
    this.startTimer("graph");
  }
  async buildStatus() {
    const stats = await ChartGen.GetStatus();
    this.setState({ stats });
    this.startTimer("status");
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
  startTimer(timer) {
    if(timer === "graph") {
      if(graphUpdateTimer === null) {
        graphUpdateTimer = setInterval((e) => {
          if(new Date().getTime() - (this.state.last_update + 605000) > 0 && !updatingGraphs) {
            this.updateGraphs();
          }
        }, 1000);
      }
    }
    else if(timer === "status") {
      if(statusUpdateTimer === null) {
        statusUpdateTimer = setInterval((e) => {
          if(!updatingStatus) {
            this.updateStatus();
          }
        }, 60000);
      }
    }
  }
  async updateGraphs() {
    updatingGraphs = true;
    const { charts, last_update } = await ChartGen.buildGraphDataSet();
    this.setState({ charts, last_update });
    console.log(new Date().toLocaleString() + ": Updated Graphs");
    updatingGraphs = false;
  }
  async updateStatus() {
    updatingStatus = true;
    const stats = await ChartGen.GetStatus();
    if(!stats.error) { this.setState({ stats }); console.log(new Date().toLocaleString() + ": Updated Status"); }
    updatingStatus = false;
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
