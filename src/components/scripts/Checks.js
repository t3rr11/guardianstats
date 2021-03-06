import * as db from '../requests/Database';
import * as globals from './Globals';

export async function startUpPageChecks() {
  if(! await checkPlatform()){ return "You have not yet selected your platform." }
  if(! await checkCharacter()){ return "Failed to load characters." }
  return "Checks OK";
}

export async function checkPlatform() { if(localStorage.getItem('SelectedAccount') !== 'Please Select Platform') { return true; } else { return false; } }
export async function checkCharacter() { if(localStorage.getItem('SelectedCharacter') === null) { return false; } else { return true; } }
export async function checkLogin() { if(localStorage.getItem('Authorization') === null) { return false; } else { return true; } }
export async function checkSettingsExist() { if(localStorage.getItem('Settings') === null) { return false; } else { return true; } }

export async function checkManifestExists() {
  if(await db.checkManifestExists()) { return true; }
  else { return false; }
}

export async function checkManifestValid() {
  if(new Date().getTime() < parseInt(localStorage.getItem('nextManifestCheck'))) { return true; }
  else { return false; }
}

export async function checkManifestVersion(storedVersion, currentVersion) {
  console.log(storedVersion, currentVersion);
  try {
    if(storedVersion.version !== currentVersion.version) { return false; }
    else { return true; }
  }
  catch (err) {
    return false;
  }
}

export function checkManifestMounted() {
  if(globals.MANIFEST !== null && globals.MANIFEST !== undefined) { return true; }
  else { return false; }
}
