import React, { Component } from 'react';
import * as Misc from '../../Misc';
import { AreaSeries, Crosshair, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries } from 'react-vis';

//Generate Charts
export function generateChart(crosshairValues, currentChart, chartTimeframe, charts, parent) {
  return (
    <div>
      <div className="statusDetails">
        <div id="name">{ charts[currentChart].name }</div>
        <div id="min">Low: { Misc.numberWithCommas(charts[currentChart].min) }</div>
        <div id="max">High: { Misc.numberWithCommas(charts[currentChart].max) }</div>
        <div id="curr">Current: { Misc.numberWithCommas(charts[currentChart].last) } { charts[currentChart].last - charts[currentChart].first < 0 ? (<span id="negative">{ charts[currentChart].last - charts[currentChart].first }</span>) : (<span id="positive">+{ charts[currentChart].last - charts[currentChart].first }</span>) }</div>
      </div>
      <XYPlot xType="time" width={ 380 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(currentChart) } yDomain={ parent.getYDomain(charts[currentChart].min, charts[currentChart].max, chartTimeframe) }>
        <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
        <XAxis title="X Axis" />
        <YAxis title="Y Axis" />
        <LineSeries data={ charts[currentChart].data } color="#5cabff" onNearestX={ parent.onNearestX } />
        { crosshairValues[currentChart].visible && <Crosshair values={ crosshairValues[currentChart].data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
      </XYPlot>
    </div>
  )
}
export function generateOverviewChart(crosshairValues, currentChart, chartTimeframe, charts, parent) {
  return (
    Object.keys(charts).map(chart => (
      <div>
        <div className="statusDetails">
          <div id="name">{ charts[chart].name }</div>
          <div id="min">Low: { Misc.numberWithCommas(charts[chart].min) }</div>
          <div id="max">High: { Misc.numberWithCommas(charts[chart].max) }</div>
          <div id="curr">Current: { Misc.numberWithCommas(charts[chart].last) } { charts[chart].last - charts[chart].first < 0 ? (<span id="negative">{ charts[chart].last - charts[chart].first }</span>) : (<span id="positive">+{ charts[chart].last - charts[chart].first }</span>) }</div>
        </div>
        <XYPlot xType="time" width={ 380 } height={ 170 } margin={{ left: 50 }} onMouseLeave={ () => parent.onMouseLeave(chart) } yDomain={ parent.getYDomain(charts[chart].min, charts[chart].max, chartTimeframe) }>
          <HorizontalGridLines style={{ stroke: "#333333", color: "#333333" }} />
          <XAxis title="X Axis" />
          <YAxis title="Y Axis" />
          <LineSeries data={ charts[chart].data } color="#5cabff" onNearestX={ parent.onNearestX } />
          { crosshairValues[chart].visible && <Crosshair values={ crosshairValues[chart].data } titleFormat={ (d) => ({ title: "Date", value: new Date(d[0].x).toLocaleTimeString() }) } itemsFormat={ (d) => [{ title: "Value", value: d[0].y }] } /> }
        </XYPlot>
      </div>
    ))
  )
}


//Make Charts
export function makeCharts() {
  return {
    clans_all: {
      name: "All Clans",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    guilds_all: {
      name: "All Guilds",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    players_all: {
      name: "All Players",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    broadcasts: {
      name: "Broadcasts",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    servers: {
      name: "Discord Servers",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    users_all: {
      name: "Discord Users",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    players_online: {
      name: "Online Players",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    clans_tracked: {
      name: "Tracked Clans",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    guilds_tracked: {
      name: "Tracked Guilds",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    players_tracked: {
      name: "Tracked Players",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    },
    users_tracked: {
      name: "Tracked Users",
      minute_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      hourly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      daily_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null },
      weekly_data: { graph_data: [], crosshair_data: { visible: false, data: false }, min: null, max: null, first: null, last: null }
    }
  }
}
