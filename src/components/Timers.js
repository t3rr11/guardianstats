/*eslint-disable eqeqeq*/
import * as misc from './Misc';
import * as auth from './requests/BungieAuth';
import * as activities from './pages/Activities';

var AuthTimer = null;
var ActivityWatcher = null;

export async function StopAllTimers() {
  StopTimer('Activity');
}
export async function StopTimer(timer) {
  if(timer == 'Auth') { try { clearInterval(AuthTimer); AuthTimer = null; console.log('Auth Timer Stopped'); } catch (err) { } }
  if(timer == 'Activity') { try { clearInterval(ActivityWatcher); ActivityWatcher = null; console.log('Activity Watcher Stopped'); } catch (err) { } }
}
export async function StartAuthTimer() {
  var tokenExpiresIn;
  tokenExpiresIn = parseInt(localStorage.getItem("NextCheck")) - new Date().getTime();
  tokenExpiresIn = Math.round(tokenExpiresIn / 1000);
  console.log("Access Token expires in: " + misc.formatTime(tokenExpiresIn));
  try { if(AuthTimer != null) { StopTimer('Auth'); } } catch (err) {  }
  console.log('Auth Timer Starting.');
  AuthTimer = setInterval(function() {
    if(tokenExpiresIn == 0){
      StopTimer('Auth');
      auth.RenewToken();
    }
    else {
      tokenExpiresIn--;
      document.getElementById('DevBox').innerHTML = `Access Token expires in: ${ misc.formatTime(tokenExpiresIn) }`;
    }
  }, 1000);
}
export async function StartActivityTimer() {
  try { if(ActivityWatcher != null){ StopTimer('Activity'); } } catch (err) {  }
  console.log('Activity Watcher Started.');
  ActivityWatcher = setInterval(activities.CheckActivityUpdates, 30000);
}
