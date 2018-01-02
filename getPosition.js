function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: {lat: -34.397, lng: 150.644}
  });
  infoWindow = new google.maps.InfoWindow;

    //Get the current location
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition)
      } else {
        alert('Geolocation is not supported by this browser');
      }
    
    function showPosition(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here');
      infoWindow.open(map);
      map.setCenter(pos);
    }
}
