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
export async function deleteManifest() { Dexie.delete('guardianstats'); }
export async function getManifestVersion() { return (await db.table('ManifestVersion').toCollection().first()).version; }
export async function getDefinition(definition) {
  if(definition === "DestinyActivityDefinition") { return (await db.table('DestinyActivityDefinition').toCollection().first()).data; }
  else if(definition === "DestinyActivityTypeDefinition") { return (await db.table('DestinyActivityTypeDefinition').toCollection().first()).data; }
  else if(definition === "DestinyActivityModeDefinition") { return (await db.table('DestinyActivityModeDefinition').toCollection().first()).data; }
  else if(definition === "DestinyCollectibleDefinition") { return (await db.table('DestinyCollectibleDefinition').toCollection().first()).data; }
  else if(definition === "DestinyPresentationNodeDefinition") { return (await db.table('DestinyPresentationNodeDefinition').toCollection().first()).data; }
  else if(definition === "DestinyRecordDefinition") { return (await db.table('DestinyRecordDefinition').toCollection().first()).data; }
  else if(definition === "DestinyInventoryItemLiteDefinition") { return (await db.table('DestinyInventoryItemLiteDefinition').toCollection().first()).data; }
  else if(definition === "DestinyObjectiveDefinition") { return (await db.table('DestinyObjectiveDefinition').toCollection().first()).data; }
  else if(definition === "DestinyProgressionDefinition") { return (await db.table('DestinyProgressionDefinition').toCollection().first()).data; }
  else if(definition === "DestinyTalentGridDefinition") { return (await db.table('DestinyTalentGridDefinition').toCollection().first()).data; }
  else if(definition === "DestinyVendorDefinition") { return (await db.table('DestinyVendorDefinition').toCollection().first()).data; }
}
export async function clearManifest() {
  db.table('ManifestVersion').clear();
  db.table('DestinyActivityDefinition').clear();
  db.table('DestinyActivityTypeDefinition').clear();
  db.table('DestinyActivityModeDefinition').clear();
  db.table('DestinyCollectibleDefinition').clear();
  db.table('DestinyPresentationNodeDefinition').clear();
  db.table('DestinyRecordDefinition').clear();
  db.table('DestinyInventoryItemLiteDefinition').clear();
  db.table('DestinyObjectiveDefinition').clear();
  db.table('DestinyProgressionDefinition').clear();
  db.table('DestinyTalentGridDefinition').clear();
  db.table('DestinyVendorDefinition').clear();
}

export default db;
