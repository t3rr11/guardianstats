//Required Libraries
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Functions
import * as bungie from './components/requests/BungieReq';

//Pages
import Header from './components/layout/Header';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Profile from './components/pages/Profile';
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
    this.grabData();
  }

  grabData = async() => {
    bungie.GetProfile('4', '4611686018471334813', '200,202,600,800').then(
      (result) => { this.setState({ isLoaded: true, profile: result }) },
      (error) => { this.setState({ isLoaded: true, error }); }
    );
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div className="page-content" id="page-content">
            <Switch>
              <Route exact path="/" component={ Home } />
              <Route path="/home" component={ Home } />
              <Route path="/about" component={ About } />
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
