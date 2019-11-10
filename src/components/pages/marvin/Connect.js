import React, { Component } from 'react';
import { Gallery, GalleryImage } from 'react-gesture-gallery';

const images = ["/images/marvin/logo.png", "/images/marvin/test1.png", "/images/marvin/test2.png"];
var galleryScroller = null;

export class Connect extends Component {

  state = {
    index: 0
  }

  setIndex(i) { this.setState({ index: i }); }
  componentDidMount() { galleryScroller = setInterval(() => { if(this.state.index === images.length - 1) { this.setIndex(0) } else { this.setIndex(this.state.index + 1) }  }, 5000); }
  componentWillUnmount() { clearInterval(galleryScroller); galleryScroller = null; }

  render() {
    return(
      <div className="connect-container">
        <h2 style={{ textAlign: "center", margin: "10px" }}>Marvin</h2>
        <div style={{ width: "500px", height: "335px", margin: "auto" }}>
          <Gallery index={this.state.index} onRequestChange={i => { this.setIndex(i) }} enableControls={ false } enableIndicators={ false }>
            { images.map(image => ( <GalleryImage objectFit="contain" src={image} /> )) }
          </Gallery>
        </div>
      </div>
    );
  }
}

export default Connect;
