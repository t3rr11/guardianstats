import React, { Component } from 'react';
import Lottie from 'react-lottie';
import abilityLoader from '../loaders/abilityLoader.json';
import classLoader from '../loaders/classLoader.json';

const abilityLoaderOptions = { loop: true, autoplay: true, animationData: abilityLoader, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };
const classLoaderOptions = { loop: true, autoplay: true, animationData: classLoader, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };

export class Loader extends Component {

  render() {
    var loader = "class";
    if(localStorage.getItem("Settings")) {
      loader = JSON.parse(localStorage.getItem("Settings")).loader;
    }
    if(this.props.custom) {
      if(this.props.custom.loader === "class") { return (<Lottie options={ classLoaderOptions } height={this.props.custom.height} width={this.props.custom.width} isStopped={false} isPaused={false} />) }
      else if(this.props.custom.loader === "ability") { return (<Lottie options={ abilityLoaderOptions } height={this.props.custom.height} width={this.props.custom.width} isStopped={false} isPaused={false} />) }
    }
    else {
      if(loader === "class") {
        return (
          <div className="smallLoaderBG">
            <Lottie options={ classLoaderOptions } height={70} width={50} isStopped={false} isPaused={false} />
            <div className="smallLoaderText">
              <p> { this.props.statusText } </p>
            </div>
          </div>
        );
      }
      else if(loader === "ability") {
        return (
          <div className="smallLoaderBG">
            <Lottie options={ abilityLoaderOptions } height={70} width={50} isStopped={false} isPaused={false} />
            <div className="smallLoaderText">
              <p> { this.props.statusText } </p>
            </div>
          </div>
        );
      }
    }
  }
}

export default Loader;
