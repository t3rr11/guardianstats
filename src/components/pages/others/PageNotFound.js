import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return(
    <div className="error-container">
      <p style={{ fontSize: "larger" }}>Uhhh... Page Not Found</p>
      <div className="error-icon" style={{ width: "500px", backgroundImage: 'url("./images/pagenotfound.jpg")' }}></div>
      <div style={{ marginTop: "15px" }}><Link to="/" style={{ marginTop: "40px", color: "white", fontSize: "larger" }}>Go back home...</Link></div>
    </div>
  )
}

export default PageNotFound;
