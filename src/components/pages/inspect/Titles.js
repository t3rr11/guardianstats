export const Titles = (profileInfo) => {
  return (
    [
      {
        "title": "Wayfarer",
        "isObtained": profileInfo.profileRecords.data.records["2757681677"].objectives[0].complete,
        "icon": "./images/icons/seals/wayfarer",
        "description": "Complete all Destination Triumphs.",
        "hidden": false
      },
      {
        "title": "Dredgen",
        "isObtained": profileInfo.profileRecords.data.records["3798931976"].objectives[0].complete,
        "icon": "./images/icons/seals/dredgen",
        "description": "Complete all Gambit Triumphs.",
        "hidden": false
      },
      {
        "title": "Unbroken",
        "isObtained": profileInfo.profileRecords.data.records["3369119720"].objectives[0].complete,
        "icon": "./images/icons/seals/unbroken",
        "description": "Complete all lifetime Valor and Glory rank triumphs.",
        "hidden": false
      },
      {
        "title": "Shaxx",
        "isObtained": profileInfo.profileRecords.data.records["837071607"].objectives[0].complete,
        "icon": "./images/icons/seals/shaxx",
        "description": "Be among the first to reach the top PvP rank in a season.",
        "hidden": true
      },
      {
        "title": "Chronicler",
        "isObtained": profileInfo.profileRecords.data.records["1754983323"].objectives[0].complete,
        "icon": "./images/icons/seals/chronicler",
        "description": "Complete all Lore Triumphs.",
        "hidden": false
      },
      {
        "title": "Cursebreaker",
        "isObtained": profileInfo.profileRecords.data.records["1693645129"].objectives[0].complete,
        "icon": "./images/icons/seals/cursebreaker",
        "description": "Complete all Dreaming City Triumphs.",
        "hidden": false
      },
      {
        "title": "Wishgranter",
        "isObtained": profileInfo.profileRecords.data.records["1754815776"].objectives[0].complete,
        "icon": "./images/icons/seals/wishgranter",
        "description": "Be among the first to beat Last Wish.",
        "hidden": true
      },
      {
        "title": "Rivensbane",
        "isObtained": profileInfo.profileRecords.data.records["2182090828"].objectives[0].complete,
        "icon": "./images/icons/seals/rivensbane",
        "description": "Complete all Raid Triumphs.",
        "hidden": false
      },
      {
        "title": "Blacksmith",
        "isObtained": profileInfo.profileRecords.data.records["2053985130"].objectives[0].complete,
        "icon": "./images/icons/seals/blacksmith",
        "description": "Complete all Black Armory Triumphs.",
        "hidden": false
      },
      {
        "title": "Golden Armory",
        "isObtained": profileInfo.profileRecords.data.records["3804641932"].objectives[0].complete,
        "icon": "./images/icons/seals/goldenarmory",
        "description": "Complete all Exotic Armory Triumphs.",
        "hidden": true
      },
      {
        "title": "Reckoner",
        "isObtained": profileInfo.profileRecords.data.records["1313291220"].objectives[0].complete,
        "icon": "./images/icons/seals/reckoner",
        "description": "Complete all Jokers Wild Triumphs.",
        "hidden": false
      },
      {
        "title": "Shadow",
        "isObtained": profileInfo.profileRecords.data.records["1883929036"].objectives[0].complete,
        "icon": "./images/icons/seals/shadow",
        "description": "Complete all Season of Opulence Triumphs.",
        "hidden": false
      },
      {
        "title": "MMXIX",
        "isObtained": profileInfo.characterRecords.data[profileInfo.profile.data.characterIds[0]].records["2254764897"].objectives[0].complete,
        "icon": "./images/icons/seals/MMXIX",
        "description": "Complete these feats of strength before 9/17/2019 to claim your unique rewards.",
        "hidden": true
      }
    ]
  )
}
