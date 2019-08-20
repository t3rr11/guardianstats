import React, { Component } from 'react';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';

export function generate(profileInfo) {
  const CharactersInfo = profileInfo.characters.data;

  return (
    <div className="inspectBox" id="InspectBoxCharacterViewer">
      <div className="inspectBoxTitle"> Character Viewer </div>
      <div className="inspectBoxContent">
        <div className="inspectBoxCharacterSelect">
          { Object.keys(CharactersInfo).map(function(key, value) { return ( GetCharacter(CharactersInfo[key]) ); }) }
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

function GetCharacter(characterData) {
  //This is where the stuff happens
  return (
    <div>{ characterData.light }</div>
  );
}
