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
    zoom: 10,
    center: {
      lat: 51.576158,
      lng: 0.090479
    }
  });

  var userIds = [];
  var markers = [];
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
      id: socket.id
    });

    socket.on('location', function (data) {

      var data = data.loc;
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        var checkUserId = userIds.indexOf(element.id);

        if (checkUserId == -1) {
          userIds.push(element.id)
          var pos = {
            lat: element.lat,
            lng: element.lng,
          }
          test = new google.maps.InfoWindow;
          test.setContent(element.user);
          test.open(map);
          test.setPosition(pos);
          test.set("id", element.id);
          markers.push(test);
        }
      }
    });

    // Handle Disconnted User
    socket.on('disconnectId', function (data) {
      for (let i = 0; i < markers.length; i++) {
            const element = markers[i];
            if (data.disconnetId == element.id) {
              markers[i].setMap(null);
            }
          }
    });
  }
}