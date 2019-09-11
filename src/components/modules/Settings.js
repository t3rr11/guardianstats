import React, { Component } from 'react';
import Loader from './Loader';

export class Error extends Component {

  state = {
    loader: null,
    background: null
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
  setAllSettings() {
    localStorage.setItem("Settings", `{
      "loader": "${ this.state.loader }",
      "background": "${ this.state.background }"
    }`);
  }

  componentDidMount() {
    const Settings = JSON.parse(localStorage.getItem("Settings"));
    console.log(Settings);
    this.setState({
      loader: Settings.loader,
      background: Settings.background
    });
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
                <div className={ `settings-background-option ${ this.state.background === "shadowkeep" ? "selected" : null }` } onClick={ (() => this.setBackground("shadowkeep")) }>
                  <img className="settings-background-image" src="/images/backgrounds/shadowkeep.jpg" />
                </div>
                <div className={ `settings-background-option ${ this.state.background === "forsaken" ? "selected" : null }` } onClick={ (() => this.setBackground("forsaken")) }>
                  <img className="settings-background-image" src="/images/backgrounds/forsaken.jpg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Error;
