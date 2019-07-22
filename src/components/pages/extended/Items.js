import * as db from '../../requests/db/Database';
import * as bungie from '../../requests/BungieReq';

//Consts
const flagEnum = (state, value) => !!(state & value);

export async function getProfile() {
  const { displayName, membershipId, membershipType } = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
  return await bungie.GetProfile(membershipType, membershipId, '200,202,600,800');
}

export async function getItemData() {
  var ManifestCollectibles, ProfileData, PresentationNodes = null;
  await Promise.all([db.getCollectibles(), db.getPresentationNodes(), this.getProfile()]).then(results => {
    ManifestCollectibles = results[0];
    PresentationNodes = results[1];
    ProfileData = results[2];
  });
  const ProfileCollectibles = ProfileData.profileCollectibles.data.collectibles;
  const CharacterCollectibles = ProfileData.characterCollectibles.data;
  const ExoticNode = PresentationNodes[1068557105];
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
export async function checkObtained(ProfileCollectibles, CharacterCollectibles, collectibleHash) {
  try {
    if(enumerateItemState(ProfileCollectibles[collectibleHash].state).notAcquired === true) {
      return "collectibleItemImage notAcquired";
    }
    else {
      return "collectibleItemImage";
    }
  }
  catch (err) {
    for(var i in CharacterCollectibles) {
      if(enumerateItemState(CharacterCollectibles[i].collectibles[collectibleHash].state).notAcquired === true) {
        return "collectibleItemImage notAcquired";
      }
      else {
        return "collectibleItemImage";
      }
    }
  }
}
