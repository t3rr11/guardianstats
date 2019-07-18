export async function GetAuthentication(code) {
  const encodedAuth = 'Basic ' + new Buffer('24048:oSj5RgkwtiqxdsDUaEH4H0bmIj-vggwGMmzc9XnAs0A').toString('base64');
  fetch(`https://www.bungie.net/platform/app/oauth/token/`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-API-Key': '1b83a7bc78324068bb068ca8197ca3bf',
      'Authorization': encodedAuth
    }),
    body: `grant_type=authorization_code&code=${code}`
  })
  .then((response) => response.text())
  .then((responseText) => {
    const response = JSON.parse(responseText);
    if(response.error) { window.location.href = '/failed'; }
    else { localStorage.setItem('Authorization', JSON.stringify(response)); window.location.href = '/'; }
  })
  .catch((error) => { console.error(error); });
}

export const BearerHeaders = (access_token) => {
  return {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-API-Key": "1b83a7bc78324068bb068ca8197ca3bf",
    "Authorization": `Bearer ${ access_token }`
  };
}

export async function CheckAuth() {
  fetch(`https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/`, {
    method: 'GET',
    headers: BearerHeaders(JSON.parse(localStorage.getItem('Authorization')).access_token)
  })
  .then((response) => response.text())
  .then((responseText) => {
    try {
      const response = JSON.parse(responseText);
      if(response.error) { console.log(response); }
      else { console.log(response); }
    }
    catch(err) { console.log(`Error: ${ responseText }`); return; }
  })
  .catch((error) => { console.error(error); });
}
