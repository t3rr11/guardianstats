import React, { Component } from 'react';

export class Login extends Component {

  render() {
    document.title = "Please Login - Guardianstats";
    document.body.style.backgroundImage = "var(--DarkNavyBlue)";
    return(
      <div className="home-container" style={{ gridTemplateColumns: "auto" }}>
        <div className="home-content" style={{ width: "550px", margin: "auto" }}>
          <h1 className="home-title">Who are you?</h1>
          <p className="home-text">Sorry, but in order to view this content you need to have logged in first. You can do so by connecting with bungie.</p>
        </div>
      </div>
    );
  }
}

export default Login;
