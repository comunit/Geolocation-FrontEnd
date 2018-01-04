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

  // send signal to server that new user is connected
  socket.emit('newUser', {
    user: userName
  });
}

function initMap(userName) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: {
      lat: 51.576158,
      lng: 0.090479
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
        user: userName,
      });
      

    // Listen for events
    socket.on('newUser', function (data) {
      usermarker = new google.maps.InfoWindow;
      usermarker.setContent(data.user);
      usermarker.open(map);
    })


      socket.on('location', function (data) {
      var pos = {
        lat: data.lat,
        lng: data.lng
      }
       usermarker.setPosition(pos);
    });
    
    
    var ownmarkerpos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      user: userName,
    }
    // Create user own marker
    ownMarker = new google.maps.InfoWindow;
    ownMarker.setPosition(ownmarkerpos);
    ownMarker.setContent(ownmarkerpos.user);
    ownMarker.open(map);
    map.setCenter(ownmarkerpos);
  }
}