async function apiRequest(path, isStat, isAuthRequired) {
  //Headers for requests
  const headers = { headers: { "X-API-Key": '1b83a7bc78324068bb068ca8197ca3bf', 'Content-Type': 'application/json' } };
  const authHeaders = { headers: { "Authorization": `Bearer` } }

  const request = await fetch(`https://${isStat ? 'stats' : 'www'}.bungie.net${path}`, isAuthRequired ? authHeaders : headers);
  const response = await request.json();
  if(request.ok && response.ErrorCode && response.ErrorCode !== 1) {
    //Error with bungie, might have sent bad headers.
    console.log(`Error: ${response}`);
  }
  else if(request.ok) {
    //Everything is ok, request was returned to sender.
    return response.Response;
  }
  else {
    //Error in request ahhhhh!
    console.log(`Error: ${response}`);
  }
}

export const GetProfile = async (membershipType, membershipId, components, auth = false) => apiRequest(`/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=${components}`, false, false);
export const GetManifestVersion = async () => apiRequest(`/Platform/Destiny2/Manifest/`, false, false);
export const GetManifest = async url => fetch(`https://www.bungie.net${ url }`).then(a => a.json());
