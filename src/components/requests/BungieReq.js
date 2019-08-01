async function apiRequest(path, isStat, isAuthRequired) {
  //Headers for requests
  var headers, authHeaders = null;
  try { headers = { headers: { "X-API-Key": "1b83a7bc78324068bb068ca8197ca3bf", "Content-Type": "application/json" } } } catch (err) { headers = {  }; }
  try { authHeaders = { headers: { "X-API-Key": "1b83a7bc78324068bb068ca8197ca3bf", "Content-Type": "application/json", "Authorization": `Bearer ${ JSON.parse(localStorage.getItem('Authorization')).access_token }` } } } catch (err) { authHeaders = { }; }

  const request = await fetch(`https://${isStat ? 'stats' : 'www'}.bungie.net${path}`, isAuthRequired ? authHeaders : headers);
  const response = await request.json();
  if(request.ok && response.ErrorCode && response.ErrorCode !== 1) {
    //Error with bungie, might have sent bad headers.
    console.log(`Error: ${ JSON.stringify(response) }`);
  }
  else if(request.ok) {
    //Everything is ok, request was returned to sender.
    return response.Response;
  }
  else {
    //Error in request ahhhhh!
    console.log(`Error: ${ JSON.stringify(response) }`);
  }
}

export const GetProfile = async (membershipType, membershipId, components) => apiRequest(`/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=${components}`, false, false);
export const GetActivityHistory = async (membershipType, membershipId, characterId, count, mode, page = 0) => apiRequest(`/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/?count=${count}&mode=${mode}&page=${page}`, false, false);
export const GetPGCR = async (instanceId) => apiRequest(`/Platform/Destiny2/Stats/PostGameCarnageReport/${instanceId}/`, true, false);
export const GetManifestVersion = async () => apiRequest(`/Platform/Destiny2/Manifest/`, false, false);
export const GetManifest = async url => fetch(`https://www.bungie.net${url}`).then(a => a.json());
export const SearchUsers = async username => apiRequest(`/Platform/User/SearchUsers/?q=${username}`, false, false);
