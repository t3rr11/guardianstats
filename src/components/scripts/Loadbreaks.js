var loadBreaks = [];

export function StartLoadBreak(name) { loadBreaks.push({ "name": name, "start": Date.now(), "checkpoint": Date.now() }); }
export function AddLoadBreak(name, desc) {
  var selectedLoadBreak = loadBreaks.find(e => e.name === name);
  console.log(`Loaded ${ desc }: ${ Date.now() - selectedLoadBreak.checkpoint }ms (${ (Date.now() - selectedLoadBreak.start ) / 1000 }s)`);
  selectedLoadBreak.checkpoint = Date.now();
}
export function StopLoadBreak(name) { loadBreaks.splice(loadBreaks.indexOf(name), 1) }
export function ListLoadBreaks() { console.log(loadBreaks); }
