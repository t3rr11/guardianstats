import React from 'react';
import * as globals from '../../scripts/Globals';

export function generate(profileInfo, lastPlayedCharacter) {

  const Manifest = globals.MANIFEST;
  const characterItems = profileInfo.characterInventories.data[lastPlayedCharacter].items;

  return (
    <div className="milestoneContainer">
      <div> { GenerateItems(characterItems, Manifest) } </div>
    </div>
  );
}

function GenerateItems(characterItems, Manifest) {
  return characterItems.map(function(item) {
    if(item.bucketHash === 1345459588) {
      console.log(item);
      const itemData = Manifest.DestinyInventoryItemDefinition[item.itemHash];
      return (
        <div key={ item.itemHash } id={ item.itemHash } className="collectibleItemContainer">
          <img alt='Icon' src={ 'https://bungie.net' + itemData.displayProperties.icon } className="collectibleItemImage" />
          <div className="collectibleItemInfo">{ itemData.displayProperties.name }</div>
        </div>
      )
    }
  });
}
