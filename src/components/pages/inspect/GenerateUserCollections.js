import React from 'react';
import * as globals from '../../scripts/Globals';

export function generate(profileInfo, Manifest) {
  const ManifestCollectibles = globals.MANIFEST.DestinyCollectibleDefinition;
  const PresentationNodes = globals.MANIFEST.DestinyPresentationNodeDefinition;
  const ProfileCollectibles = profileInfo.profileCollectibles.data.collectibles;
  const CharacterCollectibles = profileInfo.characterCollectibles.data;
  const ObtainedItems = getObtainedItems(ProfileCollectibles, CharacterCollectibles, ManifestCollectibles);
  const ExoticNode = PresentationNodes[1068557105];
  return (
    <div className="inspectBox" id="InspectBoxUserCollections">
      <div id="itemCategories" className="scrollbar">
        {
          ExoticNode.children.presentationNodes.map(category => (
            <div key={ category.presentationNodeHash } id={ category.presentationNodeHash } className="itemSubCategory">
              <p className="inspectSubCategoryTitle">{ PresentationNodes[category.presentationNodeHash].displayProperties.name }</p>
              {
                PresentationNodes[category.presentationNodeHash].children.presentationNodes.map(node => (
                  <div key={ node.presentationNodeHash } id={ node.presentationNodeHash } className="itemCollectibleCategory">
                    <p className="itemCollectibleCategoryTitle">{ PresentationNodes[node.presentationNodeHash].displayProperties.name }</p>
                    {
                      PresentationNodes[node.presentationNodeHash].children.collectibles.map(collectible => (
                        <div key={ collectible.collectibleHash } id={ collectible.collectibleHash } className="inspectCollectibleItemContainer">
                          <img alt='Icon' src={ 'https://bungie.net' + ManifestCollectibles[collectible.collectibleHash].displayProperties.icon } className={ ObtainedItems[collectible.collectibleHash] ? null : "notAcquired" } />
                          <div className="inspectCollectibleItemInfo">
                            { getItemInfo(ManifestCollectibles, collectible.collectibleHash, "name") }
                            { getItemInfo(ManifestCollectibles, collectible.collectibleHash, "description") }
                            { getItemInfo(ManifestCollectibles, collectible.collectibleHash, "requirements") }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}
const flagEnum = (state, value) => !!(state & value);
function enumerateItemState(state) {
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
function getItemInfo(ManifestCollectibles, hash, request) {
  if(request === "name") {
    var name = ManifestCollectibles[hash].displayProperties.name;
    if(name !== "") { return <div className="title">{ name }</div> } else { return null; }
  }
  else if(request === "description") {
    var description = ManifestCollectibles[hash].displayProperties.description;
    if(description !== "") { return <div className="description">{ description }</div> } else { return null; }
  }
  else if(request === "requirements") {
    var requirements = ManifestCollectibles[hash].stateInfo.requirements.entitlementUnavailableMessage;
    if(requirements !== "") { return <div className="requirements">{ requirements }</div> } else { return null; }
  }
}
function getObtainedItems(ProfileCollectibles, CharacterCollectibles, ManifestCollectibles) {
  var obtainedItemsArray = { };
  for(var pHash in ProfileCollectibles) {
    const enumState = enumerateItemState(ProfileCollectibles[pHash].state);
    if(enumState.notAcquired) { obtainedItemsArray[pHash] = false }
    else { obtainedItemsArray[pHash] = true }
  }
  for(var cHash in CharacterCollectibles) {
    for(var ccHash in CharacterCollectibles[cHash].collectibles) {
      const enumState = enumerateItemState(CharacterCollectibles[cHash].collectibles[ccHash].state);
      if(enumState.notAcquired) { obtainedItemsArray[ccHash] = false }
      else { obtainedItemsArray[ccHash] = true }
    }
  }
  return obtainedItemsArray;
}
