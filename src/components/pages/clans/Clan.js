import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import SmallLoader from '../../modules/SmallLoader';
import * as checks from '../../scripts/Checks';
import * as bungie from '../../requests/BungieReq';
import * as Misc from '../../Misc';

const colours = ["var(--PurpleGradient)", "var(--BlueGradient)", "var(--GreenGradient)"];

export class Clan extends Component {

  state = {
    status: { status: 'startUp', statusText: 'Loading Clan...', error: null },
    clanData: null,
    clanBanner: null
  }
  componentDidMount() {
    document.body.style.backgroundImage = colours[Math.floor(Math.random() * colours.length)];
    this.startUpChecks();
  }
  async startUpChecks() {
    this.setState({ status: { status: 'checkingManifest', statusText: 'Checking Manifest...' } });
    if(await checks.checkManifestMounted()) {
      if(localStorage.getItem("SelectedAccount") !== "Please Select Platform") { this.getClanData(); }
      else { this.setState({ status: { status: 'error', statusText: 'Please select a platform first.' } }); }
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }
  async getClanData() {
    this.setState({ status: { status: 'loadingClanInfo', statusText: 'Loading Clan...' } });

    //Clan Info
    const accountInfo = JSON.parse(localStorage.getItem("SelectedAccount"));
    const clanData = await bungie.GetClan(Misc.getPlatformType(accountInfo.platform), accountInfo.id);
    const clanBannerInfo = clanData.results[0].group.clanInfo.clanBannerData;
    const clanBannerManifest = require("./ClanBanner.json");

    //Clan Banner
    const clanBanner = {
      "clanStaff": {
        "imagePath": "./images/clan_banner/staves/default.png",
      },
      "gonfalon": {
        "imagePath": clanBannerManifest.gonfalons[0].foregroundImagePath,
        "color": clanBannerManifest.gonfalonColors.find(e => e.colorHash === clanBannerInfo.gonfalonColorId)
      },
      "decal": {
        "foregroundImagePath": clanBannerManifest.decals.find(e => e.imageHash === clanBannerInfo.decalId).foregroundImagePath,
        "backgroundImagePath": clanBannerManifest.decals.find(e => e.imageHash === clanBannerInfo.decalId).backgroundImagePath,
        "foregroundColor": clanBannerManifest.decalPrimaryColors.find(e => e.colorHash === clanBannerInfo.decalColorId),
        "backgroundColor": clanBannerManifest.decalSecondaryColors.find(e => e.colorHash === clanBannerInfo.decalBackgroundColorId)
      },
      "detail": {
        "imagePath": clanBannerManifest.gonfalonDetails.find(e => e.imageHash === clanBannerInfo.gonfalonDetailId).foregroundImagePath,
        "color": clanBannerManifest.gonfalonDetailColors.find(e => e.colorHash === clanBannerInfo.gonfalonDetailColorId)
      }
    }
    this.setState({
      clanData: clanData.results[0].group,
      clanBanner: clanBanner
    });
    this.finishedLoading();
    this.buildClanBanner();
  }
  buildClanBanner() {
    //Set Variables
    const getColor = (data) => { return `rgba(${ data.red },${ data.green },${ data.blue },${ data.alpha })`; };
    const clanBanner = this.state.clanBanner;
    const canvasWidth = 400;
    const canvasHeight = 600;

    //Get Canvas
    const canvas = this.refs.canvas;
    var ctxFinal = canvas.getContext('2d');

    //Create Canvas
    var gonfalonCanvas = document.createElement('canvas'); gonfalonCanvas.height = canvasHeight; gonfalonCanvas.width = canvasWidth;
    var gonfalonDetailCanvas = document.createElement('canvas'); gonfalonDetailCanvas.height = canvasHeight; gonfalonDetailCanvas.width = canvasWidth;
    var gonfalonDecalFgCanvas = document.createElement('canvas'); gonfalonDecalFgCanvas.height = canvasHeight; gonfalonDecalFgCanvas.width = canvasWidth;
    var gonfalonDecalBgCanvas = document.createElement('canvas'); gonfalonDecalBgCanvas.height = canvasHeight; gonfalonDecalBgCanvas.width = canvasWidth;
    var gonfalonCombinedCanvas = document.createElement('canvas'); gonfalonCombinedCanvas.height = canvasHeight; gonfalonCombinedCanvas.width = canvasWidth;

    var ctxGonfalon = gonfalonCanvas.getContext('2d');
    var ctxGonfalonDetail = gonfalonDetailCanvas.getContext('2d');
    var ctxGonfalonDecalFg = gonfalonDecalFgCanvas.getContext('2d');
    var ctxGonfalonDecalBg = gonfalonDecalBgCanvas.getContext('2d');
    var ctxGonfalonCombined = gonfalonCombinedCanvas.getContext('2d');

    var gonfalonImg = new Image(); gonfalonImg.src = clanBanner.gonfalon.imagePath;
    var gonfalonDetailImg = new Image(); gonfalonDetailImg.src = clanBanner.detail.imagePath;
    var gonfalonDecalFgImg = new Image(); gonfalonDecalFgImg.src = clanBanner.decal.foregroundImagePath;
    var gonfalonDecalBgImg = new Image(); gonfalonDecalBgImg.src = clanBanner.decal.backgroundImagePath;

    //Draw Canvas
    ctxGonfalon.drawImage(gonfalonImg, 0, 0, canvasWidth, canvasHeight);
    ctxGonfalon.globalCompositeOperation = 'source-in';
    ctxGonfalon.fillStyle = getColor(clanBanner.gonfalon.color);
    ctxGonfalon.fillRect(0, 0, canvasWidth, canvasHeight);

    ctxGonfalonDetail.drawImage(gonfalonDetailImg, 0, 0, canvasWidth, canvasHeight);
    ctxGonfalonDetail.globalCompositeOperation = 'source-in';
    ctxGonfalonDetail.fillStyle = getColor(clanBanner.detail.color);
    ctxGonfalonDetail.fillRect(0, 0, canvasWidth, canvasHeight);

    ctxGonfalonDecalFg.drawImage(gonfalonDecalFgImg, 0, 0, canvasWidth, canvasHeight);
    ctxGonfalonDecalFg.globalCompositeOperation = 'source-in';
    ctxGonfalonDecalFg.fillStyle = getColor(clanBanner.decal.foregroundColor);
    ctxGonfalonDecalFg.fillRect(0, 0, canvasWidth, canvasHeight);

    ctxGonfalonDecalBg.drawImage(gonfalonDecalBgImg, 0, 0, canvasWidth, canvasHeight);
    ctxGonfalonDecalBg.globalCompositeOperation = 'source-in';
    ctxGonfalonDecalBg.fillStyle = getColor(clanBanner.decal.backgroundColor);
    ctxGonfalonDecalBg.fillRect(0, 0, canvasWidth, canvasHeight);

    ctxGonfalonCombined.drawImage(gonfalonCanvas, 0, 0, canvasWidth, canvasHeight);
    ctxGonfalonCombined.globalCompositeOperation = 'source-atop';
    ctxGonfalonCombined.drawImage(gonfalonDetailCanvas, 0, 0, canvasWidth, canvasHeight);
    ctxGonfalonCombined.drawImage(gonfalonDecalFgCanvas, 0, 0, canvasWidth, canvasHeight);
    ctxGonfalonCombined.drawImage(gonfalonDecalBgCanvas, 0, 0, canvasWidth, canvasHeight);

    //Set Canvas
    ctxFinal.drawImage(gonfalonCombinedCanvas, 0, 0, canvasWidth, canvasHeight);
    ctxFinal.fillText("Finished Loading Clan Banner", 100, 100);
    console.log("Built Banner");
  }
  finishedLoading() { this.setState({ status: { status: 'ready', statusText: 'Finished Loading...', error: null } }); }

  render() {
    var { status, clanData, clanBanner } = this.state;

    return(
      <div className="clanPage">
        <div>
          <h1>Clan Banner / Info</h1>
          <div className="clanBanner">
            <canvas ref="canvas" width="400" height="600" />
          </div>
        </div>
        <div>
          <h1>Clan Content / Stats</h1>
          <div className="clanStats">Clan Stats</div>
        </div>
      </div>
    );
  }
}

export default Clan;
