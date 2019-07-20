//Required Libraries
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Functions
import * as main from './components/Main';
import * as misc from './components/Misc';
import * as auth from './components/requests/BungieAuth';
import * as preload from './components/requests/Preload';


//Pages
import Header from './components/modules/Header';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Failed from './components/pages/Failed';
import About from './components/pages/About';
import Profile from './components/pages/Profile';
import Activities from './components/pages/Activities';
import NotFound from './components/pages/PageNotFound';

//CSS
import './css/Style.css';
class App extends React.Component {

  state = {
    profile: [],
    hasProfileLoaded: false,
    error: null
  }

  async componentDidMount() {
    const data = await preload.GetProfile();
    console.log(data);
  }

  render() {
    const { error, hasProfileLoaded, profile } = this.state;
    if (!hasProfileLoaded) { return misc.ReturnLoader; }
    else if (error) {
      return <div>Error: {error.message} </div>;
    }
    else {
      if(localStorage.getItem('Authorization')) {
        //If player has given us permission we need to check the auth and possible renew the token.
        //Checks not coded yet.
        auth.CheckAuth();
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
                  <Route path="/activities" render={ props => (<Activities />) } />
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
