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
export const GetHistoricStatsForAccount = async (membershipType, membershipId) => apiRequest(`/Platform/Destiny2/${membershipType}/Account/${membershipId}/Stats/?groups=101`, false, false);
export const GetPGCR = async (instanceId) => apiRequest(`/Platform/Destiny2/Stats/PostGameCarnageReport/${instanceId}/`, true, false);
export const GetManifestVersion = async () => apiRequest(`/Platform/Destiny2/Manifest/`, false, false);
export const GetManifest = async url => fetch(`https://www.bungie.net${url}`).then(a => a.json());
export const SearchUsers = async username => apiRequest(`/Platform/User/SearchUsers/?q=${username}`, false, false);
export const GetMembershipId = async platformName => apiRequest(`/Platform/Destiny2/SearchDestinyPlayer/-1/${ platformName }/`, false, false);
export const GetMembershipsForCurrentUser = async () => apiRequest(`/Platform/User/GetMembershipsForCurrentUser/`, false, true);
export const GetMembershipsById = async (userId, platform) => apiRequest(`/Platform/User/GetMembershipsById/${userId}/${platform}/`, false, false);
export const GetInstancedItem = async (membershipId, instancedItemId, components) => apiRequest(`/Platform/Destiny2/4/Profile/${membershipId}/Item/${instancedItemId}/?components=${components}`, false, false);
export const GetSpecificModeStats = async (membershipId, characterId, modes) => apiRequest(`/Platform/Destiny2/4/Account/${membershipId}/Character/${characterId}/Stats/?groups=101&modes=${modes}&periodType=2`, false, false)
