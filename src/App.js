//Required Libraries
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Modules
import Header from './components/modules/Header';
import Loader from './components/modules/Loader';
import Error from './components/modules/Error';

//Pages
import Home from './components/pages/home/Home';
import Profile from './components/pages/profile/Profile';
import Snoop from './components/pages/snoop/Snoop';
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

//CSS
import './css/Style.css';
class App extends React.Component {

  state = {
    status: {
      status: 'startUp',
      statusText: 'Starting up...',
      error: null
    }
  }

  async checkManifest() {
    if(await checks.checkManifest()){
      if(await checks.updateManifest()){ this.manifestLoaded(); }
      else { this.setState({ status: { status: 'getManifest', statusText: 'Checking the Manifest...' } }) }
    }
    else { this.setState({ status: { status: 'getManifest', statusText: 'Checking the Manifest...' } }) }
  }
  async getManifest() {
    //Checking Manifest
    const databaseExists = await database.checkManifestExists();
    if(databaseExists) {
      //If database exists, then proceed to check to see if it is the latest version.
      const storedVersion = await db.table('manifest').toCollection().first();
      const currentVersion = await bungie.GetManifestVersion();

      try {
        if(storedVersion.version !== currentVersion.version) {
          //If the database is old, proceed to update it.
          this.setState({ error: null, status: { status: 'updatingManifest', statusText: 'Updating Manifest...' } });
          const update = await database.updateManifest();
          if(!update) { this.setState({ status: { error: update, status: 'error', statusText: update } }); }
          else { this.manifestLoaded(); this.setLastManifestCheck(); }
        }
        else {
          //If the database versions match, then it is the most recent, procced to loading.
          this.manifestLoaded();
          this.setLastManifestCheck();
        }
      }
      catch (err) { this.setState({ status: { error: err, status: 'error', statusText: err } }); }
    }
    else if(!databaseExists) {
      //If database does not exist. Then it will download it now.
      this.setState({ error: null, status: { status: 'downloadingManifest', statusText: 'Downloading Manifest...' } });
      try {
        const currentVersion = await bungie.GetManifestVersion();
        const newManifest = await bungie.GetManifest(currentVersion.jsonWorldContentPaths['en']);
        try {
          //Adding the manifest to the database now.
          db.table('manifest').add({ version: currentVersion.version, value: newManifest });
          console.log('Manifest Added Successfully!');
          this.manifestLoaded();
          this.setLastManifestCheck();
        }
        catch (err) { console.log(err); this.setState({ status: { error: err.message, status: 'error', statusText: err.message } }); }
      }
      catch (err) {
        if(err.message === 'Failed to fetch') { this.setState({ status: { error: err.message, status: 'error', statusText: 'Failed to fetch: Manifest' } }); }
        else if(err.message === 'maintenance') { this.setState({ status: { error: err.message, status: 'error', statusText: 'Bungie API is down for maintenance.' } }); }
        else { console.log(err); this.setState({ status: { error: err.message, status: 'error', statusText: err.message } }); }
      }
    }
    else { this.setState({ status: { error: databaseExists, status: 'error', statusText: databaseExists } }); }
  }
  async manifestLoaded() { this.setState({ status: { status: 'checkProfile', statusText: 'Checking if needs to obtain profile information' } }); }
  async setLastManifestCheck() { localStorage.setItem('lastManifestCheck', new Date().getTime()) }
  async forceManifestUpdate() { this.getManifest(); }
  async checkProfile() {
    if(await checks.checkLogin()) {
      if(await checks.checkPlatform()){ this.setState({ status: { status: 'getProfile', statusText: 'Please wait...' } }) }
      else { this.setState({ status: { status: 'ready', statusText: 'Ready to go!' } }) }
    }
    else { this.setState({ status: { status: 'ready', statusText: 'Ready to go!' } }) }
  }
  async getProfile() {
    const basicMembershipInfo = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
    const profileInfo = await bungie.GetProfile(basicMembershipInfo.membershipType, basicMembershipInfo.membershipId, '100,200');
    const characters = profileInfo.characters.data;
    var lastOnlineCharacter = 0;
    for(var i in characters) { if(new Date(characters[i].dateLastPlayed) > lastOnlineCharacter) { lastOnlineCharacter = characters[i]; } }
    if(localStorage.getItem('SelectedCharacter') === null) { localStorage.setItem('SelectedCharacter', lastOnlineCharacter.characterId); }
    localStorage.setItem('ProfileInfo', JSON.stringify(profileInfo));
    this.profileLoaded();
  }
  async profileLoaded() { this.setState({ status: { status: 'ready', statusText: 'Ready to go!' } }); }

  render() {
    const { status, statusText } = this.state.status;
    if(status === 'error') { return <Error error={ statusText } /> }
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
                  <Route exact path="/" component={ Home }/>
                  <Route path="/register" component={ Register }/>
                  <Route path="/failed" component={ Failed } />
                  <Route path="/home" component={ Home } />
                  <Route path="/about" component={ About } />
                  <Route path="/activities" render={ props => (<Activities />) } />
                  <Route path="/items" render={ props => (<Items />) } />
                  <Route path="/profile" render={ props => (<Profile />) } />
                  <Route path="/snoop" render={ props => (<Snoop membershipId={ props.location.pathname.replace('/snoop/', '') } />) } />
                  <Route path="*" component={ NotFound } />
                </Switch>
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
                  <Route exact path="/" component={ Home }/>
                  <Route path="/register" component={ Register }/>
                  <Route path="/failed" component={ Failed } />
                  <Route path="/home" component={ Home } />
                  <Route path="/about" component={ About } />
                  <Route path="*" component={ Login } />
                </Switch>
              </div>
            </div>
          </Router>
        );
      }
    }
    else {
      if(status === 'startUp') { this.checkManifest(); }
      else if(status === 'getManifest') { this.getManifest(); }
      else if(status === 'checkProfile') { this.checkProfile(); }
      else if(status === 'getProfile') { this.getProfile(); }
      return <Loader statusText={ statusText } />;
    }
  }
}

export default App;
