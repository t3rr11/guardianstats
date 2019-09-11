import React, { Component } from 'react';
import Loader from './Loader';

export class Error extends Component {

  state = {
    loader: null
  }

  hideSettingsModal = () => { this.props.hideSettings(); }
  setLoader = (loader) => {
    localStorage.setItem("loader", loader);
    this.setState({ loader });
  }

  componentDidMount() {
    this.setState({ loader: localStorage.getItem("loader") });
  }

  render() {
    return(
      <div className="settings-bg">
        <div className="settings-modal">
          <div className="settings-closeBtn" onClick={ (() => this.hideSettingsModal()) }>X</div>
          <p className="settings-title">Settings</p>
          <div className="select-custom-loader">
            <p>Select Custom Loader</p>
            <div className="settings-loader-options">
              <div className={ `settings-loader-option ${ this.state.loader === "ability" ? "selected" : null }` } onClick={ (() => this.setLoader("ability")) }>{ <Loader custom={{ loader: "ability", height: "100px", width: "100px" }} /> }</div>
              <div className={ `settings-loader-option ${ this.state.loader === "class" ? "selected" : null }` } onClick={ (() => this.setLoader("class")) }>{ <Loader custom={{ loader: "class", height: "100px", width: "100px" }} /> }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Error;
