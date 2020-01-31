var client_id = "631351366799065088";
var client_secret = "jv_o_MT_Q8OjIZErSnO3qdqtYAf_16rH";
var scope = "identify";
var redirect_uri = "https://guardianstats.com/dashboard";
var discord_login_url = "https://discordapp.com/api/oauth2/authorize";
var discord_token_url = "https://discordapp.com/api/oauth2/token";
var discord_api_url = "https://discordapp.com/api";

export function linkWithDiscord() {
  if(process.env.NODE_ENV === 'development') { window.location.href = `${ discord_login_url }?client_id=${ client_id }&redirect_uri=http://localhost:3001/dashboard&response_type=code&scope=${ scope }`; }
  else { window.location.href = `${ discord_login_url }?client_id=${ client_id }&redirect_uri=${ redirect_uri }&response_type=code&scope=${ scope }`; }
}

export async function getAccessToken(code) {
  fetch(discord_token_url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    body: `client_id=${client_id}&client_secret=${client_secret}&grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3001/dashboard&scope=${scope}`
  })
  .then(async (response) => {
    response = JSON.parse(await response.text());
    if(response.error) { console.log(response); window.location.href = '/dashboard?failed=true'; }
    else { getDiscordUserInfo(response.access_token); }
  })
  .catch((error) => { console.error(error); });
}

async function getDiscordUserInfo(access_token) {
  fetch(discord_api_url + "/users/@me", {
    method: 'GET',
    headers: new Headers({ 'Authorization': `Bearer ${ access_token }`, 'Content-Type': 'application/x-www-form-urlencoded' })
  })
  .then(async (response) => {
    response = JSON.parse(await response.text());
    if(response.error) { console.log(response); window.location.href = '/dashboard?failed=true'; }
    else {
      localStorage.setItem('DiscordInfo', JSON.stringify(response));
      window.location.href = '/dashboard';
    }
  })
  .catch((error) => { console.error(error); });
}
