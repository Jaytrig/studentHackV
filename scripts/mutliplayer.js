var playerTracking;
var map;
var players = [];
var playerMarkers =[];
var playerSmallMarkers =[];
var userId;
var name;
var map2;
var smallmapMarker;
var endpointMarkerMap1;
var endpointMarkerMap2;
var point;
var points = [
	{
		name : 'Manchester',
		startPoints : [-2.23834, 53.4760],
		endPoint : [-2.243101, 53.487354]
	},
	{
		name : 'New York',
		startPoints : [ -73.990157, 40.732288],
		endPoint : [ -73.990157, 40.732288]
		// endPoint : [-73.985100, 40.747811]
	}
]

function reload(){
  $.ajax({
  url: "./getpoint"
  }).done(function(data) {
    map.setCenter(points[point].startPoints);
    map2.setCenter(points[point].startPoints);

    smallmapMarker.setLngLat(points[point].startPoints);
    endpointMarkerMap1.setLngLat(points[point].endPoint);
    endpointMarkerMap2.setLngLat(points[point].endPoint);
  });
}

$(function(){
	$('#join').click(function(){
		name = $('#username').val();
		if(name !== '') name = 'user';
    	userId = name + Math.ceil((Math.random() * 100000));
    	$('#login').hide();
    	map.getCanvas().focus();
    	playerTracking = new PubNub({
			    publishKey: 'pub-c-bdf8080e-74cc-4302-86b0-2de8ada8fdd9',
			    subscribeKey: 'sub-c-8882bb02-0648-11e7-89e8-02ee2ddab7fe',
			    uuid: userId
			});

	playerTracking.subscribe({
	    channels: ['taxigame'],
	    withPresence: true
	});

	playerTracking.addListener({
	    message: function(obj){
	    	if(obj.message.type === 'win'){
	    		// display win message on phone screen
	    		var winnerName = obj.message.name;
	    		$('#notice').html(winnerName + '<br>WINS!<br>');
	    		$('#notice').html($('#notice').html + '<br>NEW GAME!<br>STARTS IN:<br>');
					reload();
	    	}
	    	if(userId !== obj.publisher){
		    	var newCenter = [obj.message.lng, obj.message.lat];
		    	players[obj.publisher] = newCenter;
		    	if(playerMarkers[obj.publisher] == undefined){
		    		  var el = document.createElement('div');
					  el.className = 'markerCar';

					  var playerMarker = new mapboxgl.Marker(el)
					                            .setLngLat([newCenter[0], newCenter[1]])
					                            .addTo(map);
					  playerMarkers[obj.publisher] = playerMarker;

					  //Small marker
					  var el = document.createElement('div');
					  el.className = 'marker';
					  el.style.background = 'blue';
					  el.style.width = '5px';
					  el.style.height = '5px';

					  var smallPlayerMarker = new mapboxgl.Marker(el)
					                            .setLngLat([newCenter[0], newCenter[1]])
					                            .addTo(map2);
					  playerSmallMarkers[obj.publisher] = smallPlayerMarker;
		    	}else{
		    		//find existing marker
		    		playerMarkers[obj.publisher].setLngLat([newCenter[0], newCenter[1]]);
		    		playerSmallMarkers[obj.publisher].setLngLat([newCenter[0], newCenter[1]]);

		    	}
		    }
	    }
	});

	playerTracking.hereNow(
		    {
		        channels: ["taxigame"]
		    },
		    function (status, response) {
		    	var allUsersIds = [];
		    	var usersArr = response.channels["taxigame"].occupants;
		    	for(var i =0;i<usersArr.length;i++){
		    		//update each users car/marker
		    	}
		    }
		);
  	});
});
