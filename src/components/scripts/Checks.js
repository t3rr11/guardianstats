import * as database from '../requests/Database';

export async function startUpPageChecks() {
  if(! await checkPlatform()){ return "You have not yet selected your platform." }
  if(! await checkCharacter()){ return "Failed to load characters." }
  return "Checks OK";
}

export async function checkPlatform() { if(localStorage.getItem('SelectedAccount') !== 'Please Select Platform') { return true; } else { return false; } }
export async function checkCharacter() { if(localStorage.getItem('SelectedCharacter') === null) { return false; } else { return true; } }
export async function checkLogin() { if(localStorage.getItem('Authorization') === null) { return false; } else { return true; } }

export async function checkManifestExists() {
  if(database.checkManifestExists()) { return true; }
  else { return false; }
}

export async function checkManifestValid() {
  if(new Date().getTime() > parseInt(localStorage.getItem('lastManifestCheck')) + (1000 * 60 * 60)) { return true; }
  else { return false; }
}

export async function checkManifestVersion(storedVersion, currentVersion) {
  if(storedVersion.version !== currentVersion.version) { return false; }
  else { return true; }
}
