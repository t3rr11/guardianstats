export const CheckIfPatreon = async (membershipId) => {
  return await fetch('https://api.guardianstats.com/CheckIfPatreon', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ membershipId })
  }).then((response) => response.json()).then(async (response) => { return response; }).catch((err) => { console.log(err); });
};

export const GetServers = async (discordInfo) => {
  return await fetch('https://api.guardianstats.com/GetGuildsFromDiscordID', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'id': discordInfo.id, 'username': discordInfo.username, 'avatar': discordInfo.avatar, 'discriminator': discordInfo.discriminator })
  }).then((response) => response.json()).then(async (response) => { return response; }).catch((err) => { console.log(err); });
};

export const GetClanMembers = async (clan_id) => {
  return await fetch('https://api.guardianstats.com/GetClanMembers', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ clan_id })
  }).then((response) => response.json()).then(async (response) => { return response; }).catch((err) => { console.log(err); });
};

export const GetClan = async (clan_id) => {
  return await fetch('https://api.guardianstats.com/GetClan', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ clan_id })
  }).then((response) => response.json()).then(async (response) => { return response; }).catch((err) => { console.log(err); });
};
