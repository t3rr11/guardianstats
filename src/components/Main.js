import * as timers from './Timers';

const isFirstLoad = function() { if(!localStorage.getItem("firstLoad")){ localStorage.setItem("firstLoad", 'false'); return true; } else { return false; } }
const hasLoggedIn = function() { if(!localStorage.getItem("Authorization")){ return false; } else { return true; } }

async function FirstStart() { LoadPage('Login'); }
async function NeedsLogin() { LoadPage('Login'); }

export async function StartLoading() {
  //Check first load.
  if(isFirstLoad()) { FirstStart(); }
  else {
    //Check if has logged in at any stage.
    if(!hasLoggedIn()) { NeedsLogin(); }
    else {
      if(CheckAuth()) {
        //All checks complete and has working access code.
        console.log("Access Token is healthy!");
        timers.StartAuthTimer();
        LoadPage();
      }
      else {
        //Auth has expired, Will attempt to renew token.
        console.log("Auth has expired, Renewing...");
        //Attempt to renew token, if failed then ask for auth again.
        try { await RenewToken(); } catch (err) {
          window.location.href = "https://www.bungie.net/en/oauth/authorize?client_id=24048&response_type=code&state=1"; return;
        }
        //Once aqquired new access token, will restart the loading process and run checks again.
        StartLoading();
      }
    }
  }
}

export async function CheckAuth() {

}

export async function RenewToken() {

}

export async function LoadPage(page) {
  if(page) { console.log(`Loaded: ${ page }`); }
  else { console.log(`Loaded page from storage.`); }
}
