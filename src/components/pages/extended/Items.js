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
    none: this.flagEnum(state, 0),
    notAcquired: this.flagEnum(state, 1),
    obscured: this.flagEnum(state, 2),
    invisible: this.flagEnum(state, 4),
    cannotAffordMaterialRequirements: this.flagEnum(state, 8),
    inventorySpaceUnavailable: this.flagEnum(state, 16),
    uniquenessViolation: this.flagEnum(state, 32),
    purchaseDisabled: this.flagEnum(state, 64)
  };
}

export async function checkObtainedItem(childHash) {
  const { ProfileCollectibles } = this.state.data;
  if(this.enumerateItemState(ProfileCollectibles[childHash].state).notAcquired === true) {
    return "notAcquired";
  }
  return "";
}

export async function checkObtainedArmor(childHash) {
  const { CharacterCollectibles } = this.state.data;
  for(var i in CharacterCollectibles) {
    if(this.enumerateItemState(CharacterCollectibles[i].collectibles[childHash].state).notAcquired === true) {
      return "notAcquired";
    }
  }
  return "";
}
