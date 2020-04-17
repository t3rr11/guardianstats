import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

export class DashboardSettings extends Component {

  state = {
    status: { status: "startUp", statusText: "Loading Settings..." },
    current_clan: null,
    current_discord: null
  }

  componentDidMount() {
    const { current_clan, current_discord } = this.props;
    this.setState({ status: { status: "ready", statusText: "Finished Loading Settings..." }, current_clan, current_discord });
  }

  render() {
    const { status, current_clan, current_discord } = this.state;
    if(status.status === "ready") {
      return (
        <div className="marvin_clan_settings">
          <div>
            <label className="customCheck">Enable whitelist
              <input type="checkbox" id="enable_whitelist" onChange={ (e) => this.props.toggleChecked(e) } checked={ JSON.parse(current_clan.enable_whitelist) } />
              <span className="checkmark"></span>
            </label>
            <label className="customCheck">Enable item broadcasts
              <input type="checkbox" id="enable_broadcasts_items" onChange={ (e) => this.props.toggleChecked(e) } checked={ JSON.parse(current_clan.enable_broadcasts_items) } />
              <span className="checkmark"></span>
            </label>
            <label className="customCheck">Enable title broadcasts
              <input type="checkbox" id="enable_broadcasts_titles" onChange={ (e) => this.props.toggleChecked(e) } checked={ JSON.parse(current_clan.enable_broadcasts_titles) } />
              <span className="checkmark"></span>
            </label>
            <label className="customCheck">Enable clan broadcasts
              <input type="checkbox" id="enable_broadcasts_clans" onChange={ (e) => this.props.toggleChecked(e) } checked={ JSON.parse(current_clan.enable_broadcasts_clans) } />
              <span className="checkmark"></span>
            </label>
            <label className="customCheck">Enable dungeon broadcasts
              <input type="checkbox" id="enable_broadcasts_dungeons" onChange={ (e) => this.props.toggleChecked(e) } checked={ JSON.parse(current_clan.enable_broadcasts_dungeons) } />
              <span className="checkmark"></span>
            </label>
            <label className="customCheck">Enable catalyst broadcasts
              <input type="checkbox" id="enable_broadcasts_catalysts" onChange={ (e) => this.props.toggleChecked(e) } checked={ JSON.parse(current_clan.enable_broadcasts_catalysts) } />
              <span className="checkmark"></span>
            </label>
            <div className="btn btn-primary" onClick={ (() => this.props.saveServerDetails(current_clan)) }>Save</div>
            <div id="saved_successfully_alert">Saved!</div>
          </div>
          {
            JSON.parse(current_clan.enable_whitelist) ?
            (<div id="whitelist"><span>Tracked Items</span><div>{ current_clan.whitelist.split(",").map((item) => { if(item !== "") { return(<div key={ item }>{ item }</div>) } }) }</div></div>):
            ( current_clan.blacklist.length > 1 ?
              (<div id="blacklist"><span>Ignored Items</span><div>{ current_clan.blacklist.split(",").map((item) => { if(item !== "") { return <div key={ item }>{ item }</div> } }) }</div></div>):
              (<div id="blacklist"><span>There are no blacklisted items.</span><div>{ current_clan.blacklist.split(",").map((item) => { if(item !== "") { return <div key={ item }>{ item }</div> } }) }</div></div>)
            )
          }
        </div>
      )
    }
    else { return <Loader statusText={ status.statusText } /> }
  }
}

export default DashboardSettings;
