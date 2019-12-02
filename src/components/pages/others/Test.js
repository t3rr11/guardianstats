import React, { Component } from 'react';
import Loader from '../../modules/Loader';

export class Test extends Component {

  state = {
    decals: null
  }

  async componentDidMount() {
    var decals = await require("./jsons/GonfalonSquareDetails.json");
    this.setState({ decals: decals });
  }

  render() {
    document.body.style.backgroundImage = "var(--DarkNavyBlue)";

    var { decals } = this.state;

    if(decals !== null) {
      return(
        <div id="images">
        {
          decals.map(e => {
            return (
              <div style={{ display: "inline-grid" }}>
                <div style={{ display: "inline-grid" }}>
                  <img src={ `https://bungie.net/${ JSON.parse(e.json).foregroundImagePath }` } />
                </div>
              </div>
            )
          })
        }
        </div>
      );
    }
    else { return(<Loader />) }
  }
}

export default Test;
