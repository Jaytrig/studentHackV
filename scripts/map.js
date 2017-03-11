(function() {

  mapboxgl.accessToken = 'pk.eyJ1IjoibW9ydG9uZXkiLCJhIjoiY2owNGoxZm9pMDBiYzJxbmxiM2p2cG4zYSJ9.Nhvw9Lp7DZ0gXHAcoCvqiQ';
  var startPoints = [-2.23834, 53.4760];
  // var endPoint = [-2.23834, 53.4760];
  var endPoint = [-2.243101, 53.487354]
  map = new mapboxgl.Map({
        style: 'mapbox://styles/mortoney/cj050mkjg00cf2snyrp55bjxq',
        center: startPoints,
        zoom: 19,
        pitch: 185,
        bearing: -17.6,
        container: 'map',
        interactive: false
  });

  var d = distanceTwoPoints(startPoints[1], startPoints[0], endPoint[1], endPoint[0]);
  $('#distanceTag').text(d +' KM Left');


  map2 = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/streets-v10',
      center: startPoints,
      zoom: 12,
      bearing: -17.6,
      container: 'smallmap',
      interactive: false
  });

  var el = document.createElement('div');
  el.className = 'marker';
  el.style.background = 'red';
  el.style.width = '5px';
  el.style.height = '5px';

  var endMarker1 = document.createElement('div');
  endMarker1.className = 'endMarker2';
  endMarker1.style.backgroundImage = "url('./img/little_man.png')";
  endMarker1.style.width = '80px';
  endMarker1.style.height = '120px';
  endMarker1.style.backgroundSize=  'cover';                      /* <------ */
  endMarker1.style.backgroundRepeat= 'no-repeat';
  endMarker1.style.backgroundPosition= 'center center';

  var endMarker2 = document.createElement('div');
  endMarker2.className = 'endMarker1';
  endMarker2.style.backgroundImage = "url('./img/little_man.png')";
  endMarker2.style.width = '20px';
  endMarker2.style.height = '30px';
  endMarker2.style.backgroundSize=  'cover';                      /* <------ */
  endMarker2.style.backgroundRepeat= 'no-repeat';
  endMarker2.style.backgroundPosition= 'center center';

  var endpointMarkerMap2 = new mapboxgl.Marker(endMarker2)
                            .setLngLat(endPoint)
                            .addTo(map2);

  var endpointMarkerMap1 = new mapboxgl.Marker(endMarker1)
                            .setLngLat(endPoint)
                            .addTo(map);

  var smallmapMarker = new mapboxgl.Marker(el)
                            .setLngLat(startPoints)
                            .addTo(map2);

  // the 'building' layer in the mapbox-streets vector source contains building-height
  // data from OpenStreetMap.
  map.on('load', function() {
      map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': {
                  'type': 'identity',
                  'property': 'height'
              },
              'fill-extrusion-base': {
                  'type': 'identity',
                  'property': 'min_height'
              },
              'fill-extrusion-opacity': .5
          }
      });
  });
  // pixels the map pans when the up or down arrow is clicked
      var deltaDistance = 30;

      // degrees the map rotates when the left or right arrow is clicked
      var deltaDegrees = 5;
      var onRoad;
      var dataLeft =[];
      var dataRight= [];
      var dataFront = [];


      function easing(t) {
          var data = map.queryRenderedFeatures([window.innerWidth / 2, window.innerHeight / 2]);
          var centerCor = map.getCenter();

          map2.setCenter(centerCor);
          smallmapMarker.setLngLat(centerCor);


          var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
          onRoad = false;
          if(data.length !== 0){
              var isRoad = data[0].layer['source-layer'];
              onRoad = isRoad.includes('road');
              dataLeft = [];
              dataRight = [];
              dataFront = [];
          }else{

              dataFront = numbers.map(function(num) {
              var front = map.queryRenderedFeatures([(window.innerWidth / 2), (window.innerHeight / 2)+num]);
              if(front.length !== 0){
                  return front[0].layer['source-layer'].includes('road');
                }
            });


            dataLeft = numbers.map(function(num) {
              var left = map.queryRenderedFeatures([(window.innerWidth / 2) - num, window.innerHeight / 2]);
              if(left.length !== 0){
                  return left[0].layer['source-layer'].includes('road');
                }
            });

            dataRight = numbers.map(function(num) {
              var right = map.queryRenderedFeatures([(window.innerWidth / 2) + num, window.innerHeight / 2]);
              if(right.length !== 0){
                return right[0].layer['source-layer'].includes('road');
              }
            });
          }


          return t * (2 - t);
      }


       var keyMap = {38: false, 40: false, 39: false, 37: false};

      map.on('load', function() {
          

          map.getCanvas().addEventListener('keydown', function(e) {
              e.preventDefault();

              if (e.keyCode in keyMap) {
                  keyMap[e.keyCode] = true;
                  if (keyMap[38] && keyMap[37]) {
                     
                  }
                  else if (keyMap[38] && keyMap[39]) {
                      // UP RIGTH
                  }
                  else if (keyMap[40] && keyMap[37]) {
                      // DOWN LEFT
                  }
                  else if (keyMap[40] && keyMap[39]) {
                      // DOWN RIGTH
                  }
                  else if (keyMap[40]) {
                      map.panBy([0, deltaDistance], {
                      easing: easing
                      });
                      deltaDistance=30;
                  }
                  else if (keyMap[38]) {
                      deltaDegrees = 5

                      if(!!onRoad || dataRight.includes(true) || dataLeft.includes(true) || dataFront.includes(true)){
                          map.panBy([0, -deltaDistance], {
                              easing: easing
                          });
                          deltaDistance +=2;
                       }

                  }
                  else if (keyMap[37]) {
                      map.easeTo({
                          bearing: map.getBearing() - deltaDegrees,
                          easing: easing
                      });
                     deltaDegrees = 25
                     deltaDistance=30;

                  }
                  else if (keyMap[39]) {
                      map.easeTo({
                          bearing: map.getBearing() + deltaDegrees,
                          easing: easing
                         });
                     deltaDegrees = 25;
                     deltaDistance=30;
                  }
              }
              publishMove(map.getCenter());


              didUserWin(map.getCenter());

          }, true);

          map.getCanvas().addEventListener('keyup', function(e) {
              e.preventDefault();
               if (e.keyCode in keyMap) {
                  keyMap[e.keyCode] = false;
              }

          }, true);

        });

      function publishMove(newCenter){
        playerTracking.publish({
                channel: 'taxigame',
                message: {"name":name,"lng":newCenter.lng,"lat":newCenter.lat,"type":"move" }
        });
      }

        function didUserWin(cur){
          var d = distanceTwoPoints(cur.lat.toFixed(6), cur.lng.toFixed(6), endPoint[1], endPoint[0]);

          $('#distanceTag').text(d +' KM Left');
          if(d, d < 0.01){
            //WIN!
          }
        }

        function distanceTwoPoints(lat1, lon1, lat2, lon2) {
          var p = 0.017453292519943295;    // Math.PI / 180
          var c = Math.cos;
          var a = 0.5 - c((lat2 - lat1) * p)/2 +
                  c(lat1 * p) * c(lat2 * p) *
                  (1 - c((lon2 - lon1) * p))/2;

          return ((12742 * Math.asin(Math.sqrt(a)))*0.62137).toFixed(2); // 2 * R; R = 6371 km
        }


})();
