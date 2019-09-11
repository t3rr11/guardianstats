import React from 'react';
import { Link } from 'react-router-dom';

function Thanks() {
  return(
    <div className="home-container" style={{ gridTemplateColumns: "auto" }}>
      <div className="home-content" style={{ width: "100%" }}>
        <h1 className="home-title">Thanks!</h1>
        <p className="home-text">Seriously, Thank you so damn much for the donation. You really help me keep this project alive and i am so very grateful to you for that! Keep slaying Guardian!</p>
        <img src="/images/thanks.gif" width="500px" height="375px" />
      </div>
    </div>
  )
}

export default Thanks;
