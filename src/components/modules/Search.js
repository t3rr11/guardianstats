import React, { Component } from 'react';

export class Search extends Component {

  render() {
    return(
      <div className="search-container">
        <div className="search-input">
          <select name="membership-type" id="membership-type" type="dropdown" className="input-group-text disable-hl custom" placeholder="BNET" data-lpignore="true" style={{ backgroundImage: 'url("../images/icons/caret.png")', backgroundSize: '150px, 200px' }}>
            <option value="BNET">BNET</option>
            <option value="PSN">PSN</option>
            <option value="XBL">XBL</option>
            <option value="Stadia">Stadia</option>
            <option value="Steam">Steam</option>
          </select>
          <input id="username" type="text" className="form-control" placeholder="Username..." aria-label="Username..." data-lpignore="true" />
        </div>
      </div>
    );
  }
}

export default Search;
