var btn = document.getElementById('btn');
var map = document.getElementById('map');
var container = document.getElementById('container');
var userName = document.getElementById('userName');
btn.addEventListener('click', getMap);

function getMap() {
  container.style.display = "none";
  map.style.display = "block";
  userName = userName.value;
  initMap(userName);
}

function initMap(userName) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: {
      lat: -34.397,
      lng: 150.644
    }
  });

  //Get the current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  } else {
    alert('Geolocation is not supported by this browser');
  }

  function showPosition(position) {
    
    //Send Position to server
    socket.emit('location', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      user: userName
    });

    // Listen for events
    socket.on('location', function (data) {
      var pos = {
        lat: data.lat,
        lng: data.lng
      }
      usermarker = new google.maps.InfoWindow;
      usermarker.setPosition(pos);
      usermarker.setContent(data.user);
      usermarker.open(map);
      map.setCenter(pos);
    });
  }
}