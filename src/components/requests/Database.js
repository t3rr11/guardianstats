import Dexie from 'dexie';

const db = new Dexie('guardianstats');
db.version(1).stores({ manifest: 'version, value' });

export async function checkManifestExists() {
  return Dexie.exists("guardianstats").then(function(exists) { if(exists) { return true } else { return false } }).catch(function (error) { return error; });
}
export async function deleteManifest() { Dexie.delete('guardianstats'); }

export async function getManifest() { return (await db.table('manifest').toCollection().first()).value; }
export default db;
