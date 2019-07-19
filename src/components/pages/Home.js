import React, { Component } from 'react';
import Search from '../modules/Search';

export class Home extends Component {

  render() {
    return(
      <div className="home-container">
        <h1 className="home-title">Welcome to Guardianstats</h1>
        <p className="home-text">Try out our features by connecting with bungie to see your own personal stats or by searching for a player below!</p>
        <Search />
      </div>
    );
  }
}

export default Home;
