import React, { Component } from 'react';
import Error from '../../modules/Error';
import Loader from '../../modules/Loader';
import * as Misc from '../../Misc';
import * as profileHelper from '../../scripts/ProfileHelper';

export function generate(profileInfo) {
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
      <div key={ "inspectBoxChar_" + characterData.characterId } className={ ReturnClassName(characterData.characterId, SelectedCharacter.characterId) } id={ "inspectBoxChar_" + characterData.characterId }>
        <div class="switchLeft" onClick={ (() => { SwapCharacter(CharactersInfo, previousCharacter) }) }></div>
        <div id="backgroundDiv" style={{ backgroundImage: `url("https://bungie.net${characterData.emblemBackgroundPath}")` }}>
          <span id='left_span'>{ profileHelper.getClassName(characterData.classType) }</span>
          <span id='right_span'>✦ { characterData.light }</span>
        </div>
        <div class="switchRight" onClick={ (() => { SwapCharacter(CharactersInfo, nextCharacter) }) }></div>
      </div>
    );
  }

  function SwapCharacter(CharactersInfo, selectedCharacter) {
    for(var i in CharactersInfo) { document.getElementById("inspectBoxChar_" + i).className = "inspectBoxCharacterBanner"; }
    document.getElementById("inspectBoxChar_" + selectedCharacter.characterData.characterId).className = "inspectBoxCharacterBanner active";
  }

  function ReturnClassName(queryCharacter, SelectedCharacter) {
    if(queryCharacter === SelectedCharacter) { return `inspectBoxCharacterBanner active`; }
    else { return `inspectBoxCharacterBanner` }
  }

  return (
    <div className="inspectBox" id="InspectBoxCharacterViewer">
      <div className="inspectBoxTitle"> Character Viewer </div>
      <div className="inspectBoxContent">
        <div className="inspectBoxCharacterSelect">
          { Object.keys(CharactersInfo).map(function(key, value) { return ( GetCharacter(CharactersInfo, CharactersInfo[key], value) ); }) }
        </div>
        <div className="inspectBoxCharacterView">
          {
            <Loader statusText={ "Character Viewer Loading..." }  />
          }
        </div>
      </div>
    </div>
  );
}
