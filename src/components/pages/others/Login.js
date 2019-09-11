import React, { Component } from 'react';

export class Login extends Component {

  render() {
    return(
      <div className="home-container" style={{ gridTemplateColumns: "auto" }}>
        <div className="home-content" style={{ width: "100%" }}>
          <h1 className="home-title">Who are you?</h1>
          <p className="home-text">Sorry, but in order to view this content you need to have logged in first. You can do so by connecting with bungie.</p>
        </div>
      </div>
    );
  }
}

export default Login;
