import SmallLoader from '../../modules/SmallLoader';
import * as checks from '../../scripts/Checks';
import * as bungie from '../../requests/BungieReq';
import * as Misc from '../../Misc';
import CBManifest from "./ClanBannerManifest.json";

export async function BuildClanBanners(groupIds) {
  var clanBanners = [];
  for(var i in groupIds) {
    const clanData = await bungie.GetClanById(groupIds[i]);
    const clanBannerInfo = clanData.detail.clanInfo.clanBannerData;
    const clanBanner = {
      "clanStaff": { "imagePath": "./images/clan_banner/staves/default.png", },
      "gonfalon": {
        "imagePath": CBManifest.gonfalons[0].foregroundImagePath,
        "color": CBManifest.gonfalonColors.find(e => e.colorHash === clanBannerInfo.gonfalonColorId)
      },
      "decal": {
        "foregroundImagePath": CBManifest.decals.find(e => e.imageHash === clanBannerInfo.decalId).foregroundImagePath,
        "backgroundImagePath": CBManifest.decals.find(e => e.imageHash === clanBannerInfo.decalId).backgroundImagePath,
        "foregroundColor": CBManifest.decalPrimaryColors.find(e => e.colorHash === clanBannerInfo.decalColorId),
        "backgroundColor": CBManifest.decalSecondaryColors.find(e => e.colorHash === clanBannerInfo.decalBackgroundColorId)
      },
      "detail": {
        "imagePath": CBManifest.gonfalonDetails.find(e => e.imageHash === clanBannerInfo.gonfalonDetailId).foregroundImagePath,
        "color": CBManifest.gonfalonDetailColors.find(e => e.colorHash === clanBannerInfo.gonfalonDetailColorId)
      }
    }
    clanBanners.push({ groupId: groupIds[i], clanDetail: clanData.detail, clanBanner });
  }
  return clanBanners;
}

export async function BuildClanBanner(groupId, clanBannerInfo) {
  //Set Variables
  const clanBanner = clanBannerInfo.find(e => e.groupId === groupId);
  const getColor = (data) => { return `rgba(${ data.red },${ data.green },${ data.blue },${ data.alpha })`; };
  const canvasWidth = 280;
  const canvasHeight = 446;
  const staffWidth = 375;
  const staffHeight = 656;

  console.log(clanBanner);

  //Get Canvas
  const canvasGonfalon = document.getElementById(`canvasGonfalon_${ groupId }`); const ctxGonfalon = canvasGonfalon.getContext('2d');
  const canvasDetail  = document.getElementById(`canvasDetail_${ groupId }`); const ctxDetail = canvasDetail.getContext('2d');
  const canvasDecalFg  = document.getElementById(`canvasDecalFg_${ groupId }`); const ctxDecalFg = canvasDecalFg.getContext('2d');
  const canvasDecalBg  = document.getElementById(`canvasDecalBg_${ groupId }`); const ctxDecalBg = canvasDecalBg.getContext('2d');
  const canvasStaff  = document.getElementById(`canvasStaff_${ groupId }`); const ctxStaff = canvasStaff.getContext('2d');

  const gonfalonCanvas = new Image(canvasWidth, canvasHeight);
  const gonfalonDetailCanvas = new Image(canvasWidth, canvasHeight);
  const gonfalonDecalFgImg = new Image(canvasWidth, canvasHeight);
  const gonfalonDecalBgImg = new Image(canvasWidth, canvasHeight);
  const gonfalonStaff = new Image(staffWidth /2, staffHeight /2);

  gonfalonCanvas.src = clanBanner.clanBanner.gonfalon.imagePath;
  gonfalonDetailCanvas.src = clanBanner.clanBanner.detail.imagePath;
  gonfalonDecalFgImg.src = clanBanner.clanBanner.decal.foregroundImagePath;
  gonfalonDecalBgImg.src = clanBanner.clanBanner.decal.backgroundImagePath;
  gonfalonStaff.src = clanBanner.clanBanner.clanStaff.imagePath;

  gonfalonCanvas.onload = () => {
    ctxGonfalon.drawImage(gonfalonCanvas, 24, 21, canvasWidth/2, canvasHeight/2);
    ctxGonfalon.globalCompositeOperation = 'source-in';
    ctxGonfalon.fillStyle = getColor(clanBanner.clanBanner.gonfalon.color);
    ctxGonfalon.fillRect(0, 0, canvasWidth, canvasHeight);
  };
  gonfalonDetailCanvas.onload = () => {
    ctxDetail.drawImage(gonfalonDetailCanvas, 24, 21, canvasWidth/2, canvasHeight/2);
    ctxDetail.globalCompositeOperation = 'source-in';
    ctxDetail.fillStyle = getColor(clanBanner.clanBanner.detail.color);
    ctxDetail.fillRect(0, 0, canvasWidth, canvasHeight);
  };
  gonfalonDecalFgImg.onload = () => {
    ctxDecalFg.drawImage(gonfalonDecalFgImg, 24, 21, canvasWidth/2, canvasHeight/2);
    ctxDecalFg.globalCompositeOperation = 'source-in';
    ctxDecalFg.fillStyle = getColor(clanBanner.clanBanner.decal.foregroundColor);
    ctxDecalFg.fillRect(0, 0, canvasWidth, canvasHeight);
  };
  gonfalonDecalBgImg.onload = () => {
    ctxDecalBg.drawImage(gonfalonDecalBgImg, 24, 21, canvasWidth/2, canvasHeight/2);
    ctxDecalBg.globalCompositeOperation = 'source-in';
    ctxDecalBg.fillStyle = getColor(clanBanner.clanBanner.decal.backgroundColor);
    ctxDecalBg.fillRect(0, 0, canvasWidth, canvasHeight);
  };
  gonfalonStaff.onload = () => {
    ctxStaff.drawImage(gonfalonStaff, 0, 0, staffWidth/2, staffHeight/2);
    ctxStaff.globalCompositeOperation = 'source-atop';
    ctxStaff.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctxStaff.fillRect(0, 0, 700, 500);
  };
  return "";
}
