export async function startUpPageChecks() {
  if(! await checkPlatform()){ return "You have not yet selected your platform." }
  return "Checks OK";
}

export async function checkPlatform() {
  if(localStorage.getItem('SelectedAccount') !== 'Please Select Platform') { return true; }
  else { return false; }
}
