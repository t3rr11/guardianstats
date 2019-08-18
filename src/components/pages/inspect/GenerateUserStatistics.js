import React, { Component } from 'react';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';

export function generate(profileInfo) {
  return (
    <div className="inspectBox">
      <div className="inspectBoxTitle"> Statistics </div>
      <div className="inspectBoxContent">
        { generateRanks(profileInfo) }
      </div>
    </div>
  );
}

export const generateRanks = (profileInfo) => {
  return (
    <div className="inspectBoxRanks">
      <div className="inspectBoxRanksValor">
        <span className="inspectBoxRanksTitle">Valor</span>
        <div className="inspectBoxRanksImage" style={{ backgroundImage: 'url("/images/icons/pvp/valor_icon.png")' }}></div>
        <span className="inspectBoxRanksScore">{ getRank(profileInfo, "valor") }</span>
      </div>
      <div className="inspectBoxRanksGlory">
        <span className="inspectBoxRanksTitle">Glory</span>
        <div className="inspectBoxRanksImage" style={{ backgroundImage: 'url("/images/icons/pvp/glory_icon.png")' }}></div>
        <span className="inspectBoxRanksScore">{ getRank(profileInfo, "glory") }</span>
      </div>
      <div className="inspectBoxRanksInfamy">
        <span className="inspectBoxRanksTitle">Infamy</span>
        <div className="inspectBoxRanksImage" style={{ backgroundImage: 'url("/images/icons/pvp/infamy_icon.png")' }}></div>
        <span className="inspectBoxRanksScore">{ getRank(profileInfo, "infamy") }</span>
      </div>
    </div>
  );
}

const getRank = (profileInfo, type) => {
  if(type === "valor") { return profileInfo.characterProgressions.data[profileInfo.profile.data.characterIds[0]].progressions["3882308435"].currentProgress; }
  else if(type === "glory") { return profileInfo.characterProgressions.data[profileInfo.profile.data.characterIds[0]].progressions["2679551909"].currentProgress; }
  else if(type === "infamy") { return profileInfo.characterProgressions.data[profileInfo.profile.data.characterIds[0]].progressions["2772425241"].currentProgress; }
}
