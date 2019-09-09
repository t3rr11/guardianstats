import React, { Component } from 'react';
import Lottie from 'react-lottie';
import abilityLoader from '../loaders/abilityLoader.json';
import classLoader from '../loaders/classLoader.json';

const abilityLoaderOptions = { loop: true, autoplay: true, animationData: abilityLoader, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };
const classLoaderOptions = { loop: true, autoplay: true, animationData: classLoader, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };

export class Loader extends Component {

  render() {
    if(this.props.paused) {
      return (
        <div className="loaderBG">
          <img style={{ margin: "auto" }} src="./images/loader.png" />
          <div className="loaderText">
            <p> { this.props.statusText } </p>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="loaderBG">
          <Lottie options={ classLoaderOptions } height={250} width={250} isStopped={false} isPaused={false} />
          <div className="loaderText">
            <p> { this.props.statusText } </p>
          </div>
        </div>
      );
    }
  }
}

export default Loader;
