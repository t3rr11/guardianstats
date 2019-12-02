<head>
  <!-- Jquery Addon -->
  <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
  <link href="https://fonts.googleapis.com/css?family=Nunito&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Layout -->
  <div id="trackedObjectives"></div>

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
      border: 1px darkgray solid;
      width: fit-content;
      padding: 5px;
      margin: 5px;
    }
  </style>

  <!-- Work -->
  <script>
    var hasShown = false;
    var manifestObjectives = $.ajax({ url: "jsons/manifestObjectives.json", method: 'GET', dataType: 'json' });
    var manifestItems = $.ajax({ url: "jsons/manifestItems.json", method: 'GET', dataType: 'json' });
    setInterval(async function(){ await GetRecords(); console.log('Updated: ' + new Date()); }, 30000);
    function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
    async function GetRecords() {
      var progressions = await $.ajax({ url: "https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018471334813/Character/2305843009305397220/?components=202", method: 'GET', headers: { "Content-Type": 'application/x-www-form-urlencoded', "X-API-Key": 'fc1f06b666154eeaa8f89d91f32c23e7' } });
      var trackedProgressions = [1284302942];
      $('#trackedObjectives').html("");
      for(i in trackedProgressions) {
        $('#trackedObjectives').append(
          `<div id="${ trackedProgressions[i] }" class="objectiveContainer">
            ${ manifestItems.responseJSON[trackedProgressions[i]].displayProperties.name }
          </div>`
        );
        var objective = progressions.Response.progressions.data.uninstancedItemObjectives[trackedProgressions[i]];
        for(j in objective) {
          $(`#${ trackedProgressions[i] }`).append(
            `<div id="${ objective[j].objectiveHash }" style="color:${ objective[j].progress >= objective[j].completionValue ? 'lime' : 'tomato' }">
              ${ manifestObjectives.responseJSON[objective[j].objectiveHash].progressDescription } - ${ numberWithCommas(objective[j].progress) } / ${ numberWithCommas(objective[j].completionValue) }
            </div>`
          );
        }
      }
      if(!hasShown) { console.log(progressions); hasShown = true; }
    }
    GetRecords();
  </script>
</body>
