import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import * as Misc from '../../Misc';
import * as ChartGen from './ChartGen';

var updateTimer;
var updated = false;

export class Status extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Checking status...' },
    currentChart: 'overview',
    chartTimeframe: null,
    charts: null,
    logs: null,
    stats: null
  }

  async componentDidMount() {
    document.title = "Status - Guardianstats";
    await this.buildCharts();
  }
  componentWillUnmount() {  }
  async loadTimeFrame() {
    if(localStorage.getItem("currentChart")) { this.setState({ currentChart: localStorage.getItem("currentChart") }); }
    if(localStorage.getItem("chartTimeframe")) { await this.setState({ chartTimeframe: localStorage.getItem("chartTimeframe") }); }
    else {
      await localStorage.setItem("chartTimeframe", "minute");
      await this.setState({ chartTimeframe: "minute" });
    }
  }
  async buildCharts() {
    let currentChart = 'overview'; if(localStorage.getItem("currentChart")) { currentChart = localStorage.getItem("currentChart") }
    const { charts, logs, stats } = await ChartGen.buildDataSet();
    this.setState({ status: { status: 'ready', statusText: 'Finished loading...' }, currentChart, charts, logs, stats });
  }
  setChart(chart) {
    localStorage.setItem("currentChart", chart);
    this.setState({ currentChart: chart });
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
