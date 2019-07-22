import Dexie from 'dexie';
import * as bungie from '../BungieReq';

const db = new Dexie('guardianstats');
db.version(1).stores({ manifest: 'version, value' });

export async function checkManifestExists() {
  return Dexie.exists("guardianstats").then(function(exists) { if(exists) { return true } else { return false } }).catch(function (error) { return error; });
}

export async function updateManifest() {
  try {
    const currentVersion = await bungie.GetManifestVersion();
    const newManifest = await bungie.GetManifest(currentVersion.jsonWorldContentPaths['en']);
    try {
      db.table('manifest').clear();
      db.table('manifest').add({ version: currentVersion.version, value: newManifest });
      console.log('Manifest Updated Successfully!');
      return true;
    }
    catch (err) { return err.message; }
  }
  catch (err) {
    if(err.message === 'Failed to fetch') { return 'Failed to fetch: Manifest'; }
    else if(err.message === 'maintenance') { return 'Bungie API is down for maintenance.'; }
    else { return err.message; }
  }
}

export async function getManifest() { return (await db.table('manifest').toCollection().first()).value; }

export default db;
