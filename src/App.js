//Required Libraries
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Functions
import * as main from './components/Main';
import * as misc from './components/Misc';
import * as bungie from './components/requests/BungieReq';
import * as auth from './components/requests/BungieAuth';


//Pages
import Header from './components/layout/Header';
import Home from './components/pages/Home';
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
    isLoaded: false,
    error: false,
    profile: []
  }

  componentDidMount() {
    if(localStorage.getItem('Authorization')) { auth.CheckAuth(); }
    this.grabData();
  }

  grabData = async() => {
    bungie.GetProfile('4', '4611686018471334813', '200,202,600,800').then(
      (result) => { this.setState({ isLoaded: true, profile: result }) },
      (error) => { this.setState({ isLoaded: true, error }); }
    );
  }

  render() {
    main.StartLoading();
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
              <Route path="/activities" render={ props => (<Activities profile={ this.state.profile } isLoaded='true' />) } />
              <Route path="/profile" render={ props => (<Profile profile={ this.state.profile } isLoaded='true' />) } />
              <Route path="*" component={ NotFound } />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
