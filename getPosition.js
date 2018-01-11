// Get vars
var btn = document.getElementById('btn');
var map = document.getElementById('map');
var container = document.getElementById('container');
var userName = document.getElementById('userName');

//Fire getMap when btn is clicked
btn.addEventListener('click', getMap);

// gep map function to get username and initialize map
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

//Map initialize here
function initMap(userName) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {
      lat: 51.576158,
      lng: 0.090479
    }
  });

  // set vars to store users information and keep track of markers
  var markers = [];
  var users = [];
  var userIds = [];
  var pushDataId = [];

  // Get location of user
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(showPosition)
    } else {
      alert('Geolocation is not supported by this browser');
    }


  //send position to server  every 5 seconds
  function showPosition(position) {
    socket.emit('location', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      user: userName,
      id: socket.id
    });

    //listen for events
    socket.on('location', function (data) {
      var data = data.loc;

      for (var i = 0; i < data.length; i++) {
        var pushData = data[i];

        var objId = pushDataId.find(o => o === pushData.id);
        if (objId == undefined) {
          pushDataId.push(pushData.id);
        }
        var obj = users.find(o => o.id === pushData.id);
        if (obj == undefined) {
          users.push(pushData)
        }

        let user = users.find((o, i) => {
          //Find index of lat and lng using using findIndex method.    
          objIndex = users.findIndex((user => user.id == pushData.id));
          //Update userslat and lng property.
          users[objIndex].lat = pushData.lat;
          users[objIndex].lng = pushData.lng;
          users[objIndex].user = pushData.user;
        });
      }
    });

    setInterval(function () {
      //Loop through users and create marker 
      for (let i = 0; i < users.length; i++) {
        for (let i = 0; i < pushDataId.length; i++) {
          var pushDataIds = pushDataId[i];
          var checkUserId = userIds.indexOf(pushDataIds);
          if (checkUserId == -1) {
            const mark = users[i];
            userIds.push(pushDataIds)
            test = new google.maps.InfoWindow;
            test.setContent(mark.user);
            test.open(map);
            test.setPosition({
              lat: mark.lat,
              lng: mark.lng
            });
            test.set("id", mark.id);
            markers.push(test);
          }
        }
      }
    }, 5000);

    // Handle Disconnted User
    socket.on('disconnectId', function (data) {
      for (let i = 0; i < markers.length; i++) {
        const element = markers[i];
        if (data.disconnetId == element.id) {
          markers[i].setMap(null);
        }
      }


      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        objIndex = users.findIndex((obj => obj.id == data.disconnetId));
        users.splice(objIndex, 1);
      }

      for (let i = 0; i < pushDataId.length; i++) {
        const id = pushDataId[i];
        if (id == data.disconnetId) {
          pushDataId.splice(i, 1);
        }
      }
    });
  }
}