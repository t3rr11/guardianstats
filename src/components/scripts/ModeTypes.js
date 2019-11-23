export function modeTypes(type) {
  if(type === 0){ return 'None'; }
  else if(type === 2){ return 'Story: '; }
  else if(type === 3){ return 'Strike: '; }
  else if(type === 4){ return 'Raid: '; }
  else if(type === 6){ return 'Patrol: '; }
  else if(type === 10){ return 'Control: '; }
  else if(type === 12){ return 'Clash: '; }
  else if(type === 15){ return 'Crimson Doubles: '; }
  else if(type === 16){ return 'Nightfall: '; }
  else if(type === 17){ return 'Heroic Nightfall: '; }
  else if(type === 19){ return 'Iron Banner: '; }
  else if(type === 31){ return 'Supremacy: '; }
  else if(type === 37){ return 'Survival: '; }
  else if(type === 38){ return 'Countdown: '; }
  else if(type === 40){ return 'Social: '; }
  else if(type === 43){ return 'IB Control: '; }
  else if(type === 44){ return 'IB Clash: '; }
  else if(type === 45){ return 'IB Supremacy: '; }
  else if(type === 46){ return ''; } //ScoredNightfall
  else if(type === 47){ return ''; } //ScoredHeroicNightfall
  else if(type === 48){ return 'Rumble: '; }
  else if(type === 50){ return 'Doubles: '; }
  else if(type === 51){ return 'Private Clash: '; }
  else if(type === 52){ return 'Private Control: '; }
  else if(type === 53){ return 'Private Supremacy: '; }
  else if(type === 54){ return 'Private Countdown: '; }
  else if(type === 55){ return 'Private Survival: '; }
  else if(type === 56){ return 'Private Mayhem: '; }
  else if(type === 57){ return 'Private Rumble: '; }
  else if(type === 58){ return ''; } //Heroic Adventure
  else if(type === 59){ return 'Showdown: '; }
  else if(type === 60){ return 'Lockdown: '; }
  else if(type === 61){ return 'Scorched: '; }
  else if(type === 62){ return 'Scorched Team: '; }
  else if(type === 63){ return 'Gambit: '; }
  else if(type === 65){ return 'Breakthrough: '; }
  else if(type === 66){ return 'Black Armory: '; }
  else if(type === 67){ return 'Salvage: '; }
  else if(type === 68){ return 'IB Salvage: '; }
  else if(type === 71){ return 'Clash: '; }
  else if(type === 72){ return 'Clash Comp: '; }
  else if(type === 73){ return 'Control: '; }
  else if(type === 74){ return 'Control Comp: '; }
  else if(type === 75){ return 'Gambit Prime: '; }
  else if(type === 76){ return 'Reckoning: '; }
  else if(type === 77){ return 'Menagerie: '; }
  else if(type === 78){ return ''; } //Vex Offensive
  else if(type === 79){ return ''; } //Nightmare Hunt
  else if(type === 80){ return 'Elimination: '; }
  else if(type === 81){ return 'Momentum: '; }
  else if(type === 82){ return 'Dungeon: '; }
  else { return 'New Mode: '; }
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
