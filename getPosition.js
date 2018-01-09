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

  // Get location of user
  setInterval(function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition)
    } else {
      alert('Geolocation is not supported by this browser');
    }
  }, 10000);


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
      // loop through data coming from server
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        //create a object of users and thier location
        getuser = {
          lat: element.lat,
          lng: element.lng,
          user: element.user,
          id: element.id
        }
        //if user already exists in users update thier locaation else add to user
        let obj = users.find(o => o.id === element.id);
        if (obj == undefined) {
          users.push(getuser);
        } else {
          let obj = users.find((o, i) => {
            //Find index of user using user method.    
            objIndex = users.findIndex((obj => obj.id == element.id));
            //Update object's lat and lng property.
            users[objIndex].lat = element.lat;
            users[objIndex].lng = element.lng;
            users[objIndex].user = element.user;
          });
        }

        var checkUserId = userIds.indexOf(element.id);
        if (checkUserId == -1) {
          userIds.push(element.id)

          for (let i = 0; i < users.length; i++) {
            const mark = users[i];
            test = new google.maps.InfoWindow;
            test.setContent(mark.user);
            test.open(map);
            test.setPosition({lat: mark.lat, lng: mark.lng});
            test.set("id", mark.id);
            markers.push(test);
          }
          console.log(users);
          console.log(markers);
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

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        objIndex = users.findIndex((obj => obj.id == data.disconnetId));
        users.splice(objIndex, 1);
      }
    });
  }
}