import * as bungie from '../requests/BungieReq';

export async function GetProfile() {
  await bungie.GetProfile('4', '4611686018471334813', '200,202,600,800').then(
    (result) => {
      const data = { hasProfileLoaded: true, profile: result }
      console.log(data);
      return data;
    },
    (error) => {
      const data = { hasProfileLoaded: true, error: error }
      console.log(data);
      return data;
    }
  );
}
