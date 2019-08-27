import React from 'react';
import * as profileHelper from '../../scripts/ProfileHelper';
import * as SubclassFinder from '../../scripts/SubclassFinder';

export function generate(profileInfo, Manifest) {
  const CharactersInfo = profileInfo.characters.data;
  const SelectedCharacter = CharactersInfo[Object.keys(CharactersInfo)[0]];

  function GetCharacter(CharactersInfo, characterData, characterIndex) {
    var nextCharacter, previousCharacter;
    if(Object.keys(CharactersInfo).length === 1) {
      if(characterIndex === 0) { nextCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }; previousCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }; }
    }
    else if(Object.keys(CharactersInfo).length === 2) {
      if(characterIndex === 0) { nextCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[1]], index: 1 }; previousCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[1]], index: 1 }; }
      else if(characterIndex === 1) { nextCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }; previousCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }; }
    }
    else if(Object.keys(CharactersInfo).length === 3) {
      if(characterIndex === 0) { nextCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[1]], index: 1 }; previousCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[2]], index: 2 }; }
      else if(characterIndex === 1) { nextCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[2]], index: 2 }; previousCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }; }
      else if(characterIndex === 2) { nextCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }; previousCharacter = { characterData: CharactersInfo[Object.keys(CharactersInfo)[1]], index: 1 }; }
    }
    return (
      <div key={ "inspectBoxChar_" + characterData.characterId } className={ GetActiveCharacter(characterData.characterId, SelectedCharacter.characterId) } id={ "inspectBoxChar_" + characterData.characterId }>
        <div className="switchLeft" onClick={ (() => { SwapCharacter(CharactersInfo, previousCharacter) }) }></div>
        <div id="backgroundDiv" style={{ backgroundImage: `url("https://bungie.net${characterData.emblemBackgroundPath}")` }}>
          <span id='left_span'>{ profileHelper.getClassName(characterData.classType) }</span>
          <span id='right_span'>✦ { characterData.light }</span>
        </div>
        <div className="switchRight" onClick={ (() => { SwapCharacter(CharactersInfo, nextCharacter) }) }></div>
      </div>
    );
  }
  function GetCharacterDetails(profileInfo, Manifest, CharactersInfo, characterData, characterIndex) {
    const currentTalentGridHash = profileInfo.characterEquipment.data[characterData.characterId].items.find(item => item.bucketHash === 3284755031).itemInstanceId;
    const talentGrid = Manifest.DestinyTalentGridDefinition[profileInfo.itemComponents.talentGrids.data[currentTalentGridHash].talentGridHash];
    return (
      <div key={ `charDetails_${ characterData.characterId }` } className={ GetActiveCharacterDetails(characterData.characterId, SelectedCharacter.characterId) } id={ `inspectBoxCharDetails_${ characterData.characterId }` } style={{ backgroundImage: `url("${ SubclassFinder.SetSubclass(profileInfo.itemComponents.talentGrids.data[currentTalentGridHash], talentGrid) }")` }} >
        <div className="inspectBoxCharacterDetailsItems">
          <div className="inspectBoxCharacterDetailsItemsLeft">
            {
              // eslint-disable-next-line
              profileInfo.characterEquipment.data[characterData.characterId].items.map(item => {
                const Items = [1498876634, 2465295065, 953998645, 4023194814, 2025709351, 284967655];
                if(Items.find(bucket => bucket === item.bucketHash)) {
                  return (
                    <div key={ item.itemHash } id={ item.itemHash } className="collectibleItemContainer">
                      <img alt={ Manifest.DestinyInventoryItemDefinition[item.itemHash].displayProperties.name } src={ `https://bungie.net${ Manifest.DestinyInventoryItemDefinition[item.itemHash].displayProperties.icon }` } className="collectibleItemImage" />
                      <div className="collectibleItemInfo">{ Manifest.DestinyInventoryItemDefinition[item.itemHash].displayProperties.name }</div>
                    </div>
                  )
                }
              })
            }
          </div>
          <div className="inspectBoxCharacterDetailsItemsRight">
            {
              // eslint-disable-next-line
              profileInfo.characterEquipment.data[characterData.characterId].items.map(item => {
                const Items = [3448274439, 3551918588, 14239492, 20886954, 1585787867];
                if(Items.find(bucket => bucket === item.bucketHash)) {
                  return (
                    <div key={ item.itemHash } id={ item.itemHash } className="collectibleItemContainer">
                      <img alt={ Manifest.DestinyInventoryItemDefinition[item.itemHash].displayProperties.name } src={ `https://bungie.net${ Manifest.DestinyInventoryItemDefinition[item.itemHash].displayProperties.icon }` } className="collectibleItemImage" />
                      <div className="collectibleItemInfo">{ Manifest.DestinyInventoryItemDefinition[item.itemHash].displayProperties.name }</div>
                    </div>
                  )
                }
              })
            }
          </div>
        </div>
      </div>
    );
  }
  function GetCharacterExtendedDetails(profileInfo, Manifest, CharactersInfo, characterData, characterIndex) {
    return (
      <div  key={ `charDetailsExt_${ characterData.characterId }` } className={ GetActiveCharacterExtendedDetails(characterData.characterId, SelectedCharacter.characterId) } id={ `inspectBoxCharExtendedDetails_${ characterData.characterId }` }>
        <div style={{ float: 'left', paddingLeft: '10px' }}>Character Time Played: </div>
        <div style={{ float: 'right', paddingRight: '10px', color: '#ccc' }}>{ Math.round((profileInfo.characters.data[characterData.characterId].minutesPlayedTotal / 60) / 24) } Days</div>
      </div>
    );
  }
  function SwapCharacter(CharactersInfo, selectedCharacter) {
    for(var i in CharactersInfo) {
      document.getElementById("inspectBoxChar_" + i).className = "inspectBoxCharacterBanner";
      document.getElementById("inspectBoxCharDetails_" + i).className = "inspectBoxCharacterDetails";
      document.getElementById("inspectBoxCharExtendedDetails_" + i).className = "inspectBoxCharacterExtendedDetails";
    }
    document.getElementById("inspectBoxChar_" + selectedCharacter.characterData.characterId).className = "inspectBoxCharacterBanner active";
    document.getElementById("inspectBoxCharDetails_" + selectedCharacter.characterData.characterId).className = "inspectBoxCharacterDetails active";
    document.getElementById("inspectBoxCharExtendedDetails_" + selectedCharacter.characterData.characterId).className = "inspectBoxCharacterExtendedDetails active";
  }
  function GetActiveCharacter(queryCharacter, SelectedCharacter) {
    if(queryCharacter === SelectedCharacter) { return `inspectBoxCharacterBanner active`; }
    else { return `inspectBoxCharacterBanner` }
  }
  function GetActiveCharacterDetails(queryCharacter, SelectedCharacter) {
    if(queryCharacter === SelectedCharacter) { return `inspectBoxCharacterDetails active`; }
    else { return `inspectBoxCharacterDetails` }
  }
  function GetActiveCharacterExtendedDetails(queryCharacter, SelectedCharacter) {
    if(queryCharacter === SelectedCharacter) { return `inspectBoxCharacterExtendedDetails active`; }
    else { return `inspectBoxCharacterExtendedDetails` }
  }

  return (
    <div className="inspectBox" id="InspectBoxCharacterViewer">
      <div className="inspectBoxTitle"> Character Viewer </div>
      <div className="inspectBoxCharacters">
        <div className="inspectBoxCharacterSelect">
          { Object.keys(CharactersInfo).map(function(key, value) { return ( GetCharacter(CharactersInfo, CharactersInfo[key], value) ); }) }
        </div>
        <div className="inspectBoxCharacterView">
          { Object.keys(CharactersInfo).map(function(key, value) { return ( GetCharacterDetails(profileInfo, Manifest, CharactersInfo, CharactersInfo[key], value) ); }) }
        </div>
        <div className="inspectBoxCharacterExtended">
          { Object.keys(CharactersInfo).map(function(key, value) { return ( GetCharacterExtendedDetails(profileInfo, Manifest, CharactersInfo, CharactersInfo[key], value) ); }) }
        </div>
      </div>
    </div>
  );
}
