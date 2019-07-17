import Manifest from './content/jsons/manifest.json'
import Cookies from 'js-cookie'

async function VersionCheck() {
  //Check for cookie
  if(Cookies.get('isBeta')) {
    if(Cookies.get('isBeta') === true) {
      //If cookie is true then they are beta, so load beta page.
      localStorage.setItem('version', Manifest[0].beta_version);
    }
    else {
      //If cookie is false then they are not beta, so load normal page.
      localStorage.setItem('version', Manifest[0].version);
    }
  }
  else {
    //If they didn't have the cookie set, then set the cookie and load normal page.
    Cookies.set('isBeta', false);
    localStorage.setItem('version', Manifest[0].version);
  }
}

export { VersionCheck }
