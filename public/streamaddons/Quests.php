<head>
  <!-- Jquery Addon -->
  <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
  <link href="https://fonts.googleapis.com/css?family=Nunito&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Layout -->
  <div id="tracked"></div>
  <div id="progressions"></div>
  <div id="factions"></div>
  <div id="milestones"></div>
  <div id="checklists"></div>
  <div id="uninstancedItemObjectives"></div>
  <div id="quests"></div>

  <!-- CSS -->
  <style>
    body {
      margin:5px;
      font-family: 'Nunito', sans-serif;
      color: darkgray;
      font-weight:bold;
      font-size:22px;
    }
    .objectiveContainer {
      display: inline-block;
      align-items: top;
      border: 1px darkgray solid;
      width: fit-content;
      padding: 5px;
      margin: 5px;
    }
  </style>

  <!-- Work -->
  <script>
    var hasShown = false;
    var ManifestItems = null;
    var ManifestObjectives = null;
    var Progressions = null;
    async function SetManifestInfo() {
      const Manifest = await $.ajax({ url: `https://www.bungie.net/Platform/Destiny2/Manifest/`, method: 'GET', headers: { "Content-Type": 'application/x-www-form-urlencoded', "X-API-Key": "fc1f06b666154eeaa8f89d91f32c23e7" } });
      ManifestItems = await $.ajax({ url: `https://cors-anywhere.herokuapp.com/https://www.bungie.net${ Manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemLiteDefinition }`, method: 'GET', headers: { "Content-Type": 'application/x-www-form-urlencoded', "X-API-Key": "fc1f06b666154eeaa8f89d91f32c23e7" } });
      ManifestObjectives = await $.ajax({ url: `https://cors-anywhere.herokuapp.com/https://www.bungie.net${ Manifest.Response.jsonWorldComponentContentPaths.en.DestinyObjectiveDefinition }`, method: 'GET', headers: { "Content-Type": 'application/x-www-form-urlencoded', "X-API-Key": "fc1f06b666154eeaa8f89d91f32c23e7" } });
    }
    async function GetProfile() {
      var profile = await $.ajax({ url: "https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018471334813/Character/2305843009305397220/?components=202", method: 'GET', headers: { "Content-Type": 'application/x-www-form-urlencoded', "X-API-Key": 'fc1f06b666154eeaa8f89d91f32c23e7' } });
      Progressions = profile.Response.progressions.data;
      if(!hasShown) { console.log(profile); hasShown = true; }
    }
    async function GetUninstancedQuests() {
      var uninstancedItemObjectives = Progressions.uninstancedItemObjectives;
      $('#uninstancedItemObjectives').html("");
      for(i in uninstancedItemObjectives) {
        $('#uninstancedItemObjectives').append(
          `<div id="${ i }" class="objectiveContainer">
            ${ ManifestItems[i].displayProperties.name }
          </div>`
        );
        var objectives = uninstancedItemObjectives[i];
        for(j in objectives) {
          $(`#${ i }`).append(
            `<div id="${ objectives[j].objectiveHash }" style="color:${ objectives[j].progress >= objectives[j].completionValue ? 'lime' : 'tomato' }">
              ${ ManifestObjectives[objectives[j].objectiveHash].progressDescription } - ${ numberWithCommas(objectives[j].progress) } / ${ numberWithCommas(objectives[j].completionValue) }
            </div>`
          );
        }
      }
    }
    SetManifestInfo();
    setInterval(async function(){ await GetProfile(); GetUninstancedQuests(); console.log('Updated: ' + new Date()); }, 10000);
    function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  </script>
</body>
