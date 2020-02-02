import * as timers from '../Timers';
import * as bungie from './BungieReq';
import * as Misc from '../Misc';

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
    if(response.error) {
      console.log(response);
      window.location.href = '/failed';
    }
    else {
      localStorage.setItem('Authorization', JSON.stringify(response));
      localStorage.setItem("nextManifestCheck", new Date().getTime() + 3600000);
      SetMembershipsForCurrentUser();
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

export async function SetMembershipsForCurrentUser() {
  fetch(`https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/`, {
    method: 'GET',
    headers: BearerHeaders(JSON.parse(localStorage.getItem('Authorization')).access_token)
  })
  .then(async (response) =>  {
    const destinyMemberships = JSON.parse(await response.text()).Response.destinyMemberships;
    if(destinyMemberships.length === 0) {
      //No accounts were found. Really not sure what to do here tbh, return an error somehow would work.
      console.log("No accounts found: " + response);
    }
    else if(destinyMemberships.length === 1) {
      //Easy just assign that first account as the one that is selected.
      localStorage.setItem('DestinyMemberships', JSON.stringify(destinyMemberships));
      localStorage.setItem('SelectedAccount', JSON.stringify({"platform": Misc.getPlatformName(destinyMemberships[0].membershipType), "name": destinyMemberships[0].displayName, "id": destinyMemberships[0].membershipId}));
      await bungie.GetProfile(destinyMemberships[0].membershipType, destinyMemberships[0].membershipId, '100,200').then(profile => { localStorage.setItem('ProfileInfo', JSON.stringify(profile)); });
    }
    else {
      //More than 1 account found. Filter through them to remove any that are not associated with Destiny 2.
      var accounts = [];
      for(var i in destinyMemberships) {
        //Check for good error code responses.
        var validAccountCheck = await bungie.GetProfile(destinyMemberships[i].membershipType, destinyMemberships[i].membershipId, '100,200').then(acc => { if(acc !== undefined) { return true } else { return false } });
        if(validAccountCheck) { accounts.push(destinyMemberships[i]); }
      }
      //Once filtered through save them in localStorage and recheck how many remain.
      localStorage.setItem('DestinyMemberships', JSON.stringify(accounts));
      if(accounts.length === 0) {
        //No accounts were found. Really not sure what to do here tbh, return an error somehow would work.
        console.log("No accounts found");
      }
      else if(accounts.length === 1) {
        //Easy just assign that first account as the one that is selected.
        localStorage.setItem('SelectedAccount', JSON.stringify({"platform": Misc.getPlatformName(destinyMemberships[0].membershipType), "name": destinyMemberships[0].displayName, "id": destinyMemberships[0].membershipId}));
        await bungie.GetProfile(destinyMemberships[0].membershipType, destinyMemberships[0].membershipId, '100,200').then(profile => { localStorage.setItem('ProfileInfo', JSON.stringify(profile)); });
      }
      else { localStorage.setItem('SelectedAccount', 'Please Select Platform'); }
      window.location.href = '/';
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
    if(response.error) {
      if(response.error === "invalid_grant") { window.location.href = 'https://www.bungie.net/en/oauth/authorize?client_id=24178&response_type=code&state=1'; }
      else { console.log(response); }
    }
    else {
      localStorage.setItem('Authorization', JSON.stringify(response));
      localStorage.setItem("nextAuthCheck", new Date().getTime() + 3600000);
      console.log(`Authorization has been renewed!`);
      timers.StartAuthTimer();
    }
  })
  .catch((error) => { console.error(error); });
}
