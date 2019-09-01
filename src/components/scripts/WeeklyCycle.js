export function weeklyCycleInfo(activity) {
  const resetTime = '17:00 UTC';
  const time = new Date().getTime();
  const msPerWk = 604800000;

  const cycleInfo = {
    epoch: {
      zerohour: new Date(`May 7 2019 ${resetTime}`).getTime()
    },
    cycle: {
      zerohour: 3
    },
    elapsed: {},
    week: {}
  };

  for(var cycle in cycleInfo.cycle) {
    cycleInfo.elapsed[cycle] = time - cycleInfo.epoch[cycle];
    cycleInfo.week[cycle] = Math.floor((cycleInfo.elapsed[cycle] / msPerWk) % cycleInfo.cycle[cycle]) + 1;
  }

  const weeklyCycleInfo = {
    zerohour: {
      1: { burn: 'Void' },
      2: { burn: 'Arc' },
      3: { burn: 'Solar' },
    }
  };

  if(activity === "ZeroHour") { return weeklyCycleInfo.zerohour[cycleInfo.week.zerohour].burn; }
}
