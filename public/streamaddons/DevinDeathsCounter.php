<!-- Jquery Addon -->
<script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>

<link href="https://fonts.googleapis.com/css?family=Nunito&display=swap" rel="stylesheet">

<!-- Layout -->
<div id="overallDeaths" style="font-weight:bold;font-size:22px;"></div>
<div id="sessionDeaths" style="font-weight:bold;font-size:22px;"></div>
<div id="marvin" style="font-weight:bold;font-size:10px;"></div>

<!-- CSS -->
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
  setInterval(async function(){ await GetDeaths(); console.log('Updated: ' + new Date()); }, 30000);
  async function GetProfileData() {
    return $.ajax({
      url: "https://www.bungie.net/Platform/Destiny2/4/Account/4611686018471776559/Stats/?groups=102",
      method: 'GET',
      headers: { "Content-Type": 'application/x-www-form-urlencoded', "X-API-Key": 'fc1f06b666154eeaa8f89d91f32c23e7' },
    });
  }
  async function GetDeaths() {
    var marvinsLines = [
      'Marvin is love, marvin is life.',
      'We don\'t speak of Gerald.',
      'Who is marvin? Who are you?',
      'Even marvin dies less.',
      'Terrii was here.',
      'How is the music this stream?',
      '#ForeverLiveOnGerald',
      'Why is a building called a building after it\'s been built?',
      'If I agreed with you we\'d both be wrong.',
      'We never really grow up, we only learn how to act in public.',
      'I didn\'t fight my way to the top of the food chain to be a vegetarian',
      'Laugh at your problems, everybody else does.',
      'You do not need a parachute to skydive. You only need a parachute to skydive twice',
      'Just remember…if the world didn\'t suck, we\'d all fall off.',
      'If winning isn’t everything why do they keep score?',
      'Keep the dream alive: Hit the snooze button.'
    ];
    var memberData = await GetProfileData();
    var pveDeaths = memberData.Response.mergedAllCharacters.results.allPvE.allTime.deaths.basic.value;
    var pvpDeaths = memberData.Response.mergedAllCharacters.results.allPvP.allTime.deaths.basic.value;
    var deaths = pveDeaths + pvpDeaths;
    $('#overallDeaths').html('I\'ve died a total of ' + deaths + ' times.');
    if(StartStreamTotalDeaths == 0) { StartStreamTotalDeaths = deaths; }
    else {
      SessionDeaths = deaths - StartStreamTotalDeaths;
      $('#sessionDeaths').html(SessionDeaths + ' of which were this stream!');
      $('#marvin').html(marvinsLines[Math.floor(Math.random() * marvinsLines.length)]);
    }
  }
  GetDeaths();
</script>
