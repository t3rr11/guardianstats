import React, { Component } from 'react';
import Lottie from 'react-lottie';
import abilityLoader from '../loaders/abilityLoader.json';
import classLoader from '../loaders/classLoader.json';

const abilityLoaderOptions = { loop: true, autoplay: true, animationData: abilityLoader, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };
const classLoaderOptions = { loop: true, autoplay: true, animationData: classLoader, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };

export class Loader extends Component {

  state = {
    newLoader: true
  }

  render() {
    if(this.state.newLoader) {
      return (
        <div className="loaderBG">
          <Lottie options={ classLoaderOptions } height={400} width={400} isStopped={false} isPaused={false} />
          <div className="loaderText">
            <p> { this.props.statusText } </p>
          </div>
        </div>
      );
    }
    else {
      return(
        <div className="loaderContainer">
          <div className='loader'>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="loaderText">
            <p> { this.props.statusText } </p>
          </div>
        </div>
      );
    }
  }
}

export default Loader;
