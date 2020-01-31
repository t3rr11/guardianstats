import db from '../requests/Database';

export var MANIFEST = null;

export function SetManifest(manifest) {
  MANIFEST = manifest;
  console.log("Manifest Set Successfully");
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
