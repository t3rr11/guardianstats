import Dexie from 'dexie';
import * as bungie from './BungieReq';
import * as Misc from '../Misc';

const db = new Dexie('guardianstats');
db.version(1).stores({ manifest: 'version, value' });

export async function checkManifestExists() {
  return Dexie.exists("guardianstats").then(function(exists) { if(exists) { return true } else { return false } }).catch(function (error) { return error; });
}

export async function deleteManifest() { Dexie.delete('guardianstats'); }

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
export async function getCollectibles() { return (await db.table('manifest').toCollection().first()).value.DestinyCollectibleDefinition; }
export async function getPresentationNodes() { return (await db.table('manifest').toCollection().first()).value.DestinyPresentationNodeDefinition; }
export async function getActivityModes() { return (await db.table('manifest').toCollection().first()).value.DestinyActivityModeDefinition; }
export async function getActivityDefinition() { return (await db.table('manifest').toCollection().first()).value.DestinyActivityDefinition; }
export async function getInventoryItemDefinition() { return (await db.table('manifest').toCollection().first()).value.DestinyInventoryItemDefinition; }

export async function getTestDatabase() {
  var startTime = Math.round(new Date().getTime() / 1000);
  var data = (await db.table('manifest').toCollection().first()).value.DestinyInventoryItemDefinition[19962737];
  var endTime = Math.round(new Date().getTime() / 1000);
  console.log("Time Taken: " + Misc.formatTime(startTime - endTime));

  return data;
}

export default db;
