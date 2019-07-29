export async function getPlatform(accountInfo) {
  const selectedAccount = localStorage.getItem('SelectedAccount');
  var platforms = [];
  var platformUsername = null;

  if(Object.keys(accountInfo).includes('blizzardDisplayName')) { platforms.push({ 'platform': 'BNET', 'name': accountInfo.blizzardDisplayName, 'selected': '' }); }
  if(Object.keys(accountInfo).includes('psnDisplayName')) { platforms.push({ 'platform': 'PSN', 'name': accountInfo.psnDisplayName, 'selected': '' }); }
  if(Object.keys(accountInfo).includes('xboxDisplayName')) { platforms.push({ 'platform': 'XBL', 'name': accountInfo.xboxDisplayName, 'selected': '' }); }
  if(Object.keys(accountInfo).includes('stadiaDisplayName')) { platforms.push({ 'platform': 'STADIA', 'name': accountInfo.stadiaDisplayName, 'selected': '' }); }
  if(Object.keys(accountInfo).includes('steamDisplayName')) { platforms.push({ 'platform': 'STEAM', 'name': accountInfo.steamDisplayName, 'selected': '' }); }
  for(var i in platforms){
    if(selectedAccount === platforms[i].platform) {
      platformUsername = platforms[i].name;
      platforms[i].selected = 'selected';
    }
    else {
      platforms[i].selected = '';
    }
  }
  return { platforms, platformUsername };
}
