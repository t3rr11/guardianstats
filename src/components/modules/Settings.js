import React, { Component } from 'react';
import Loader from './Loader';
import * as Checks from '../scripts/Checks';

export class Settings extends Component {

  state = {
    loader: null,
    background: null,
    hiddenSeals: null
  }

  hideSettingsModal = () => { this.props.hideSettings(); }
  setLoader = async (loader) => {
    await this.setState({ loader });
    this.setAllSettings();
  }
  setBackground = async (background) => {
    await this.setState({ background });
    this.setAllSettings();
  }
  setHiddenSeals = async (hiddenSeals) => {
    await this.setState({ hiddenSeals });
    this.setAllSettings();
  }
  setAllSettings() {
    localStorage.setItem("Settings", `{
      "loader": "${ this.state.loader }",
      "background": "${ this.state.background }"
    }`);
    this.props.updateSettings();
  }

  componentDidMount() {
    if(!Checks.checkSettingsExist()) { setDefaultSettings(); }
    const Settings = JSON.parse(localStorage.getItem("Settings"));
    this.setState({
      loader: Settings.loader,
      background: Settings.background,
    });
    const SettingsKeys = Object.keys(Settings);
    const StateKeys = Object.keys(this.state);
    const UnsetSettings = StateKeys.filter((setting) => !SettingsKeys.includes(setting));
    if(UnsetSettings !== "") {
      for(var i in UnsetSettings) {
        if(UnsetSettings[i] === "loader") { this.setLoader("class"); }
        else if(UnsetSettings[i] === "background") { this.setBackground("default"); }
      }
    }
  }

  render() {
    return(
      <div className="settings-bg">
        <div className="settings-modal">
          <div className="settings-closeBtn" onClick={ (() => this.hideSettingsModal()) }>X</div>
          <p className="settings-title">Settings</p>
          <div className="settings-content">
            <div className="select-custom-loader">
              <p>Select Custom Loader</p>
              <div className="settings-loader-options">
                <div className={ `settings-loader-option ${ this.state.loader === "ability" ? "selected" : null }` } onClick={ (() => this.setLoader("ability")) }>{ <Loader custom={{ loader: "ability", height: "100px", width: "100px" }} /> }</div>
                <div className={ `settings-loader-option ${ this.state.loader === "class" ? "selected" : null }` } onClick={ (() => this.setLoader("class")) }>{ <Loader custom={{ loader: "class", height: "100px", width: "100px" }} /> }</div>
              </div>
            </div>
            <div className="select-custom-background">
              <p>Select Custom Background</p>
              <div className="settings-background-options">
                <div className={ `settings-background-option ${ this.state.background === "worthy" ? "selected" : null }` } onClick={ (() => this.setBackground("worthy")) }>
                  <img className="settings-background-image" src="/images/backgrounds/worthy.jpg" alt="background" />
                </div>
                <div className={ `settings-background-option ${ this.state.background === "keep" ? "selected" : null }` } onClick={ (() => this.setBackground("keep")) }>
                  <img className="settings-background-image" src="/images/backgrounds/keep.jpg" alt="background" />
                </div>
                <div className={ `settings-background-option ${ this.state.background === "shadowkeep" ? "selected" : null }` } onClick={ (() => this.setBackground("shadowkeep")) }>
                  <img className="settings-background-image" src="/images/backgrounds/shadowkeep.jpg" alt="background" />
                </div>
                <div className={ `settings-background-option ${ this.state.background === "vexlair" ? "selected" : null }` } onClick={ (() => this.setBackground("vexlair")) }>
                  <img className="settings-background-image" src="/images/backgrounds/vexlair.jpg" alt="background" />
                </div>
                <div className={ `settings-background-option ${ this.state.background === "vextree" ? "selected" : null }` } onClick={ (() => this.setBackground("vextree")) }>
                  <img className="settings-background-image" src="/images/backgrounds/vextree.jpg" alt="background" />
                </div>
                <div className={ `settings-background-option ${ this.state.background === "classes" ? "selected" : null }` } onClick={ (() => this.setBackground("classes")) }>
                  <img className="settings-background-image" src="/images/backgrounds/classes.jpg" alt="background" />
                </div>
                <div className={ `settings-background-option ${ this.state.background === "classes2" ? "selected" : null }` } onClick={ (() => this.setBackground("classes2")) }>
                  <img className="settings-background-image" src="/images/backgrounds/classes2.jpg" alt="background" />
                </div>
                <div className={ `settings-background-option ${ this.state.background === "saint14" ? "selected" : null }` } onClick={ (() => this.setBackground("saint14")) }>
                  <img className="settings-background-image" src="/images/backgrounds/saint14.jpg" alt="background" />
                </div>
              </div>
            </div>
            <div id="refresh-update-text">Refresh to update</div>
          </div>
        </div>
      </div>
    );
  }
}

export function setDefaultSettings() { localStorage.setItem("Settings", `{"loader":"class","background":"default"}`); }

export default Settings;
