export function modeTypes(type) {
  var allModeTypes = [
    { id: 0, name: "None", friendlyName: "None" },
    { id: 2, name: "Story", friendlyName: "Story" },
    { id: 3, name: "Strike", friendlyName: "Strike" },
    { id: 4, name: "Raid", friendlyName: "Raid" },
    { id: 6, name: "Patrol", friendlyName: "Patrol" },
    { id: 10, name: "Control", friendlyName: "Control" },
    { id: 12, name: "Clash", friendlyName: "Clash" },
    { id: 15, name: "Crimson Doubles", friendlyName: "Crimson Doubles" },
    { id: 16, name: "Nightfall", friendlyName: "Nightfall" },
    { id: 17, name: "Heroic Nightfall", friendlyName: "Heroic Nightfall" },
    { id: 19, name: "Iron Banner", friendlyName: "Iron Banner" },
    { id: 31, name: "Supremacy", friendlyName: "Supremacy" },
    { id: 37, name: "Survival", friendlyName: "Survival" },
    { id: 38, name: "Countdown", friendlyName: "Countdown" },
    { id: 40, name: "Social", friendlyName: "Social" },
    { id: 43, name: "Iron Banner Control", friendlyName: "IB Control" },
    { id: 44, name: "Iron Banner Clash", friendlyName: "IB Clash" },
    { id: 45, name: "Iron Banner Supremacy", friendlyName: "IB Supremacy" },
    { id: 46, name: "Nightfall", friendlyName: "" },
    { id: 47, name: "Heroic Nightfall", friendlyName: "" },
    { id: 48, name: "Rumble", friendlyName: "Rumble" },
    { id: 50, name: "Doubles", friendlyName: "Doubles" },
    { id: 51, name: "Private Clash", friendlyName: "Private Clash" },
    { id: 52, name: "Private Control", friendlyName: "Private Control" },
    { id: 53, name: "Private Supremacy", friendlyName: "Private Supremacy" },
    { id: 54, name: "Private Countdown", friendlyName: "Private Countdown" },
    { id: 55, name: "Private Survival", friendlyName: "Private Survival" },
    { id: 56, name: "Private Mayhem", friendlyName: "Private Mayhem" },
    { id: 57, name: "Private Rumble", friendlyName: "Private Rumble" },
    { id: 58, name: "Heroic Adventure", friendlyName: "Heroic Adventure" },
    { id: 59, name: "Showdown", friendlyName: "Showdown" },
    { id: 60, name: "Lockdown", friendlyName: "Lockdown" },
    { id: 61, name: "Scorched", friendlyName: "Scorched" },
    { id: 63, name: "Gambit", friendlyName: "Gambit" },
    { id: 65, name: "Breakthrough", friendlyName: "Breakthrough" },
    { id: 66, name: "Black Armory", friendlyName: "Black Armory" },
    { id: 67, name: "Salvage", friendlyName: "Salvage" },
    { id: 68, name: "Iron Banner Salvage", friendlyName: "IB Salvage" },
    { id: 71, name: "Clash Quickplay", friendlyName: "Clash" },
    { id: 72, name: "Clash Competitive", friendlyName: "Clash Competitive" },
    { id: 73, name: "Control Quickplay", friendlyName: "Control" },
    { id: 74, name: "Control Competitive", friendlyName: "Control Competitive" },
    { id: 75, name: "Gambit Prime", friendlyName: "Gambit Prime" },
    { id: 76, name: "Reckoning", friendlyName: "Reckoning" },
    { id: 77, name: "Menagerie", friendlyName: "Menagerie" },
    { id: 78, name: "Vex Offensive", friendlyName: "" },
    { id: 79, name: "Nightmare Hunt", friendlyName: "" },
    { id: 80, name: "Elimination", friendlyName: "Elimination" },
    { id: 81, name: "Momentum", friendlyName: "Momentum" },
    { id: 82, name: "Dungeon", friendlyName: "Dungeon" },
    { id: 83, name: "Sundial", friendlyName: "Sundial" },
    { id: 84, name: "TrialsOfOsiris", friendlyName: "Trials" }
  ];
  if(isNaN(type)) {
    var mode = allModeTypes.find(e => e.name === type);
    if(mode) { return mode; }
    else { return { id: type, name: "Unknown", friendlyName: "New mode" } }
  }
  else {
    var mode = allModeTypes.find(e => e.id === type);
    if(mode) { return mode; }
    else { return { id: type, name: "Unknown", friendlyName: "New mode" } }
  }
}

export function modes(type) {
  if(type === "PvP") { return [10,12,15,19,31,37,38,48,50,51,52,53,54,55,56,57,59,60,61,65,80,81,84]; }
  else if(type === "PvE") { return [2,3,4,6,16,17,40,46,47,58,66,77,78,79,82,83]; }
  else if(type === "Gambit") { return [63,75,76]; }
}

// 5: AllPvP
// 7: AllPvE
// 18: AllStrikes
// 25: AllMayhem
// 32: PrivateMatchesAll
// 39: TrialsOfTheNine
// 41: TrialsCountdown
// 42: TrialsSurvival
// 49: AllDoubles
// 64: AllPvECompetitive
// 69: PvPCompetitive
// 70: PvPQuickplay
