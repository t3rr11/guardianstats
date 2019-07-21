/*eslint-disable eqeqeq*/
export function GetFromStorage(storedItem) { try { return JSON.parse(localStorage.getItem(storedItem)); } catch (err) { return localStorage.getItem(storedItem) } }
export function formatTime(TimeinSeconds) {
  var years, months, weeks, days, hours, minutes, seconds;

  seconds = Math.floor(Number(TimeinSeconds));
  years    = Math.floor(seconds / (24*60*60*7*4.34*12));
  seconds -= Math.floor(years   * (24*60*60*7*4.34*12));
  months   = Math.floor(seconds / (24*60*60*7*4.34));
  seconds -= Math.floor(months  * (24*60*60*7*4.34));
  weeks    = Math.floor(seconds / (24*60*60*7));
  seconds -= Math.floor(weeks   * (24*60*60*7));
  days     = Math.floor(seconds / (24*60*60));
  seconds -= Math.floor(days    * (24*60*60));
  hours    = Math.floor(seconds / (60*60));
  seconds -= Math.floor(hours   * (60*60));
  minutes  = Math.floor(seconds / (60));
  seconds -= Math.floor(minutes * (60));

  var YDisplay, MDisplay, wDisplay, dDisplay, hDisplay, mDisplay, sDisplay;

  YDisplay = years > 0 ? years + (years == 1 ? ' year ' : ' years ') : '';
  MDisplay = months > 0 ? months + (months == 1 ? ' month ' : ' months ') : '';
  wDisplay = weeks > 0 ? weeks + (weeks == 1 ? ' week ' : ' weeks ') : '';
  dDisplay = days > 0 ? days + (days == 1 ? ' day ' : ' days ') : '';
  hDisplay = hours > 0 ? hours + (hours == 1 ? ' hour ' : ' hours ') : '';
  mDisplay = minutes > 0 ? minutes + (minutes == 1 ? ' minute ' : ' minutes ') : '';
  sDisplay = seconds > 0 ? seconds + (seconds == 1 ? ' second ' : ' seconds ') : '';

  if (TimeinSeconds < 60) { return sDisplay; }
  if (TimeinSeconds >= 60 && TimeinSeconds < 3600) { return mDisplay + sDisplay; }
  if (TimeinSeconds >= 3600 && TimeinSeconds < 86400) { return hDisplay + mDisplay; }
  if (TimeinSeconds >= 86400 && TimeinSeconds < 604800) { return dDisplay + hDisplay; }
  if (TimeinSeconds >= 604800 && TimeinSeconds < 2624832) { return wDisplay + dDisplay; }
  if (TimeinSeconds >= 2624832 && TimeinSeconds !== Infinity) { return MDisplay + wDisplay + dDisplay; }
  return YDisplay + MDisplay + wDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
}
export function convertTimeToDate(time){
  var date = new Date(time);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var result = day + '/' + month + '/' + year;
  return result;
}
export function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
export function isJSON(data) { try { JSON.parse(data); } catch (e) { return false; } return true; }
export async function ClearLoadingScreen() {
  //$("#loaderBG").fadeOut( "slow", function() {
    //$("#loaderBG").remove();
  //});
}