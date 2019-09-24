import React from 'react';

function Thanks() {
  return(
    <div className="home-container" style={{ gridTemplateColumns: "auto" }}>
      <div className="home-content" style={{ width: "100%" }}>
        <h1 className="home-title">Thanks!</h1>
        <p className="home-text">Seriously, Thank you so damn much for the donation. You really help me keep this project alive and i am so very grateful to you for that! Keep slaying Guardian!</p>
        <img src="/images/thanks.gif" alt="thanks" width="500px" height="375px" />
        <p className="home-text" style={{ marginTop: "10px" }}>If its more than $5 message me on discord (Terrii#5799) and i'll get you added to the donar list. </p>
      </div>
    </div>
  )
}

export default Thanks;
