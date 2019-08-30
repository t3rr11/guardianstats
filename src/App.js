//Required Libraries
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Modules
import Header from './components/modules/Header';
import Loader from './components/modules/Loader';
import Error from './components/modules/Error';
import Warning from './components/modules/Warning';
import Manifest from './manifest.json';

//Pages
import Home from './components/pages/home/Home';
import Profile from './components/pages/profile/Profile';
import Inspect from './components/pages/inspect/Inspect';
import Items from './components/pages/items/Items';
import About from './components/pages/about/About';
import Activities from './components/pages/activities/Activities';
import Register from './components/pages/others/Register';
import Failed from './components/pages/others/Failed';
import Login from './components/pages/others/Login';
import NotFound from './components/pages/others/PageNotFound';

//Functions
import db from './components/requests/Database';
import * as auth from './components/requests/BungieAuth';
import * as bungie from './components/requests/BungieReq';
import * as database from './components/requests/Database';
import * as timers from './components/Timers';
import * as checks from './components/scripts/Checks';
import * as globals from './components/scripts/Globals';

//CSS
import './css/Style.css';
class App extends React.Component {

  state = {
    status: {
      status: 'startUp',
      statusText: 'Getting ready!',
      error: null,
      warning: null
    }
  }

  componentDidMount() {
    if(!localStorage.getItem("FirstLoad")) { localStorage.clear(); localStorage.setItem("FirstLoad", "false"); window.location.reload(); }
    else { this.loadManifest(); }
  }

  async loadManifest() {
    if(checks.checkManifestExists()) {
      //Manifest exists.
      if(checks.checkManifestValid()) {
        //Manifest is less than an hour old. Set manifest to global variable: MANIFEST;
        globals.SetManifest((await db.table('manifest').toCollection().first()).value);
        this.manifestLoaded();
      }
      else {
        //Manifest has expired
        this.setState({ status: { status: 'expiredManifest', statusText: 'Checking Bungie Manifest...' } });
        //Define variables
        var storedVersion, currentVersion;
        //Grab versions
        await Promise.all([ await db.table('manifest').toCollection().first(), await bungie.GetManifestVersion() ]).then(async function(values) { storedVersion = values[0]; currentVersion = values[1]; });
        //Check versions
        if(checks.checkManifestVersion(storedVersion, currentVersion)) {
          //Manifest version is the same. Set manifest to global variable: MANIFEST and finish loading page.
          globals.SetManifest(storedVersion.value);
          this.manifestLoaded();
          this.setLastManifestCheck();
        }
        else {
          //New Manifest Found. Store manifest and set manifest to global variable: MANIFEST;
          const newManifest = await this.getManifest(currentVersion);
          //Update only if no errors returned.
          if(newManifest !== "Failed") { globals.SetManifest(newManifest); }
          this.manifestLoaded();
          this.setLastManifestCheck();
        }
      }
    }
    else {
      //No manifest found
      this.setState({ status: { status: 'noManifest', statusText: 'Downloading Bungie Manifest...' } });
    }
  }
  async getManifest(currentVersion) {
    await bungie.GetManifest(currentVersion.jsonWorldContentPaths['en']).then((newManifest) => {
      try { db.table('manifest').clear(); } catch (err) { console.log("No manifest to clear. Ignore this."); }
      db.table('manifest').add({ version: currentVersion.version, value: newManifest }).then(() => {
        console.log('Manifest Added Successfully!');
        return newManifest;
      }).catch(error => {
        if((error.name === 'QuotaExceededError') || (error.inner && error.inner.name === 'QuotaExceededError')) {
          console.log('If you see this message, then error handling works as expected.', error);
          this.setState({ status: { error: error.message, status: 'error', statusText: 'Failed to save manifest: QuotaExceededError (Possible reasons: Are you using Incognito mode?)' } });
        }
        else {
          console.log('Here is something wrong:', error);
          console.log('error.message', error.message);
          console.log('error.name', error.name);
          console.log('error', error);
          this.setState({ status: { error: error.message, status: 'error', statusText: `Failed to save manifest: ${ error.name }` } });
        }
        return "Failed";
      });
    }).catch(function(err) {
      if(err.message === 'Failed to fetch') { this.setState({ status: { error: err.message, status: 'error', statusText: 'Failed to fetch: Manifest' } }); }
      else if(err.message === 'maintenance') { this.setState({ status: { error: err.message, status: 'error', statusText: 'Bungie API is down for maintenance.' } }); }
      else { console.log(err); this.setState({ status: { error: err.message, status: 'error', statusText: err.message } }); }
      return "Failed";
    });
  }
  setLastManifestCheck() { localStorage.setItem('lastManifestCheck', new Date().getTime()) }
  manifestLoaded() {
    this.setState({ status: { status: 'checkProfile', statusText: 'Checking if logged in...' } });
    this.checkProfile();
  }
  async checkProfile() {
    if(await checks.checkLogin()) {
      //Successfully Logged in.
      if(await checks.checkPlatform()) {
        //Account and platform found, Get Profile!
        this.setState({ status: { status: 'getProfile', statusText: `Guardianstats ${ Manifest.version }` } });
        this.getProfile();
      }
      else {
        //No platform selected. Do nothing really.
        this.setState({ status: { status: 'ready', statusText: 'Ready to go!' } });
      }
    }
    else {
      //Not logged in.
      this.setState({ status: { status: 'ready', statusText: 'Ready to go!' } });
    }
  }
  async getProfile() {
    if(localStorage.getItem('BasicMembershipInfo')) {
      const basicMembershipInfo = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
      await bungie.GetProfile(basicMembershipInfo.membershipType, basicMembershipInfo.membershipId, '100,200').then(response => {
        if(response) {
          const characters = response.characters.data;
          var lastOnlineCharacter = 0;
          for(var i in characters) { if(new Date(characters[i].dateLastPlayed) > lastOnlineCharacter) { lastOnlineCharacter = characters[i]; } }
          if(localStorage.getItem('SelectedCharacter') === null) { localStorage.setItem('SelectedCharacter', lastOnlineCharacter.characterId); }
          localStorage.setItem('ProfileInfo', JSON.stringify(response));
          this.profileLoaded();
        }
        else {
          localStorage.setItem('ProfileInfo', "");
          localStorage.setItem('SelectedAccount', "Please Select Platform");
          this.setState({ status: { status: 'ready', warning: 'Couldn\'t find Destiny 2 account on that platform.' } });
        }
      });
    }
    else {
      this.profileLoaded();
    }
  }
  async profileLoaded() { this.setState({ status: { status: 'ready', statusText: 'Ready to go!' } }); }

  render() {
    const { status, statusText, warning } = this.state.status;
    if(status === 'error') {
      return (
        <Router>
          <div className="App">
            <Header accountInfo={ JSON.parse(localStorage.getItem('BungieAccount')) } />
            <Error error={ statusText } />
          </div>
        </Router>
      );
    }
    else if(status === 'ready') {
      if(localStorage.getItem('Authorization')) {
        auth.CheckAuth();
        timers.StartAuthTimer();
        return (
          <Router>
            <div className="App">
              <Header accountInfo={ JSON.parse(localStorage.getItem('BungieAccount')) } />
              <div className="page-content" id="page-content">
                <Switch>
                  <Route exact path="/" render={ props => (<Home inspectPlayer={ this.inspectPlayer } />) } />
                  <Route path="/register" component={ Register }/>
                  <Route path="/failed" component={ Failed } />
                  <Route path="/home" render={ props => (<Home inspectPlayer={ this.inspectPlayer } />) } />
                  <Route path="/about" component={ About } />
                  <Route path="/activities" render={ props => (<Activities />) } />
                  <Route path="/items" render={ props => (<Items />) } />
                  <Route path="/profile" render={ props => (<Profile />) } />
                  <Route path="/inspect" render={ props => (<Inspect membershipInfo={ props.location.pathname.replace('/inspect/', '') } />) } />
                  <Route path="*" component={ NotFound } />
                </Switch>
                { warning != null ? (<Warning warning={ warning } />) : null }
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
                  <Route exact path="/" render={ props => (<Home inspectPlayer={ this.inspectPlayer } />) } />
                  <Route path="/register" component={ Register }/>
                  <Route path="/failed" component={ Failed } />
                  <Route path="/home" render={ props => (<Home inspectPlayer={ this.inspectPlayer } />) } />
                  <Route path="/about" component={ About } />
                  <Route path="/inspect" render={ props => (<Inspect membershipInfo={ props.location.pathname.replace('/inspect/', '') } />) } />
                  <Route path="*" component={ Login } />
                </Switch>
              </div>
            </div>
          </Router>
        );
      }
    }
    else { return <Loader statusText={ statusText } />; }
  }
}

export default App;
