var playerTracking;
var map;
var players = [];
var playerMarkers =[];
var playerSmallMarkers =[];
var userId;
var name;
var endMarker1;
var map2;
var smallmapMarker;
var endpointMarkerMap1;
var endpointMarkerMap2;
var point;
var secondCounter = 0;
var t;
var keyMap = {38: false, 40: false, 39: false, 37: false};
var points = [
{
	name : 'Manchester',
	startPoints : [-2.23834, 53.4760],
	endPoint : [-2.243101, 53.487354]
},
{
	name : 'New York',
	startPoints : [ -73.990157, 40.732288],
	endPoint : [ -73.990157, 40.732488]
		// endPoint : [-73.985100, 40.747811]
	}
	]
	function distanceTwoPoints(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;    // Math.PI / 180
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p)/2 +
	c(lat1 * p) * c(lat2 * p) *
	(1 - c((lon2 - lon1) * p))/2;

	return ((12742 * Math.asin(Math.sqrt(a)))*0.62137).toFixed(2); // 2 * R; R = 6371 km
}

function reload(){
	$.ajax({
		url: "./getpoint"
	}).done(function(data) {
		point = data.currentPoint;
		map.setCenter(points[point].startPoints);
		map2.setCenter(points[point].startPoints);
		keyMap = {38: false, 40: false, 39: false, 37: false};
		endMarker1.style.backgroundImage = "url('./img/little_man.png')";
		smallmapMarker.setLngLat(points[point].startPoints);
		endpointMarkerMap1.setLngLat(points[point].endPoint);
		endpointMarkerMap2.setLngLat(points[point].endPoint);

		var d = distanceTwoPoints(points[point].startPoints[1], points[point].startPoints[0], points[point].endPoint[1], points[point].endPoint[0]);
		$('#distanceTag').text(d +' KM Left '+ points[point].name);
	});
}

$(function(){
		userId = Math.ceil((Math.random() * 100000000));

		$('#join').click(function(){
			name = $('#username').val();
			if(name === '') name = 'user';
			$('#login').hide();
		});
		
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
					keyMap = {};
	    		// display win message on phone screen
	    		var winnerName = obj.message.name;
	    		$('#winnerText').html(winnerName + '<br>WINS!<br>');
	    		$('#winnerText').html($('#notice').html() + '<br>NEW GAME!<br>STARTS IN:<br>');
	    		$('#notice').show();
	    		setTimeout(function(){
	    			$('#notice').hide();
	    			reload();
	    		}, 8000);
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
