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

//Functions
import db from './components/requests/Database';
import * as auth from './components/requests/BungieAuth';
import * as bungie from './components/requests/BungieReq';
import * as timers from './components/Timers';
import * as checks from './components/scripts/Checks';
import * as globals from './components/scripts/Globals';
import * as Checks from './components/scripts/Checks';
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
    if(!localStorage.getItem("Firstload")) {
      localStorage.clear();
      localStorage.setItem("Firstload", "false");
      window.location.reload();
    }
    else {
      if(!await Checks.checkSettingsExist()) { Settings.setDefaultSettings(); }
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
        globals.SetManifest((await db.table('manifest').toCollection().first()).value);
        this.manifestLoaded();
      }
      else {
        console.log("Checking Manifest");
        //Manifest has expired
        this.setState({ status: { status: 'expiredManifest', statusText: 'Checking Bungie Manifest...', loading: true } });
        //Define variables
        var storedVersion, currentVersion;
        //Grab versions
        await Promise.all([ await db.table('manifest').toCollection().first(), await bungie.GetManifestVersion() ]).then(async function(values) { storedVersion = values[0]; currentVersion = values[1]; });
        //Check versions
        console.log(storedVersion, currentVersion);
        if(await checks.checkManifestVersion(storedVersion, currentVersion)) {
          //Manifest version is the same. Set manifest to global variable: MANIFEST and finish loading page.
          globals.SetManifest(storedVersion.value);
          this.manifestLoaded();
          this.setLastManifestCheck();
        }
        else {
          console.log("Updating Manifest");
          this.setState({ status: { status: 'updatingManifest', statusText: 'Updating Manifest...', loading: true } });
          //New Manifest Found. Store manifest and set manifest to global variable: MANIFEST;
          await this.getManifest(currentVersion);
          this.manifestLoaded();
          this.setLastManifestCheck();
        }
      }
    }
    else {
      //No manifest found
      this.setState({ status: { status: 'noManifest', statusText: 'Downloading Bungie Manifest...', loading: true } });
      await this.getManifest(await bungie.GetManifestVersion());
      this.manifestLoaded();
      this.setLastManifestCheck();
    }
  }
  async getManifest(currentVersion) {
    await bungie.GetManifest(currentVersion.jsonWorldContentPaths['en']).then((newManifest) => {
      try { db.table('manifest').clear(); } catch (err) { console.log("No manifest to clear. Ignore this."); }
      this.setState({ status: { status: 'storingManifest', statusText: "Storing Manfiest...", loading: true } });
      db.table('manifest').add({ version: currentVersion.version, value: newManifest }).then(() => {
        console.log('Manifest Added Successfully!');
        globals.SetManifest(newManifest);
      }).catch(error => {
        if((error.name === 'QuotaExceededError') || (error.inner && error.inner.name === 'QuotaExceededError')) {
          console.log('If you see this message, then error handling works as expected.', error);
          this.setState({ status: { error: error.message, status: 'error', statusText: 'Failed to save manifest: QuotaExceededError (Possible reasons: Are you using Incognito mode?)', loading: false } });
        }
        else {
          console.log('Here is something wrong:', error);
          console.log('error.message', error.message);
          console.log('error.name', error.name);
          console.log('error', error);
          this.setState({ status: { error: error.message, status: 'error', statusText: `Failed to save manifest: ${ error.name }`, loading: false } });
        }
        return "Failed";
      });
    }).catch(function(err) {
      if(err.message === 'Failed to fetch') { this.setState({ status: { error: err.message, status: 'error', statusText: 'Failed to fetch: Manifest', loading: false } }); }
      else if(err.ErrorCode === 5) { this.setState({ status: { error: err.message, status: 'error', statusText: 'Bungie API is down for maintenance.', loading: false } }); }
      else { console.log(err); this.setState({ status: { error: err.message, status: 'error', statusText: err.message, loading: false } }); }
      return "Failed";
    });
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
  setLastManifestCheck() { localStorage.setItem('lastManifestCheck', new Date().getTime()) }
  profileLoaded() { this.setState({ status: { status: 'ready', statusText: 'Ready to go!', loading: false } }); }

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
                  <Route exact path="/" render={ props => (<Home inspectPlayer={ this.inspectPlayer } foundUser={ ((platform, mbmID) => props.history.push(`/inspect/${ platform }/${ mbmID }`)) } isLive={ this.state.isLive } />) } />
                  <Route path="/home" render={ props => (<Home inspectPlayer={ this.inspectPlayer } foundUser={ ((platform, mbmID) => props.history.push(`/inspect/${ platform }/${ mbmID }`)) } isLive={ this.state.isLive } />) } />
                  <Route path="/activities" render={ props => (<Activities />) } />
                  <Route path="/exotics" render={ props => (<Exotics />) } />
                  <Route path="/vendors" render={ props => (<Vendors />) } />
                  <Route path="/news" render={ props => (<Blog />) } />
                  <Route path="/profile" render={ props => (<Inspect />) } />
                  <Route path="/inspect" render={ props => (<Inspect membershipInfo={ props.location.pathname.replace('/inspect/', '') } />) } />
                  <Route path="/loader" render={ props => (<SmallLoader statusText="Text example" />) } />
                  <Route path="/thanks" render={ props => (<Thanks />) } />
                  <Route path="/glorycheck" render={ props => (<Glory />) } />
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
                  <Route exact path="/" render={ props => (<Home inspectPlayer={ this.inspectPlayer } foundUser={ ((platform, mbmID) => props.history.push(`/inspect/${ platform }/${ mbmID }`)) } isLive={ this.state.isLive } />) } />
                  <Route path="/home" render={ props => (<Home inspectPlayer={ this.inspectPlayer } foundUser={ ((platform, mbmID) => props.history.push(`/inspect/${ platform }/${ mbmID }`)) } isLive={ this.state.isLive } />) } />
                  <Route path="/register" render={ props => (<Register {...props} />) } />
                  <Route path="/failed" component={ Failed } />
                  <Route path="/inspect" render={ props => (<Inspect membershipInfo={ props.location.pathname.replace('/inspect/', '') } />) } />
                  <Route path="/news" render={ props => (<Blog />) } />
                  <Route path="/thanks" render={ props => (<Thanks />) } />
                  <Route path="/glorycheck" render={ props => (<Glory />) } />
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
