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

export const UpdateServerInfo = async (server_info) => {
  return await fetch('https://api.guardianstats.com/UpdateServerInfo', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      owner_avatar: server_info.owner_avatar,
      owner_id: server_info.owner_id,
      enable_whitelist: server_info.enable_whitelist,
      enable_broadcasts_items: server_info.enable_broadcasts_items,
      enable_broadcasts_titles: server_info.enable_broadcasts_titles,
      enable_broadcasts_clans: server_info.enable_broadcasts_clans,
      enable_broadcasts_dungeons: server_info.enable_broadcasts_dungeons,
      enable_broadcasts_catalysts: server_info.enable_broadcasts_catalysts,
      joinedOn: server_info.joinedOn
    })
  }).then((response) => response.json()).then(async (response) => { return response; }).catch((err) => { console.log(err); });
};
