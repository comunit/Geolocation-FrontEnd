function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: {
      lat: -34.397,
      lng: 150.644
    }
  });
  infoWindow = new google.maps.InfoWindow;

  //Get the current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  } else {
    alert('Geolocation is not supported by this browser');
  }

  function showPosition(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    infoWindow.setPosition(pos);
    infoWindow.setContent('You are here');
    infoWindow.open(map);
    map.setCenter(pos);

    //Send Position to server
    socket.emit('location', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });

    // Listen for events
    socket.on('location', function (data) {
      var pos = {
        lat: data.lat,
        lng: data.lng
      }
      usermarker = new google.maps.InfoWindow;
      usermarker.setPosition(pos);
      usermarker.setContent('Someone Else');
      usermarker.open(map);
      map.setCenter(pos);
    });
  }
}