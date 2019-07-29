import * as db from '../requests/Database';
import * as bungie from '../requests/BungieReq';

//Consts
const flagEnum = (state, value) => !!(state & value);

export async function getProfile() {
  const { membershipId, membershipType } = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
  return await bungie.GetProfile(membershipType, membershipId, '200,202,600,800');
}

export async function getItemData() {
  //Get required infomation from the manifest and bungie account records.
  var ManifestCollectibles, ProfileData, PresentationNodes = null;
  await Promise.all([db.getCollectibles(), db.getPresentationNodes(), this.getProfile()]).then(results => {
    ManifestCollectibles = results[0];
    PresentationNodes = results[1];
    ProfileData = results[2];
  });

  //Set consts.
  const ProfileCollectibles = ProfileData.profileCollectibles.data.collectibles;
  const CharacterCollectibles = ProfileData.characterCollectibles.data;
  const ExoticNode = PresentationNodes[1068557105];

  //Check if the item has been obtained.
  await checkObtained(ProfileCollectibles, CharacterCollectibles, ManifestCollectibles);

  //Return data to main items.js file for render.
  return {
    ProfileData: ProfileData,
    ProfileCollectibles: ProfileCollectibles,
    CharacterCollectibles: CharacterCollectibles,
    ManifestCollectibles: ManifestCollectibles,
    PresentationNodes: PresentationNodes,
    ExoticNode: ExoticNode
  }
}

export async function enumerateItemState(state) {
  return {
    none: flagEnum(state, 0),
    notAcquired: flagEnum(state, 1),
    obscured: flagEnum(state, 2),
    invisible: flagEnum(state, 4),
    cannotAffordMaterialRequirements: flagEnum(state, 8),
    inventorySpaceUnavailable: flagEnum(state, 16),
    uniquenessViolation: flagEnum(state, 32),
    purchaseDisabled: flagEnum(state, 64)
  };
}

export async function checkObtained(ProfileCollectibles, CharacterCollectibles, ManifestCollectibles) {
  for(var pHash in ProfileCollectibles) {
    const enumState = await enumerateItemState(await ProfileCollectibles[pHash].state);
    if(enumState.notAcquired) { ManifestCollectibles[pHash].obtained = false; }
    else { ManifestCollectibles[pHash].obtained = true; }
  }
  for(var cHash in CharacterCollectibles) {
    for(var ccHash in CharacterCollectibles[cHash].collectibles) {
      const enumState = await enumerateItemState(await CharacterCollectibles[cHash].collectibles[ccHash].state);
      if(enumState.notAcquired) { ManifestCollectibles[ccHash].obtained = false; }
      else { ManifestCollectibles[ccHash].obtained = true; }
    }
  }
}