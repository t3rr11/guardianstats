export const CheckIfPatreon = async (membershipId) => {
  return await fetch('https://api.guardianstats.com/CheckIfPatreon', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ membershipId })
  }).then((response) => response.json()).then(async (response) => { return response; }).catch((err) => { console.log(err); });
};
