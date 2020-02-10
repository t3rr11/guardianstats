import * as timers from '../Timers';

var client_id = "631351366799065088";
var client_secret = "jv_o_MT_Q8OjIZErSnO3qdqtYAf_16rH";
var scope = "identify guilds";
var redirect_uri = "https://guardianstats.com/dashboard";
var discord_login_url = "https://discordapp.com/api/oauth2/authorize";
var discord_token_url = "https://discordapp.com/api/oauth2/token";
var discord_api_url = "https://discordapp.com/api";
var discord_webhooks_url = "https://discordapp.com/api/webhooks";

const encodedAuth = 'Basic ' + new Buffer(`${ client_id }:${ client_secret }`).toString('base64');

export function linkWithDiscord() {
  if(process.env.NODE_ENV === 'development') { window.location.href = `${ discord_login_url }?client_id=${ client_id }&redirect_uri=http://localhost:3001/dashboard&response_type=code&scope=${ encodeURI(scope) }`; }
  else { window.location.href = `${ discord_login_url }?client_id=${ client_id }&redirect_uri=${ redirect_uri }&response_type=code&scope=${ encodeURI(scope) }`; }
}

export async function getAccessToken(code) {
  fetch(discord_token_url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    body: `client_id=${client_id}&client_secret=${client_secret}&grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3001/dashboard&scope=${ encodeURI(scope) }`
  })
  .then(async (response) => {
    response = JSON.parse(await response.text());
    if(response.error) { console.log(response); window.location.href = '/dashboard?failed=true'; }
    else {
      localStorage.setItem('DiscordAuth', JSON.stringify(response));
      getDiscordUserInfo(response.access_token);
    }
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

export async function getDiscordGuildInfo() {
  var discordAuth = JSON.parse(localStorage.getItem('DiscordAuth'));
  return await fetch(discord_api_url + `/users/@me/guilds`, {
    method: 'GET',
    headers: new Headers({ 'Authorization': `Bearer ${ discordAuth.access_token }`, 'Content-Type': 'application/x-www-form-urlencoded' })
  })
  .then(async function(response) {
    response = JSON.parse(await response.text());
    if(response.error) { console.log(response.error); return { error: true, reason: response.error } }
    else { return { error: false, guildInfo: response } }
  })
  .catch((error) => { console.log(error); return { error: true, reason: error } });
}

export async function RenewToken() {
  var discordAuth = JSON.parse(localStorage.getItem('DiscordAuth'));
  fetch(`https://discordapp.com/api/oauth2/token`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', }),
    body: `client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${ discordAuth.refresh_token }&redirect_uri=http://localhost:3001/dashboard&scope=${encodeURI(scope)}`
  })
  .then(async (response) => {
    response = JSON.parse(await response.text());
    if(response.error) {
      if(response.error === "invalid_grant") {
        console.log(response);
        //window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24178&response_type=code&state=1';
      }
      else { console.log(response); }
    }
    else {
      localStorage.setItem('DiscordAuth', JSON.stringify(response));
      localStorage.setItem("nextDiscordAuthCheck", new Date().getTime() + 3600000);
      console.log(`Discord Authorization has been renewed!`);
      timers.StartDiscordAuthTimer();
    }
  })
  .catch((error) => { console.error(error); });
}
