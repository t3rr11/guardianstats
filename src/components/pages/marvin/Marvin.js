import React, { Component } from 'react';
import { Gallery, GalleryImage } from 'react-gesture-gallery';
import Loader from '../../modules/Loader';
import * as Misc from '../../Misc';

const images = ["1.png", "1_1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png", "13.png"];
var galleryScroller;

export class Marvin extends Component {

  state = {
    index: 0,
    users: 0,
    guilds: 0
  }

  setIndex(i) { this.setState({ index: i }); }
  componentDidMount() {
    document.title = "Marvin - Guardianstats";
    galleryScroller = setInterval(() => { if(this.state.index === images.length - 1) { this.setIndex(0) } else { this.setIndex(this.state.index + 1) }  }, 5000);
    return fetch('https://api.guardianstats.com/GetCurrentStatus', { method: 'GET' }).then((response) => response.json()).then(async (response) => {
      if(response.error === null) { this.setState({ users: response.data[0].users_all, guilds: response.data[0].servers }); }
    })
    .catch((err) => { console.log(err); });
  }
  componentWillUnmount() { clearInterval(galleryScroller); galleryScroller = null; }
  gotoMarvin() { window.open('https://discordapp.com/oauth2/authorize?client_id=631351366799065088&scope=bot&permissions=8', '_blank'); }

  render() {
    const { users, guilds } = this.state;
    return(
      <div className="detailsContainer">
        <div className="howToConnect">
          <div className="connectContainer">
            <h2 style={{ textAlign: "center", margin: "10px", marginBottom: "-20px" }}>Marvin | The Clan Bot</h2>
            <div className="statusLabels">
              <div className="usersStatusLabel">Users: { Misc.numberWithCommas(users) }</div>
              <div className="guildsStatusLabel">Servers: { Misc.numberWithCommas(guilds) }</div>
            </div>
            <div className="animatedLogo"><Loader custom={{ loader: "logo", height: "200px", width: "200px" }} /></div>
            <div className="marvinBtn"><button className="btn btn-primary" onClick={ (() => this.gotoMarvin()) }>Invite</button></div>
          </div>
          <div className="paraContainer">
            <p className="para">To invite marvin to your server use the button above. Follow the discord prompts and he will be there!</p>
            <p className="para">Now to get Marvin to track your clan. When he joins first register yourself so Marvin knows who you are and what clan you are in using this command: <span className="d_highlight">~register example</span>.</p>
            <p className="para">Once registered use this command: <span className="d_highlight">~add clan</span> this will add your clan to list to be scanned. Wait 3 minutes and boom he will be able to give your clan stats!</p>
            <p className="para">You can try some of the commands from the help menu using: <span className="d_highlight">~help</span> Enjoy!</p>
          </div>
        </div>
        <div className="features">
          <div>
            <h3 style={{ textAlign: "center", margin: "10px" }}>Features</h3>
            <div className="marvinsDisplayImages">
              <Gallery index={this.state.index} onRequestChange={i => { this.setIndex(i) }} enableControls={ false } enableIndicators={ false }>
                { images.map(image => ( <GalleryImage objectFit="contain" src={`/images/marvin/${image}`} /> )) }
              </Gallery>
            </div>
          </div>
          <div className="paraContainer">
            <p className="para">Marvin's purpose is to help your clan grow. He creates scoreboards and broadcasts clan achievements like hitting legend and those moments of luck where someone gets a raid exotic!</p>
            <p className="para">He can be useful for many reasons, if you are a clan owner and you feel like your clan needs a bit of spark adding Marvin can help increase the total active time your clan plays as it helps promote healthy competition and more chatter between clan memebers when someone gets something unique.</p>
            <p className="para">If people see that they are a few kills behind Rank 1 in the clan for a specific ranking, they might play more to get Rank 1 and keep that Rank 1 position!</p>
            <p className="para">Marvin is a great bot to have just to see who your most active members are, if you use the <span className="d_highlight">~glory</span> command for example you might find people who you were not aware pvp'd much in your clan, so you could ask them to help you out? Same goes with raids and other activities! Get Marvin today!</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Marvin;
