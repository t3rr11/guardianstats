import React, { Component } from 'react';
import qs from 'query-string';

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
    this.authTheUser(params.code);
  }

  authTheUser(code) {
    const encodedAuth = 'Basic ' + new Buffer('24048:oSj5RgkwtiqxdsDUaEH4H0bmIj-vggwGMmzc9XnAs0A').toString('base64');
    fetch(`https://www.bungie.net/platform/app/oauth/token/`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Key': 'fc1f06b666154eeaa8f89d91f32c23e7',
        'Authorization': encodedAuth
      }),
      body: `grant_type=authorization_code&code=${code}`
    })
    .then((response) => response.text())
    .then((responseText) => { this.checkAuth(responseText) })
    .catch((error) => { console.error(error); });
  }

  checkAuth(response) {
    response = JSON.parse(response);
    if(response.error) {
      window.location.href = '/failed';
    }
    else {
      localStorage.setItem('Authorization', JSON.stringify(response));
      window.location.href = '/';
    }
  }

  render() {
    return(
      <React.Fragment>
        <h1>Registering you now! Welcome to the Guardianstats family!</h1>
      </React.Fragment>
    );
  }
}

export default Register;
