import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import qs from 'query-string';

import * as auth from '../../requests/BungieAuth';

export class Register extends Component {

  state = {
    code: '',
  }

  componentDidMount() {
    this.getCodeFromUrl();
  }

  getCodeFromUrl() {
    const params = qs.parse(this.props.location.search);
    this.setState({ code: params.code });
    auth.GetAuthentication(params.code);
  }

  render() {
    return(
      <React.Fragment>
        <Loader statusText="Registering you now! Welcome to the Guardianstats family!" />
      </React.Fragment>
    );
  }
}

export default Register;
