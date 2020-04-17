import React, { Component } from 'react';
import * as bungie from "../../requests/BungieReq";
import CBManifest from "./ClanBannerManifest.json";

export class ClanBanners extends Component {

  state = {
    status: { status: "startUp", statusText: "Loading clan banners..." },
    clan_banners: []
  }

  async componentDidMount() { await this.buildBannerTemplates(this.props.current_clan); }
  async buildBannerTemplates(current_clan) {
    let clan_banners = [];
    let clan_ids = current_clan.clans.split(",");
    for(let i in clan_ids) {
      const clan_data = await bungie.GetClanById(clan_ids[i]);
      const clan_banner_info = clan_data.detail.clanInfo.clanBannerData;
      const clan_banner = {
        "clanStaff": { "imagePath": "./images/clan_banner/staves/default.png", },
        "gonfalon": {
          "imagePath": CBManifest.gonfalons[0].foregroundImagePath,
          "color": CBManifest.gonfalonColors.find(e => e.colorHash === clan_banner_info.gonfalonColorId)
        },
        "decal": {
          "foregroundImagePath": CBManifest.decals.find(e => e.imageHash === clan_banner_info.decalId).foregroundImagePath,
          "backgroundImagePath": CBManifest.decals.find(e => e.imageHash === clan_banner_info.decalId).backgroundImagePath,
          "foregroundColor": CBManifest.decalPrimaryColors.find(e => e.colorHash === clan_banner_info.decalColorId),
          "backgroundColor": CBManifest.decalSecondaryColors.find(e => e.colorHash === clan_banner_info.decalBackgroundColorId)
        },
        "detail": {
          "imagePath": CBManifest.gonfalonDetails.find(e => e.imageHash === clan_banner_info.gonfalonDetailId).foregroundImagePath,
          "color": CBManifest.gonfalonDetailColors.find(e => e.colorHash === clan_banner_info.gonfalonDetailColorId)
        }
      }
      clan_banners.push({ clan_id: clan_ids[i], clan_detail: clan_data.detail, clan_banner });
    }
    this.setState({ status: { status: "ready", statusText: "Finished loading clan banners..." }, clan_banners });
    this.buildBanners();
  }
  buildBanners() {
    const { clan_banners } = this.state;
    for(let i in clan_banners) {
      const getColor = (data) => { return `rgba(${ data.red },${ data.green },${ data.blue },${ data.alpha })` };
      const canvasWidth = 280;
      const canvasHeight = 446;
      const staffWidth = 375;
      const staffHeight = 656;

      //Get Canvas
      const canvasGonfalon = document.getElementById(`canvas_gonfalon_${ clan_banners[i].clan_id }`); const ctxGonfalon = canvasGonfalon.getContext('2d');
      const canvasDetail  = document.getElementById(`canvas_detail_${ clan_banners[i].clan_id }`); const ctxDetail = canvasDetail.getContext('2d');
      const canvasDecalFg  = document.getElementById(`canvas_decalFg_${ clan_banners[i].clan_id }`); const ctxDecalFg = canvasDecalFg.getContext('2d');
      const canvasDecalBg  = document.getElementById(`canvas_decalBg_${ clan_banners[i].clan_id }`); const ctxDecalBg = canvasDecalBg.getContext('2d');
      const canvasStaff  = document.getElementById(`canvas_staff_${ clan_banners[i].clan_id }`); const ctxStaff = canvasStaff.getContext('2d');

      const gonfalonCanvas = new Image(canvasWidth, canvasHeight);
      const gonfalonDetailCanvas = new Image(canvasWidth, canvasHeight);
      const gonfalonDecalFgImg = new Image(canvasWidth, canvasHeight);
      const gonfalonDecalBgImg = new Image(canvasWidth, canvasHeight);
      const gonfalonStaff = new Image(staffWidth /2, staffHeight /2);

      gonfalonCanvas.src = clan_banners[i].clan_banner.gonfalon.imagePath;
      gonfalonDetailCanvas.src = clan_banners[i].clan_banner.detail.imagePath;
      gonfalonDecalFgImg.src = clan_banners[i].clan_banner.decal.foregroundImagePath;
      gonfalonDecalBgImg.src = clan_banners[i].clan_banner.decal.backgroundImagePath;
      gonfalonStaff.src = clan_banners[i].clan_banner.clanStaff.imagePath;

      gonfalonCanvas.onload = () => {
        ctxGonfalon.drawImage(gonfalonCanvas, 24, 21, canvasWidth/2, canvasHeight/2);
        ctxGonfalon.globalCompositeOperation = 'source-in';
        ctxGonfalon.fillStyle = getColor(clan_banners[i].clan_banner.gonfalon.color);
        ctxGonfalon.fillRect(0, 0, canvasWidth, canvasHeight);
      };
      gonfalonDetailCanvas.onload = () => {
        ctxDetail.drawImage(gonfalonDetailCanvas, 24, 21, canvasWidth/2, canvasHeight/2);
        ctxDetail.globalCompositeOperation = 'source-in';
        ctxDetail.fillStyle = getColor(clan_banners[i].clan_banner.detail.color);
        ctxDetail.fillRect(0, 0, canvasWidth, canvasHeight);
      };
      gonfalonDecalFgImg.onload = () => {
        ctxDecalFg.drawImage(gonfalonDecalFgImg, 24, 21, canvasWidth/2, canvasHeight/2);
        ctxDecalFg.globalCompositeOperation = 'source-in';
        ctxDecalFg.fillStyle = getColor(clan_banners[i].clan_banner.decal.foregroundColor);
        ctxDecalFg.fillRect(0, 0, canvasWidth, canvasHeight);
      };
      gonfalonDecalBgImg.onload = () => {
        ctxDecalBg.drawImage(gonfalonDecalBgImg, 24, 21, canvasWidth/2, canvasHeight/2);
        ctxDecalBg.globalCompositeOperation = 'source-in';
        ctxDecalBg.fillStyle = getColor(clan_banners[i].clan_banner.decal.backgroundColor);
        ctxDecalBg.fillRect(0, 0, canvasWidth, canvasHeight);
      };
      gonfalonStaff.onload = () => {
        ctxStaff.drawImage(gonfalonStaff, 0, 0, staffWidth/2, staffHeight/2);
        ctxStaff.globalCompositeOperation = 'source-atop';
        ctxStaff.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctxStaff.fillRect(0, 0, 700, 500);
      };
    }
  }

  render() {
    const { clan_banners } = this.state;
    return (
      <div className="clan_banner_container">
        {
          clan_banners.map((clan) => {
            return (
              <div className="clan_banner" title={ clan.clan_detail.name } key={ clan.clan_detail.name }>
                <canvas id={`canvas_gonfalon_${ clan.clan_id }`} width="215" height="375" />
                <canvas id={`canvas_detail_${ clan.clan_id }`} width="215" height="375" />
                <canvas id={`canvas_decalBg_${ clan.clan_id }`} width="215" height="375" />
                <canvas id={`canvas_decalFg_${ clan.clan_id }`} width="215" height="375" />
                <canvas id={`canvas_staff_${ clan.clan_id }`} width="215" height="375" />
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default ClanBanners;
