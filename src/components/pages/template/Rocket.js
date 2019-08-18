Rocket() {
  var screen = document.getElementById('page-content');
  var rocket = document.getElementById('rocket');

  var spaceW = window.screen.height - rocket.style.height;
  var spaceH =  window.screen.width - rocket.style.width;

  rocket.style.top = Math.round(Math.random() * spaceW) + "px";
  rocket.style.left = Math.round(Math.random() * spaceH) + "px";
  rocket.style.transform = ("rotate(" + Math.floor(Math.random() * 360) + "deg)");
}
