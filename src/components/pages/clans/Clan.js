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
    clanBanner: null,
    clanPlayerInfo: null
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

    //Clan Player Info
    const clanMembers = await fetch(`./marvin/clans/${ clanData.results[0].group.groupId }/ClanMembers.json`).then(a => a.json());
    const clanAnnouncements = await fetch(`./marvin/clans/${ clanData.results[0].group.groupId }/Announcements.json`).then(a => a.json());
    const clanRankings = await fetch(`./marvin/clans/${ clanData.results[0].group.groupId }/Rankings.json`).then(a => a.json());
    const clanRaids = await fetch(`./marvin/clans/${ clanData.results[0].group.groupId }/Raids.json`).then(a => a.json());
    const clanItems = await fetch(`./marvin/clans/${ clanData.results[0].group.groupId }/Items.json`).then(a => a.json());
    const clanTitles = await fetch(`./marvin/clans/${ clanData.results[0].group.groupId }/Titles.json`).then(a => a.json());
    const clanOthers = await fetch(`./marvin/clans/${ clanData.results[0].group.groupId }/Others.json`).then(a => a.json());

    //Default Sort
    clanMembers.sort((a, b) => b.lastOnlineStatusChange - a.lastOnlineStatusChange).sort((a, b) => b.isOnline - a.isOnline).sort((a, b) => b.memberType - a.memberType);

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
      clanBanner: clanBanner,
      clanPlayerInfo: {
        "ClanMembers": clanMembers,
        "ClanAnnouncements": clanAnnouncements,
        "ClanRankings": clanRankings,
        "ClanRaids": clanRaids,
        "ClanItems": clanItems,
        "ClanTitles": clanTitles,
        "ClanOthers": clanOthers
      }
    });
    this.finishedLoading();
    this.buildClanBanner();
  }
  buildClanBanner() {
    //Set Variables
    this.setState({ status: { status: 'loadingBanner', statusText: 'Loading Banner...', error: null } });
    const getColor = (data) => { return `rgba(${ data.red },${ data.green },${ data.blue },${ data.alpha })`; };
    const clanBanner = this.state.clanBanner;
    const canvasWidth = 280;
    const canvasHeight = 446;
    const staffWidth = 375;
    const staffHeight = 656;

    //Get Canvas
    const canvasGonfalon = this.refs.canvasGonfalon; const ctxGonfalon = canvasGonfalon.getContext('2d');
    const canvasDetail = this.refs.canvasDetail; const ctxDetail = canvasDetail.getContext('2d');
    const canvasDecalFg = this.refs.canvasDecalFg; const ctxDecalFg = canvasDecalFg.getContext('2d');
    const canvasDecalBg = this.refs.canvasDecalBg; const ctxDecalBg = canvasDecalBg.getContext('2d');
    const canvasStaff = this.refs.canvasStaff; const ctxStaff = canvasStaff.getContext('2d');

    const gonfalonCanvas = new Image(canvasWidth, canvasHeight);
    const gonfalonDetailCanvas = new Image(canvasWidth, canvasHeight);
    const gonfalonDecalFgImg = new Image(canvasWidth, canvasHeight);
    const gonfalonDecalBgImg = new Image(canvasWidth, canvasHeight);
    const gonfalonStaff = new Image(staffWidth /2, staffHeight /2);

    gonfalonCanvas.src = clanBanner.gonfalon.imagePath;
    gonfalonDetailCanvas.src = clanBanner.detail.imagePath;
    gonfalonDecalFgImg.src = clanBanner.decal.foregroundImagePath;
    gonfalonDecalBgImg.src = clanBanner.decal.backgroundImagePath;
    gonfalonStaff.src = clanBanner.clanStaff.imagePath;

    gonfalonCanvas.onload = () => {
      ctxGonfalon.drawImage(gonfalonCanvas, 24, 21, canvasWidth/2, canvasHeight/2);
      ctxGonfalon.globalCompositeOperation = 'source-in';
      ctxGonfalon.fillStyle = getColor(clanBanner.gonfalon.color);
      ctxGonfalon.fillRect(0, 0, canvasWidth, canvasHeight);
    };
    gonfalonDetailCanvas.onload = () => {
      ctxDetail.drawImage(gonfalonDetailCanvas, 24, 21, canvasWidth/2, canvasHeight/2);
      ctxDetail.globalCompositeOperation = 'source-in';
      ctxDetail.fillStyle = getColor(clanBanner.detail.color);
      ctxDetail.fillRect(0, 0, canvasWidth, canvasHeight);
    };
    gonfalonDecalFgImg.onload = () => {
      ctxDecalFg.drawImage(gonfalonDecalFgImg, 24, 21, canvasWidth/2, canvasHeight/2);
      ctxDecalFg.globalCompositeOperation = 'source-in';
      ctxDecalFg.fillStyle = getColor(clanBanner.decal.foregroundColor);
      ctxDecalFg.fillRect(0, 0, canvasWidth, canvasHeight);
    };
    gonfalonDecalBgImg.onload = () => {
      ctxDecalBg.drawImage(gonfalonDecalBgImg, 24, 21, canvasWidth/2, canvasHeight/2);
      ctxDecalBg.globalCompositeOperation = 'source-in';
      ctxDecalBg.fillStyle = getColor(clanBanner.decal.backgroundColor);
      ctxDecalBg.fillRect(0, 0, canvasWidth, canvasHeight);
    };
    gonfalonStaff.onload = () => {
      ctxStaff.drawImage(gonfalonStaff, 0, 0, staffWidth/2, staffHeight/2);
      ctxStaff.globalCompositeOperation = 'source-atop';
      ctxStaff.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctxStaff.fillRect(0, 0, 700, 500);
    };
  }
  finishedLoading() { this.setState({ status: { status: 'ready', statusText: 'Finished Loading...', error: null } }); }


  render() {
    var { status, clanData, clanBanner, clanPlayerInfo } = this.state;
    const getMemberType = (memberType) => { return memberType === 5 ? "Owner" : ( memberType === 4 ? "Co-owner" : ( memberType === 3 ? "Admin" : ( memberType === 2 ? "Member" : "Beginner" ) ) ) };
    if(status.status === "ready" || status.status === "loadingBanner") {
      return(
        <div className="clanPage">
          <div className="clanInfo">
            <h4 className="clanName">{ `${ clanData.name } (${ clanData.clanInfo.clanCallsign })` }</h4>
            <div className="clanBanner">
              <canvas id="canvasGonfalon" ref="canvasGonfalon" width="215" height="375" />
              <canvas ref="canvasDetail" width="215" height="375" />
              <canvas ref="canvasDecalBg" width="215" height="375" />
              <canvas ref="canvasDecalFg" width="215" height="375" />
              <canvas ref="canvasStaff" width="215" height="375" />
            </div>
          </div>
          <div className="clanData">
            <h4>Clan Info</h4>
            <div className="clanStats">
              <div className="clanPlayerStatsTitle">
                <div className="membershipTypes">Platforms</div>
                <div className="seasonRank" title="Season Rank">SR</div>
                <div className="displayName">Name</div>
                <div className="totalTime">Time Played</div>
                <div className="triumphScore">Triumph Score</div>
                <div className="glory">Glory Rank</div>
                <div className="lastOnline">Last Online</div>
                <div className="joinDate">Joined Clan</div>
              </div>
              {
                clanPlayerInfo.ClanMembers
                .map(function(player) {
                  return(
                    <div className="clanPlayerStats">
                      <div className="membershipTypes">
                        {
                          player.membershipTypes.sort((a, b) => b - a).map(function(membershipType) {
                            return (
                              <div className="membershipTypeIcon">
                                <img src={ `/images/icons/platforms/${ Misc.getPlatformName(membershipType).toLowerCase() }.png` } />
                              </div>
                            )
                          })
                        }
                      </div>
                      <div className="seasonRank">{ Misc.numberWithCommas(clanPlayerInfo.ClanOthers.seasonRankings.find(e => e.membership_Id === player.membership_Id).seasonRank) }</div>
                      <div className="displayName">{ `${ player.displayName }` }<div className="memberType">{ `(${ getMemberType(player.memberType) })` }</div></div>
                      <div className="totalTime">{ Misc.numberWithCommas(Math.round(clanPlayerInfo.ClanOthers.totalTime.find(e => e.membership_Id === player.membership_Id).totalTime / 60)) } Hrs</div>
                      <div className="triumphScore">{ Misc.numberWithCommas(clanPlayerInfo.ClanOthers.triumphRankings.find(e => e.membership_Id === player.membership_Id).triumphScore) }</div>
                      <div className="glory">{ Misc.numberWithCommas(clanPlayerInfo.ClanRankings.gloryRankings.find(e => e.membership_Id === player.membership_Id).glory) }</div>
                      <div className="lastOnline"> { player.isOnline ? "Online" : `${ Misc.formatSmallTime((new Date().getTime() - new Date(player.lastOnlineStatusChange * 1000).getTime()) / 1000) } ago` } </div>
                      <div className="joinDate">{ Misc.convertTimeToDate(player.joinDate) }</div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="clanBroadcasts">
            <h4 className="broadcastsTitle">Clan Broadcasts</h4>
          </div>
        </div>
      );
    }
    else { return(<Loader statusText={ status.statusText } />) }
  }
}

export default Clan;
