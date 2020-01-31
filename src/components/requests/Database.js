import Dexie from 'dexie';

export const db = new Dexie('guardianstats');
db.version(1).stores({
  ManifestVersion: 'version',
  DestinyActivityDefinition: 'definition',
  DestinyActivityTypeDefinition: 'definition',
  DestinyActivityModeDefinition: 'definition',
  DestinyCollectibleDefinition: 'definition',
  DestinyPresentationNodeDefinition: 'definition',
  DestinyRecordDefinition: 'definition',
  DestinyInventoryItemLiteDefinition: 'definition',
  DestinyObjectiveDefinition: 'definition',
  DestinyProgressionDefinition: 'definition',
  DestinyTalentGridDefinition: 'definition',
  DestinyVendorDefinition: 'definition'
});

export async function checkManifestExists() { return Dexie.exists("guardianstats").then(function(exists) { if(exists) { return true } else { return false } }).catch(function (error) { return error; }); }

export default db;
