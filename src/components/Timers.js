/*eslint-disable eqeqeq*/
import * as Misc from './Misc';
import * as auth from './requests/BungieAuth';
import * as dAuth from './requests/DiscordAuth';

var AuthTimer = null;
var DiscordAuthTimer = null;

export async function StopAllTimers() {
  StopTimer('Activity');
}
export async function StopTimer(timer) {
  if(timer == 'Auth') { try { clearInterval(AuthTimer); AuthTimer = null; console.log('Auth Timer Stopped'); } catch (err) { } }
  if(timer == 'DiscordAuth') { try { clearInterval(DiscordAuthTimer); DiscordAuthTimer = null; console.log('Discord Auth Timer Stopped'); } catch (err) { } }
}
export async function StartAuthTimer() {
  if(localStorage.getItem("nextAuthCheck")) {
    var tokenExpiresIn;
    tokenExpiresIn = parseInt(localStorage.getItem("nextAuthCheck")) - new Date().getTime();
    tokenExpiresIn = Math.round(tokenExpiresIn / 1000);
    console.log("Access Token expires in: " + Misc.formatTime(tokenExpiresIn));
    try { if(AuthTimer != null) { StopTimer('Auth'); } } catch (err) {  }
    console.log('Auth Timer Starting.');
    AuthTimer = setInterval(function() {
      if(tokenExpiresIn <= 0){
        StopTimer('Auth');
        auth.RenewToken(JSON.parse(localStorage.getItem('Authorization')).refresh_token);
      }
      else {
        tokenExpiresIn--;
      }
    }, 1000);
  }
  else {
    StopTimer('Auth');
    auth.RenewToken(JSON.parse(localStorage.getItem('Authorization')).refresh_token);
  }
}

export async function StartDiscordAuthTimer() {
  if(!Misc.getURLVars()["code"]) {
    if(localStorage.getItem("nextDiscordAuthCheck")) {
      var tokenExpiresIn;
      tokenExpiresIn = parseInt(localStorage.getItem("nextDiscordAuthCheck")) - new Date().getTime();
      tokenExpiresIn = Math.round(tokenExpiresIn / 1000);
      console.log("Discord Access Token expires in: " + Misc.formatTime(tokenExpiresIn));
      try { if(DiscordAuthTimer != null) { StopTimer('DiscordAuth'); } } catch (err) {  }
      console.log('Discord Auth Timer Starting.');
      DiscordAuthTimer = setInterval(function() {
        if(tokenExpiresIn <= 0){
          StopTimer('DiscordAuth');
          dAuth.RenewToken();
        }
        else {
          tokenExpiresIn--;
        }
      }, 1000);
    }
    else {
      StopTimer('DiscordAuth');
      dAuth.RenewToken();
    }
  }
}
