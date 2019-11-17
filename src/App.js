//Required Libraries
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Modules
import Header from './components/modules/Header';
import SmallLoader from './components/modules/SmallLoader';
import Error from './components/modules/Error';
import Warning from './components/modules/Warning';
import * as Settings from './components/modules/Settings';
import Manifest from './manifest.json';

//Pages
import Home from './components/pages/home/Home';
import Inspect from './components/pages/inspect/Inspect';
import Exotics from './components/pages/exotics/Exotics';
import Activities from './components/pages/activities/Activities';
import Vendors from './components/pages/vendors/Vendors';
import Register from './components/pages/others/Register';
import Blog from './components/pages/blog/Blog';
import Failed from './components/pages/others/Failed';
import Login from './components/pages/others/Login';
import Thanks from './components/pages/others/Thanks';
import NotFound from './components/pages/others/PageNotFound';
import Glory from './components/pages/others/Glory';
import Marvin from './components/pages/marvin/Marvin';

//Functions
import db from './components/requests/Database';
import * as auth from './components/requests/BungieAuth';
import * as bungie from './components/requests/BungieReq';
import * as timers from './components/Timers';
import * as checks from './components/scripts/Checks';
import * as globals from './components/scripts/Globals';
import * as Misc from './components/Misc';

//CSS
import './css/Style.css';
class App extends React.Component {

  state = {
    status: {
      status: 'startUp',
      statusText: 'Getting ready!',
      error: null,
      warning: null,
      loading: true
    },
    isLive: false
  }

  async componentDidMount() {
    this.setState({ status: { status: 'startingUp', statusText: `Loading Guardianstats ${ Manifest.version }`, loading: true } });
    if(!localStorage.getItem("v146")) {
      localStorage.clear();
      indexedDB.deleteDatabase("guardianstats");
      localStorage.setItem("v146", "true");
      window.location.reload();
    }
    else {
      if(!await checks.checkSettingsExist()) { Settings.setDefaultSettings(); }
      if(Misc.noManifest()) { this.manifestLoaded(); }
      else { Misc.timed('Manifest', this.loadManifest()); }
      this.checkIfLive();
    }
  }
  async checkIfLive() {
    fetch(`https://api.twitch.tv/helix/streams/?user_id=214472144`, { method: 'GET', headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Client-id': '9mrfng8ubhs40gu19cksn69dq47gzy' }) })
    .then(response => response.json()).then(data => {
      if(data.data.length > 0) { this.setState({ isLive: true }); }
      else { this.setState({ isLive: false }); }
    }).catch((error) => { console.error(error); });
  }
  async loadManifest() {
    if(await checks.checkManifestExists()) {
      //Manifest exists.
      if(await checks.checkManifestValid()) {
        //Manifest is less than an hour old. Set manifest to global variable: MANIFEST;
        this.setState({ status: { status: 'grabbingManifest', statusText: 'Unpacking Manifest...', loading: true } });
        await this.setManifest();
      }
      else {
        console.log("Checking Manifest");
        //Manifest has expired
        this.setState({ status: { status: 'expiredManifest', statusText: 'Checking Bungie Manifest...', loading: true } });
        //Define variables
        var storedVersion, currentVersion;
        //Grab versions
        await Promise.all([ await db.table('ManifestVersion').toCollection().first(), await bungie.GetManifestVersion() ]).then(async function(values) { storedVersion = values[0]; currentVersion = values[1]; });
        //Check versions
        if(await checks.checkManifestVersion(storedVersion, currentVersion)) {
          //Manifest version is the same. Set manifest to global variable: MANIFEST and finish loading page.
          await this.setManifest();
          this.setNextManifestCheck();
        }
        else {
          console.log("Updating Manifest");
          this.setState({ status: { status: 'updatingManifest', statusText: 'Updating Manifest...', loading: true } });
          //New Manifest Found. Store manifest and set manifest to global variable: MANIFEST;
          await this.getManifest(currentVersion);
          this.manifestLoaded();
          this.setNextManifestCheck();
        }
      }
    }
    else {
      //No manifest found
      this.setState({ status: { status: 'noManifest', statusText: 'Downloading Bungie Manifest...', loading: true } });
      await this.getManifest(await bungie.GetManifestVersion());
      this.manifestLoaded();
      this.setNextManifestCheck();
    }
  }
  async getManifest(currentVersion) {

    const DestinyActivityDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyActivityDefinition;
    const DestinyActivityTypeDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyActivityTypeDefinition;
    const DestinyActivityModeDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyActivityModeDefinition;
    const DestinyCollectibleDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyCollectibleDefinition;
    const DestinyPresentationNodeDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyPresentationNodeDefinition;
    const DestinyRecordDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyRecordDefinition;
    const DestinyInventoryItemLiteDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyInventoryItemLiteDefinition;
    const DestinyObjectiveDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyObjectiveDefinition;
    const DestinyProgressionDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyProgressionDefinition;
    const DestinyTalentGridDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyTalentGridDefinition;
    const DestinyVendorDefinition = currentVersion.jsonWorldComponentContentPaths['en'].DestinyVendorDefinition;

    Promise.all([
      bungie.GetManifest(DestinyActivityDefinition),
      bungie.GetManifest(DestinyActivityTypeDefinition),
      bungie.GetManifest(DestinyActivityModeDefinition),
      bungie.GetManifest(DestinyCollectibleDefinition),
      bungie.GetManifest(DestinyPresentationNodeDefinition),
      bungie.GetManifest(DestinyRecordDefinition),
      bungie.GetManifest(DestinyInventoryItemLiteDefinition),
      bungie.GetManifest(DestinyObjectiveDefinition),
      bungie.GetManifest(DestinyProgressionDefinition),
      bungie.GetManifest(DestinyTalentGridDefinition),
      bungie.GetManifest(DestinyVendorDefinition)
    ]).then(async (values) => {
      this.setState({ status: { status: 'storingManifest', statusText: "Storing Manfiest...", loading: true } });
      try { db.clearManifest(); } catch (err) { console.log("No manifest to clear. Ignore this."); }

      //Add data to databases
      db.table('ManifestVersion').add({ version: currentVersion.version }).then(() => { console.log("Successfully Added ManifestVersion"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyActivityDefinition').add({ definition: 'DestinyActivityDefinition', data: values[0] }).then(() => { console.log("Successfully Added DestinyActivityDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyActivityTypeDefinition').add({ definition: 'DestinyActivityTypeDefinition', data: values[1] }).then(() => { console.log("Successfully Added DestinyActivityTypeDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyActivityModeDefinition').add({ definition: 'DestinyActivityModeDefinition', data: values[2] }).then(() => { console.log("Successfully Added DestinyActivityModeDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyCollectibleDefinition').add({ definition: 'DestinyCollectibleDefinition', data: values[3] }).then(() => { console.log("Successfully Added DestinyCollectibleDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyPresentationNodeDefinition').add({ definition: 'DestinyPresentationNodeDefinition', data: values[4] }).then(() => { console.log("Successfully Added DestinyPresentationNodeDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyRecordDefinition').add({ definition: 'DestinyRecordDefinition', data: values[5] }).then(() => { console.log("Successfully Added DestinyRecordDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyInventoryItemLiteDefinition').add({ definition: 'DestinyInventoryItemLiteDefinition', data: values[6] }).then(() => { console.log("Successfully Added DestinyInventoryItemLiteDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyObjectiveDefinition').add({ definition: 'DestinyObjectiveDefinition', data: values[7] }).then(() => { console.log("Successfully Added DestinyObjectiveDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyProgressionDefinition').add({ definition: 'DestinyProgressionDefinition', data: values[8] }).then(() => { console.log("Successfully Added DestinyProgressionDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyTalentGridDefinition').add({ definition: 'DestinyTalentGridDefinition', data: values[9] }).then(() => { console.log("Successfully Added DestinyTalentGridDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });
      db.table('DestinyVendorDefinition').add({ definition: 'DestinyVendorDefinition', data: values[10] }).then(() => { console.log("Successfully Added DestinyVendorDefinition"); }).catch(error => { this.handleError(error); return "Failed"; });

      //Set manifest
      await this.setManifest();
      console.log('Manifest Added Successfully!');
    }).catch((error) => { this.handleError(error); return "Failed"; });
  }
  async checkProfile() {
    if(await checks.checkLogin()) {
      //Successfully Logged in.
      if(await checks.checkPlatform()) {
        //Account and platform found, Get Profile!
        this.setState({ status: { status: 'getProfile', statusText: 'Getting profile data...', loading: true } });
        this.getProfile();
      }
      else {
        //No platform selected. Do nothing really.
        this.setState({ status: { status: 'ready', statusText: 'Ready to go!', loading: false } });
      }
    }
    else {
      //Not logged in.
      this.setState({ status: { status: 'ready', statusText: 'Ready to go!', loading: false } });
    }
  }
  async getProfile() {
    if(localStorage.getItem("SelectedAccount")) {
      const accountInfo = JSON.parse(localStorage.getItem("SelectedAccount"));
      await bungie.GetProfile(Misc.getPlatformType(accountInfo.platform), accountInfo.id, '100,200').then(response => {
        if(response) {
          const characters = response.characters.data;
          var lastOnlineCharacter = 0;
          for(var i in characters) { if(new Date(characters[i].dateLastPlayed) > lastOnlineCharacter) { lastOnlineCharacter = characters[i]; } }
          if(localStorage.getItem("SelectedCharacter") === null) { localStorage.setItem("SelectedCharacter", lastOnlineCharacter.characterId); }
          localStorage.setItem("ProfileInfo", JSON.stringify(response));
          this.profileLoaded();
        }
        else {
          localStorage.setItem("ProfileInfo", "");
          localStorage.setItem("SelectedAccount", "Please Select Platform");
          this.setState({ status: { status: 'ready', warning: 'Couldn\'t find Destiny 2 account on that platform.', loading: false } });
        }
      });
    }
    else {
      this.profileLoaded();
    }
  }
  manifestLoaded() { this.checkProfile(); }
  setNextManifestCheck() { localStorage.setItem('nextManifestCheck', new Date().getTime() + (1000 * 60 * 60)) }
  profileLoaded() { this.setState({ status: { status: 'ready', statusText: 'Ready to go!', loading: false } }); }
  handleError(error) {
    if(error.name === 'QuotaExceededError') { this.setState({ status: { error: error.message, status: 'error', statusText: 'Failed to save manifest: QuotaExceededError (Possible reasons: Are you using Incognito mode?)', loading: false } }); }
    else if(error.message === 'Failed to fetch') { this.setState({ status: { error: error.message, status: 'error', statusText: 'Failed to fetch: Manifest', loading: false } }); }
    else if(error.ErrorCode === 5) { this.setState({ status: { error: error.message, status: 'error', statusText: 'Bungie API is down for maintenance.', loading: false } }); }
    else { console.log('Here is something wrong:', error); this.setState({ status: { error: error.message, status: 'error', statusText: `Failed to save manifest: ${ error.message }`, loading: false } }); }
  }
  async setManifest() {
    Promise.all([
      db.table('DestinyActivityDefinition').toCollection().first(),
      db.table('DestinyActivityTypeDefinition').toCollection().first(),
      db.table('DestinyActivityModeDefinition').toCollection().first(),
      db.table('DestinyCollectibleDefinition').toCollection().first(),
      db.table('DestinyPresentationNodeDefinition').toCollection().first(),
      db.table('DestinyRecordDefinition').toCollection().first(),
      db.table('DestinyInventoryItemLiteDefinition').toCollection().first(),
      db.table('DestinyObjectiveDefinition').toCollection().first(),
      db.table('DestinyProgressionDefinition').toCollection().first(),
      db.table('DestinyTalentGridDefinition').toCollection().first(),
      db.table('DestinyVendorDefinition').toCollection().first()
    ]).then(async (values) => {
      //Add data to global manifest object
      globals.SetManifest({
        "DestinyActivityDefinition": values[0].data,
        "DestinyActivityTypeDefinition": values[1].data,
        "DestinyActivityModeDefinition": values[2].data,
        "DestinyCollectibleDefinition": values[3].data,
        "DestinyPresentationNodeDefinition": values[4].data,
        "DestinyRecordDefinition": values[5].data,
        "DestinyInventoryItemDefinition": values[6].data,
        "DestinyInventoryItemLiteDefinition": values[6].data,
        "DestinyObjectiveDefinition": values[7].data,
        "DestinyProgressionDefinition": values[8].data,
        "DestinyTalentGridDefinition": values[9].data,
        "DestinyVendorDefinition": values[10].data
      });
    }).catch((error) => { this.handleError(error); return "Failed"; });
    this.manifestLoaded();
  }

  render() {
    const { status, statusText, warning, loading } = this.state.status;
    if(status === "error") {
      return (
        <Router>
          <div className="App">
            <Header BungieMemberships={ JSON.parse(localStorage.getItem("DestinyMemberships")) } platformChange={ (() => this.checkProfile()) } />
            <Error error={ statusText } />
          </div>
        </Router>
      );
    }
    else {
      if(localStorage.getItem('Authorization')) {
        if(status === 'ready') { auth.CheckAuth(); timers.StartAuthTimer(); }
        return (
          <Router>
            <div className="App">
              <Header BungieMemberships={ JSON.parse(localStorage.getItem("DestinyMemberships")) } platformChange={ (() => this.checkProfile()) } />
              <div className="page-content" id="page-content">
                <Switch>
                  <Route exact path="/" render={ props => (<Home foundUser={ ((platform, mbmID) => props.history.push(`/inspect/${ platform }/${ mbmID }`)) } isLive={ this.state.isLive } />) } />
                  <Route path="/home" render={ props => (<Home foundUser={ ((platform, mbmID) => props.history.push(`/inspect/${ platform }/${ mbmID }`)) } isLive={ this.state.isLive } />) } />
                  <Route path="/register" render={ props => (<Register {...props} />) } />
                  <Route path="/activities" render={ props => (<Activities foundUser={ ((platform, mbmID) => props.history.push(`/inspect/${ platform }/${ mbmID }`)) } />) } />
                  <Route path="/exotics" render={ props => (<Exotics />) } />
                  <Route path="/vendors" render={ props => (<Vendors />) } />
                  <Route path="/news" render={ props => (<Blog />) } />
                  <Route path="/profile" render={ props => (<Inspect />) } />
                  <Route path="/inspect" render={ props => (<Inspect membershipInfo={ props.location.pathname.replace('/inspect/', '') } />) } />
                  <Route path="/loader" render={ props => (<SmallLoader statusText="Text example" />) } />
                  <Route path="/thanks" render={ props => (<Thanks />) } />
                  <Route path="/glorycheck" render={ props => (<Glory />) } />
                  <Route path="/marvin" render={ props => (<Marvin />) } />
                  <Route path="*" component={ NotFound } />
                </Switch>
                { warning ? (<Warning warning={ warning } />) : null }
                { loading === true ? (<SmallLoader statusText={ statusText } />) : null }
              </div>
            </div>
          </Router>
        );
      }
      else {
        return (
          <Router>
            <div className="App">
              <Header />
              <div className="page-content" id="page-content">
                <Switch>
                  <Route exact path="/" render={ props => (<Home foundUser={ ((platform, mbmID) => props.history.push(`/inspect/${ platform }/${ mbmID }`)) } isLive={ this.state.isLive } />) } />
                  <Route path="/home" render={ props => (<Home foundUser={ ((platform, mbmID) => props.history.push(`/inspect/${ platform }/${ mbmID }`)) } isLive={ this.state.isLive } />) } />
                  <Route path="/register" render={ props => (<Register {...props} />) } />
                  <Route path="/failed" component={ Failed } />
                  <Route path="/inspect" render={ props => (<Inspect membershipInfo={ props.location.pathname.replace('/inspect/', '') } />) } />
                  <Route path="/news" render={ props => (<Blog />) } />
                  <Route path="/thanks" render={ props => (<Thanks />) } />
                  <Route path="/glorycheck" render={ props => (<Glory />) } />
                  <Route path="/marvin" render={ props => (<Marvin />) } />
                  <Route path="*" component={ Login } />
                </Switch>
                { loading === true ? (<SmallLoader statusText={ statusText } />) : null }
              </div>
            </div>
          </Router>
        );
      }
    }
  }
}

export default App;
