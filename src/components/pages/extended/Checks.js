export async function checkPlatform() {
  if(localStorage.getItem('SelectedAccount') !== 'Please Select Platform') {
    console.log('Has not selected platform');
    return true;
  }
  else {
    console.log('Has selected');
    return false;
  }
}
