//Required Libraries
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Functions
//import * as misc from './components/Misc';
import * as auth from './components/requests/BungieAuth';
import * as bungie from './components/requests/BungieReq';
import * as database from './components/requests/db/Database';
import db from './components/requests/db/Database';
import * as timers from './components/Timers';

//Pages
import Header from './components/modules/Header';
import Loader from './components/modules/Loader';
import Error from './components/modules/Error';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Failed from './components/pages/Failed';
import About from './components/pages/About';
import Profile from './components/pages/Profile';
import Activities from './components/pages/Activities';
import Items from './components/pages/Items';
import NotFound from './components/pages/PageNotFound';

//CSS
import './css/Style.css';
class App extends React.Component {

  state = {
    status: {
      status: 'checkManifest',
      statusText: 'Checking the Manifest...',
      error: null
    }
  }

  async checkManifest() {
    //Checking Manifest
    const databaseExists = await database.checkManifestExists();
    if(databaseExists) {
      //If database exists, then proceed to check to see if it is the latest version.
      const storedVersion = await db.table('manifest').toCollection().first();
      const currentVersion = await bungie.GetManifestVersion();

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

  manifestLoaded() { this.setState({ error: null, status: { status: 'ready', statusText: 'Ready to go!' } }); }
  setLastManifestCheck() { localStorage.setItem('lastManifestCheck', new Date().getTime()) }
  shouldCheckManifest() {
    if(localStorage.getItem("lastManifestCheck") === null){ return true }
    if(parseInt(localStorage.getItem('lastManifestCheck')) + (1000 * 60 * 60) > new Date().getTime()) { return false; }
    else { return true; }
  }
  forceManifestUpdate() { this.checkManifest(); }

  render() {
    const { status, statusText, error } = this.state.status;
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status !== 'ready') {
      if(status === 'checkManifest') {
        if(this.shouldCheckManifest()) {
          this.checkManifest();
          return <Loader statusText={ statusText } />;
        }
        else {
          this.manifestLoaded();
          return null;
        }
      }
    }
    else {
      if(localStorage.getItem('Authorization')) {
        auth.CheckAuth();
        timers.StartAuthTimer();

        //If player has given us permission we need to check the auth and possible renew the token.
        //Checks not coded yet.
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
                  <Route path="*" component={ NotFound } />
                </Switch>
              </div>
            </div>
          </Router>
        );
      }
      else {
        //So there are a few things we can do here,
        //We should check to see if the person is inspecting another player, or have they just not logged in.
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
  }
}

export default App;
