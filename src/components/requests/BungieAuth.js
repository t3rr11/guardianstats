import * as timers from '../Timers';
import * as bungie from './BungieReq';

const encodedAuth = 'Basic ' + new Buffer('24178:KneOjNrkLFQj0RfeeSJjZnQbEa6oqOnfhCw2E7gZl8E').toString('base64');

export async function GetAuthentication(code) {
  fetch(`https://www.bungie.net/platform/app/oauth/token/`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-API-Key': 'fc1f06b666154eeaa8f89d91f32c23e7',
      'Authorization': encodedAuth
    }),
    body: `grant_type=authorization_code&code=${code}`
  })
  .then(async (response) => {
    response = JSON.parse(await response.text());
    if(response.error) { console.log(response); window.location.href = '/failed'; }
    else {
      localStorage.setItem('Authorization', JSON.stringify(response));
      localStorage.setItem("NextCheck", new Date().getTime() + 3600000);
      SetCurrentBungieNetUser();
    }
  })
  .catch((error) => { console.error(error); });
}

export const BearerHeaders = (access_token) => {
  return {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-API-Key": "fc1f06b666154eeaa8f89d91f32c23e7",
    "Authorization": `Bearer ${ access_token }`
  };
}

export async function SetCurrentBungieNetUser() {
  fetch(`https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/`, {
    method: 'GET',
    headers: BearerHeaders(JSON.parse(localStorage.getItem('Authorization')).access_token)
  })
  .then(async (response) =>  {
    response = JSON.parse(await response.text());
    localStorage.setItem('BungieAccount', JSON.stringify(response.Response));
    localStorage.setItem('SelectedAccount', 'Please Select Platform');
    window.location.href = '/';
  })
  .catch((error) => { console.error(error); });
}

export async function SetCurrentMembershipInfo(membershipId, membershipType) {
  await fetch(`https://bungie.net/Platform/User/GetMembershipsById/${ membershipId }/${ membershipType }/`, {
    method: 'GET',
    headers: { "Content-Type": "application/x-www-form-urlencoded", "X-API-Key": "fc1f06b666154eeaa8f89d91f32c23e7" }
  })
  .then(async (response) =>  {
    response = JSON.parse(await response.text());
    for(var i in response.Response.destinyMemberships){
      if(response.Response.destinyMemberships[i].membershipType == membershipType) {
        const basicInfo = {
          "displayName": response.Response.destinyMemberships[i].displayName,
          "membershipId": response.Response.destinyMemberships[i].membershipId,
          "membershipType": response.Response.destinyMemberships[i].membershipType
        }
        localStorage.setItem('BasicMembershipInfo', JSON.stringify(basicInfo));
        const profileInfo = await bungie.GetProfile(basicInfo.membershipType, basicInfo.membershipId, '100,200');
        const characters = profileInfo.characters.data;
        var lastOnlineCharacter = 0;
        for(var i in characters) { if(new Date(characters[i].dateLastPlayed) > lastOnlineCharacter) { lastOnlineCharacter = characters[i]; } }
        if(localStorage.getItem('SelectedCharacter') === null) { localStorage.setItem('SelectedCharacter', lastOnlineCharacter.characterId); }
        localStorage.setItem('ProfileInfo', JSON.stringify(profileInfo));
      }
    }
  })
  .catch((error) => { console.error(error); });
}

export async function CheckAuth() {
  fetch(`https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/`, {
    method: 'GET',
    headers: BearerHeaders(JSON.parse(localStorage.getItem('Authorization')).access_token)
  })
  .then(async (response) => {
    if(response.status === 401){ RenewToken(JSON.parse(localStorage.getItem('Authorization')).refresh_token); return; }
    else {
      response = JSON.parse(await response.text());
      if(response.error) { console.log(response); }
    }
  })
  .catch((error) => { console.error(error); });
}

export async function RenewToken(refresh_token) {
  fetch(`https://www.bungie.net/platform/app/oauth/token/`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-API-Key': 'fc1f06b666154eeaa8f89d91f32c23e7',
      'Authorization': encodedAuth
    }),
    body: `grant_type=refresh_token&refresh_token=${ refresh_token }`
  })
  .then(async (response) => {
    response = JSON.parse(await response.text());
    if(response.error) { console.log(response); }
    else {
      localStorage.setItem('Authorization', JSON.stringify(response));
      localStorage.setItem("NextCheck", new Date().getTime() + 3600000);
      console.log(`Authorization has been renewed!`);
      timers.StartAuthTimer();
    }
  })
  .catch((error) => { console.error(error); });
}
