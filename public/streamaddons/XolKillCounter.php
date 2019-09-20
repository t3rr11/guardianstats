<!-- Jquery Addon -->
<script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>

<!-- Layout -->
<div id="xolNightfalls" style="font-weight:bold;font-size:25px;"></div>
<div id="killsNightfalls" style="font-weight:bold;font-size:25px;"></div>

<style>
  body {
    margin:5px;
    font-family: 'Nunito', sans-serif;
    color: orange;
  }
</style>

<!-- Work -->
<script>
  var StartStreamTotalDeaths = 0;
  var SessionDeaths = 0;
  setInterval(async function(){ await LoadActivityData(); console.log('Updated: ' + new Date()); }, 30000);
  async function GetActivityData() {
    return $.ajax({
      url: "https://www.bungie.net/Platform/Destiny2/4/Account/4611686018471334813/Character/2305843009305397220/Stats/Activities/?count=250&mode=0&page=0",
      method: 'GET',
      headers: { "Content-Type": 'application/x-www-form-urlencoded', "X-API-Key": 'fc1f06b666154eeaa8f89d91f32c23e7' },
    });
  }
  async function LoadActivityData() {
    var activityData = (await GetActivityData()).Response.activities;
    var xolNightfalls = 0;
    var kills = 0;
    for(var i in activityData) {
      if(activityData[i].activityDetails.directorActivityHash === 272852450) {
        if(new Date(activityData[i].period).getTime() > new Date("2019-09-04T00:32:34Z").getTime()) {
          if(activityData[i].values.completed.basic.displayValue === "Yes") {
            xolNightfalls++;
            kills = kills + activityData[i].values.kills.basic.value;
          }
        }
      }
    }
    $('#xolNightfalls').html(`Xol\'s Killed: ${ xolNightfalls }`);
    $('#killsNightfalls').html(`Hive Killed: ${ kills }`);
  }
  LoadActivityData();
</script>
