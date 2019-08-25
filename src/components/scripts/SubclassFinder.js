export function SetSubclass(charTalentGrid, talentGrid) {
  var activeNodes = [];
  var nodes = charTalentGrid.nodes;
  var nodeCategories = talentGrid.nodeCategories;
  for(var i in nodes){ if(nodes[i].isActivated) { activeNodes.push(nodes[i].nodeHash); } }
  for(var i in nodeCategories) {
    if(nodeCategories[i].identifier.includes("Path")){
      var checkedArray = [];
      for(var j in activeNodes){ if(nodeCategories[i].nodeHashes.includes(activeNodes[j])){ checkedArray.push(true); } else { checkedArray.push(false); } }
      if(checkedArray.filter(e => e === true).length == 4) {
        return SetSubClassBackground(nodeCategories[i]);
      }
    }
  }
}

function SetSubClassBackground(subclassPath){
  var subclassName = subclassPath.displayProperties.name;
  var subclassIcon = subclassPath.displayProperties.icon;
  //Hunter - Solar
  if(subclassName == 'Way of the Outlaw') { return "/images/classes/hunter/Six-Shooter.PNG" }
  else if(subclassName == 'Way of the Sharpshooter') { return "/images/classes/hunter/Golden Gun.PNG" }
  else if(subclassName == 'Way of a Thousand Cuts') { return "/images/classes/hunter/Blade Barrage.PNG" }
  //Hunter - Arc
  else if(subclassName == 'Way of the Warrior') { return "/images/classes/hunter/Arc Staff.PNG" }
  else if(subclassName == 'Way of the Wind') { return "/images/classes/hunter/Arc Staff.PNG" }
  else if(subclassName == 'Way of the Current') { return "/images/classes/hunter/Arc Staff.PNG" }
  //Hunter - Void
  else if(subclassName == 'Way of the Trapper') { return "/images/classes/hunter/Shadowshot.PNG" }
  else if(subclassName == 'Way of the Pathfinder') { return "/images/classes/hunter/Shadowshot.PNG" }
  else if(subclassName == 'Way of the Wraith') { return "/images/classes/hunter/Spectral Blades.PNG" }
  //Titan - Solar
  else if(subclassName == 'Code of the Fire-Forged') { return "/images/classes/titan/Hammer of Sol.PNG" }
  else if(subclassName == 'Code of the Siegebreaker') { return "/images/classes/titan/Hammer of Sol.PNG" }
  else if(subclassName == 'Code of the Devastator') { return "/images/classes/titan/Burning Maul.PNG" }
  //Titan - Arc
  else if(subclassName == 'Code of the Earthshaker') { return "/images/classes/titan/Fists of Havoc.PNG" }
  else if(subclassName == 'Code of the Juggernaut') { return "/images/classes/titan/Fists of Havoc.PNG" }
  else if(subclassName == 'Code of the Missile') { return "/images/classes/titan/Thundercrash.PNG" }
  //Titan - Void
  else if(subclassName == 'Code of the Protector') { return "/images/classes/titan/Ward of Dawn.PNG" }
  else if(subclassName == 'Code of the Aggressor') { return "/images/classes/titan/Ward of Dawn.PNG" }
  else if(subclassName == 'Code of the Commander') { return "/images/classes/titan/Banner Shield.PNG" }
  //Warlock - Solar
  else if(subclassName == 'Attunement of Sky') { return "/images/classes/warlock/Dawnblade.PNG" }
  else if(subclassName == 'Attunement of Flame') { return "/images/classes/warlock/Dawnblade.PNG" }
  else if(subclassName == 'Attunement of Grace') { return "/images/classes/warlock/Well of Radiance.PNG" }
  //Warlock - Arc
  else if(subclassName == 'Attunement of Conduction') { return "/images/classes/warlock/Stormtrance.PNG" }
  else if(subclassName == 'Attunement of the Elements') { return "/images/classes/warlock/Stormtrance.PNG" }
  else if(subclassName == 'Attunement of Control') { return "/images/classes/warlock/Chaos Reach.PNG" }
  //Warlock - Void
  else if(subclassName == 'Attunement of Chaos') { return "/images/classes/warlock/Nova Bomb.PNG" }
  else if(subclassName == 'Attunement of Hunger') { return "/images/classes/warlock/Nova Bomb.PNG" }
  else if(subclassName == 'Attunement of Fission') { return "/images/classes/warlock/Nova Warp.PNG" }
}
