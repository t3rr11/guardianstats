import React, { Component } from 'react';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';
import * as profileHelper from '../../scripts/ProfileHelper';

export function generate(profileInfo, selectedCharacterIndex) {
  const CharactersInfo = profileInfo.characters.data;
  const SelectedCharacter = CharactersInfo[Object.keys(CharactersInfo)[selectedCharacterIndex]];

  return (
    <div className="inspectBox" id="InspectBoxCharacterViewer">
      <div className="inspectBoxTitle"> Character Viewer </div>
      <div className="inspectBoxContent">
        <div className="inspectBoxCharacterSelect">
          { GetCharacter(CharactersInfo, SelectedCharacter, 0) }
        </div>
        <div className="inspectBoxCharacterView">
          {
            //Insert ALOTTA CODE
          }
        </div>
      </div>
    </div>
  );
}

function GetCharacter(CharactersInfo, characterData, characterIndex) {
  console.log(CharactersInfo);
  var nextCharacter, previousCharacter;
  if(CharactersInfo.length === 1) {
    if(characterIndex === 0) { nextCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }); previousCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }); }
  }
  else if(CharactersInfo.length === 2) {
    if(characterIndex === 0) { nextCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[1]], index: 1 }); previousCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[1]], index: 1 }); }
    else if(characterIndex === 1) { nextCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }); previousCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }); }
  }
  else if(CharactersInfo.length === 3) {
    if(characterIndex === 0) { nextCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[1]], index: 1 }); previousCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[2]], index: 2 }); }
    else if(characterIndex === 1) { nextCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[2]], index: 2 }); previousCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }); }
    else if(characterIndex === 2) { nextCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[0]], index: 0 }); previousCharacter.push({ characterData: CharactersInfo[Object.keys(CharactersInfo)[1]], index: 1 }); }
  }
  return (
    <div key={ characterData.characterId } className="inspectBoxCharacterBanner" id={ characterData.characterId }>
      <div class="switchLeft" onClick={ (() => { this.props.loadNewCharacter(previousCharacter) }) }> Left </div>
      <div id="backgroundDiv" style={{ backgroundImage: `url("https://bungie.net${characterData.emblemBackgroundPath}")` }}>
        <span id='left_span'>{ profileHelper.getClassName(characterData.classType) }</span>
        <span id='right_span'>✦ { characterData.light }</span>
      </div>
      <div class="switchRight" onClick={ (() => { this.props.loadNewCharacter(nextCharacter) }) }> Right </div>
    </div>
  );
}
